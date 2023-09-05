<template>
  <div class="map-wrapper" ref="mapWrapper">
    <div id="map"></div>

    <div class="map-overlays top-right">
      <MapLayerSwitcher
        v-if="showLayerSwitcher"
        :thematicLayers="thematicLayerOptions"
        :thematicLayersTitle="
          layerSwitcherProps && layerSwitcherProps.thematicLayersTitle
        "
        :alwaysVisibleLayers="
          layerSwitcherProps && layerSwitcherProps.alwaysVisibleLayers
        "
      />
      <MapStyleSwitcher v-if="showStyleSwitcher" />
      <slot name="map-controls" />
    </div>
    <div class="map-overlays bottom-right">
      <MapLegends v-if="showLegends" :thematicLayers="thematicLayerOptions" />
    </div>

    <div class="map-info-window" ref="infoWindow">
      <v-btn text icon @click="closeInfoWindow">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="map-info-window-content" ref="infoWindowContent"></div>
    </div>

    <v-dialog
      v-model="showNewDrawingConfirmationDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title>Start a new drawing?</v-card-title>
        <v-card-text>
          Are you sure you want to start a new drawing on the map? Your current
          drawing will be deleted. This can not be undone.
        </v-card-text>
        <v-card-actions class="confirmation-dialog-actions">
          <v-btn
            color="blue"
            text
            @click="showNewDrawingConfirmationDialog = false"
          >
            Keep current drawing
          </v-btn>
          <v-btn color="blue" text @click="resetDrawing">
            Start new drawing
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

import {
  MapActionsToMethods,
  MapGettersToComputed,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';

import 'ol/ol.css';
import {Feature, Map, MapBrowserEvent, Overlay, View} from 'ol';
import {MapOptions} from 'ol/PluggableMap';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import {Style} from 'ol/style';
import {StyleFunction} from 'ol/style/Style';
import BaseEvent from 'ol/events/Event';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import Geometry from 'ol/geom/Geometry';
import TileSource from 'ol/source/Tile';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import {DragBox, Draw, Interaction, Modify, Select} from 'ol/interaction';
import {platformModifierKeyOnly, pointerMove} from 'ol/events/condition';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import {getWidth} from 'ol/extent';

import {
  getMapStyleLayers,
  getAdminAreaLayers,
  getBaseLayers,
  getLabortoriesLayers,
  createBuildingLayerStyle,
  getMobilityIsochronesLayer
} from '@/constants/layers';
import {dataLayerIds, dataLayerOptions} from '@/constants/data-layers';
import {adminLayers} from '@/constants/admin-layers';
import {drawHandleStyle, modifyHandleStyle} from '@/constants/map-layer-styles';

import {getInfoWindowContentFromXML} from '@/libs/info-window-content';

import {AdminLayerFeatureData} from '@/types/admin-layers';
import {DataLayerOptions, LayerOptions} from '@/types/layers';
import {LaboratoryId} from '@/types/laboratories';

import MapLayerSwitcher from './map-layer-switcher.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import MapLegends from './map-legends.vue';
import {TileWMS} from 'ol/source';

// projection for UTM zone 32N
proj4.defs(
  'EPSG:3857',
  '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
register(proj4);

const dragBox = new DragBox({
  condition: platformModifierKeyOnly
});

type Data = {
  map: null | Map;
  infoWindow: null | Overlay;
  mapOptions: MapOptions;
  mapStyleLayers: LayerGroup;
  adminLayers: LayerGroup;
  baseLayers: LayerGroup;
  laboratoriesLayers: LayerGroup;
  mobilityIsochronesLayer: VectorLayer<VectorSource<Geometry>>;
  showNewDrawingConfirmationDialog: boolean;
  drawHandleStyle: StyleFunction | Style;
  modifyHandleStyle: StyleFunction | Style;
  drawingInteractions: Array<Interaction>;
  drawingLayer: VectorLayer<VectorSource<Geometry>> | null;
};

export default Vue.extend({
  components: {
    MapLayerSwitcher,
    MapStyleSwitcher,
    MapLegends
  },
  props: {
    showLayerSwitcher: {
      type: Boolean,
      required: false,
      default: false
    },
    thematicLayerOptions: {
      type: Array as PropType<Array<LayerOptions>>,
      required: false
    },
    layerSwitcherProps: {
      type: Object as PropType<{
        thematicLayersTitle?: string;
        alwaysVisibleLayers?: Array<string>;
      }>,
      required: false
    },
    showStyleSwitcher: {
      type: Boolean,
      required: false,
      default: false
    },
    showLegends: {
      type: Boolean,
      required: false,
      default: false
    },
    hasMultipleFeatureSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    hasDrawingTools: {
      type: Boolean,
      required: false,
      default: false
    },
    drawingOptions: {
      type: Object as PropType<{
        source: VectorSource<Geometry>;
        mode: 'draw' | 'erase';
        type: string;
        style: StyleFunction | Style;
        maxNumberOfDrawings?: number;
      }>,
      required: false,
      default: () =>
        ({} as {
          source: VectorSource<Geometry>;
          mode: 'draw' | 'erase';
          type: string;
          style: StyleFunction | Style;
          maxNumberOfDrawings?: number;
        })
    },
    highlightedFeatureIds: {
      type: Array as PropType<Array<string>>,
      required: false
    },
    disableFeatureSelection: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data(): Data {
    const mapStyleLayers = getMapStyleLayers();
    const adminLayers = getAdminAreaLayers();
    const baseLayers = getBaseLayers();
    const laboratoriesLayers = getLabortoriesLayers();
    const mobilityIsochronesLayer = getMobilityIsochronesLayer();

    return {
      map: null,
      infoWindow: null,
      mapStyleLayers,
      adminLayers,
      baseLayers,
      laboratoriesLayers,
      mobilityIsochronesLayer,
      mapOptions: {
        target: 'map',
        controls: defaultControls().extend([new ScaleLine({units: 'metric'})]),
        layers: [
          mapStyleLayers,
          adminLayers,
          baseLayers,
          laboratoriesLayers,
          mobilityIsochronesLayer
        ],
        view: new View({
          projection: 'EPSG:3857',
          zoom: 12,
          minZoom: 9,
          maxZoom: 18,
          center: [1113052.5963, 7084613.6599]
        })
      },
      showNewDrawingConfirmationDialog: false,
      drawHandleStyle,
      modifyHandleStyle,
      drawingInteractions: [],
      drawingLayer: null
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerData',
      'adminLayerType',
      'mapStyle',
      'baseLayerTypes',
      'baseLayerOptions',
      'layersConfig',
      'layerClassificationSelection',
      'laboratories',
      'hoveredLaboratoryId',
      'mobilityIsochrones'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ]),
    allBaseLayers(): Array<BaseLayer> {
      return this.baseLayers.getLayers().getArray();
    },
    allLaboratoriesLayers(): Array<VectorLayer<VectorSource<Geometry>>> {
      return this.laboratoriesLayers.getLayers().getArray() as Array<
        VectorLayer<VectorSource<Geometry>>
      >;
    },
    allMapStyleLayers(): Array<TileLayer<TileSource>> {
      return this.mapStyleLayers.getLayers().getArray() as Array<
        TileLayer<TileSource>
      >;
    },
    allAdminLayers(): Array<VectorLayer<VectorSource<Geometry>>> {
      return this.adminLayers.getLayers().getArray() as Array<
        VectorLayer<VectorSource<Geometry>>
      >;
    },
    laboratoryFeatures(): Array<Feature<Geometry>> {
      return Object.values(this.laboratories)
        .filter(
          ({type}) =>
            this.$route.params.laboratoryType === type ||
            this.baseLayerTypes.includes(type)
        )
        .map(({feature}) => feature);
    }
  },
  watch: {
    mapStyle() {
      this.toggleMapStyleLayers();
    },
    adminLayerType() {
      this.toggleAdminLayers();

      // Update source and style of data layers
      for (const layer of this.allBaseLayers) {
        if (layer.getVisible()) {
          if (dataLayerIds.includes(layer.get('name'))) {
            this.updateDataLayer(layer, dataLayerOptions);
          }
        }
      }
    },
    baseLayerTypes() {
      this.toggleBaseLayers();
      this.toggleLaboratoriesLayers();
    },
    baseLayerOptions(newBaseLayerOptions: Record<string, string>) {
      this.allBaseLayers.forEach(layer => {
        const newBaseLayerOption = newBaseLayerOptions[layer.get('name')];

        if (newBaseLayerOption) {
          // Update vector layer styles
          if (layer instanceof VectorTileLayer) {
            layer.setStyle(createBuildingLayerStyle(newBaseLayerOption));
            return;
          }

          // Toggle visibility of sublayers in tile layer groups
          if (layer instanceof LayerGroup) {
            const sublayers = layer.getLayersArray();

            for (const sublayer of sublayers) {
              const source = sublayer.getSource();

              if (source instanceof TileWMS) {
                const sourceLayers = Array.isArray(source.getParams().LAYERS)
                  ? source.getParams().LAYERS
                  : [source.getParams().LAYERS];
                const isVisible = sourceLayers.includes(newBaseLayerOption);
                sublayer.setVisible(isVisible);
              }
            }
          }
        }
      });
    },
    layerClassificationSelection() {
      // Update style of data layers
      for (const layer of this.allBaseLayers) {
        if (layer.getVisible()) {
          if (
            dataLayerIds.includes(layer.get('name')) &&
            dataLayerOptions.style
          ) {
            this.updateDataLayerStyle(layer, dataLayerOptions.style);
          }
        }
      }
    },
    currentLayerSelectedFeatureIds() {
      this.handleAdminAreaSelectionAndHighlighting();
    },
    highlightedFeatureIds() {
      this.handleAdminAreaSelectionAndHighlighting();
    },
    $route() {
      this.updateLaboratoriesFeatures();
      this.toggleMobilityIsochronesLayer();
    },
    laboratories() {
      this.updateLaboratoriesFeatures();
    },
    hoveredLaboratoryId(newHoveredLaboratoryId: LaboratoryId | null) {
      const isLaboratoriesView = Boolean(this.$route.params.laboratoryType);

      this.laboratoryFeatures.forEach(feature => {
        const isHovered = feature.get('id') === newHoveredLaboratoryId;
        feature.set('hovered', isLaboratoriesView && isHovered);
      });
    },
    hasDrawingTools(newHasDrawingTools: boolean) {
      if (newHasDrawingTools) {
        this.addDrawingTools();
      } else {
        this.removeDrawingTools();
      }
    },
    'drawingOptions.source'() {
      this.updateDrawingLayer();
    },
    'drawingOptions.mode'() {
      if (this.hasDrawingTools) {
        // Update drawing tools
        this.removeDrawingTools();
        this.addDrawingTools();
      }
    },
    mobilityIsochrones() {
      this.updateMobilityIsochronesFeatures();
    },
    hasMultipleFeatureSelection() {
      this.toggleBoxSelection();
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchLayersConfig',
      'fetchLaboratories'
    ]),
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setSelectedFeatureIdsOfAdminLayer',
      'setHoveredLaboratoryId'
    ]),
    handleClickOnMap(event: MapBrowserEvent<UIEvent>) {
      if (this.disableFeatureSelection) {
        return;
      }

      const coord = this.map?.getCoordinateFromPixel(event.pixel);

      if (!coord) {
        return;
      }

      let selectedFeatureIds = [...this.currentLayerSelectedFeatureIds];

      for (const layer of this.allAdminLayers) {
        if (this.adminLayerType && layer.get('name') === this.adminLayerType) {
          const {featureId} = adminLayers[this.adminLayerType];
          const clickedFeatures = layer
            .getSource()
            .getFeaturesAtCoordinate(coord);

          clickedFeatures.forEach(feature => {
            const id = feature.get(featureId);

            // Toggle the clicked feature's keys
            if (
              selectedFeatureIds.some(featureId => String(featureId) === id)
            ) {
              selectedFeatureIds = selectedFeatureIds.filter(
                featureId => String(featureId) !== id
              );
            } else {
              if (this.hasMultipleFeatureSelection) {
                selectedFeatureIds.push(id);
              } else {
                selectedFeatureIds = [id];
              }
            }
          });

          this.setSelectedFeatureIdsOfAdminLayer({
            adminLayerType: this.adminLayerType,
            featureIds: selectedFeatureIds
          });
        }
      }
    },
    handleBoxEnd() {
      if (!this.map || !this.adminLayerType) {
        return;
      }

      const adminLayer = this.allAdminLayers.find(
        layer => layer.get('name') === this.adminLayerType
      );
      const adminLayerSource = adminLayer?.getSource();

      if (!adminLayerSource) {
        return;
      }

      const {featureId} = adminLayers[this.adminLayerType];
      let selectedFeatureIds = [...this.currentLayerSelectedFeatureIds];

      /**
       * OpenLayers Box Selection
       * https://openlayers.org/en/latest/examples/box-selection.html
       */
      const boxExtent = dragBox.getGeometry().getExtent();
      // if the extent crosses the antimeridian process each world separately
      const worldExtent = this.map.getView().getProjection().getExtent();
      const worldWidth = getWidth(worldExtent);
      const startWorld = Math.floor(
        (boxExtent[0] - worldExtent[0]) / worldWidth
      );
      const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);

      for (let world = startWorld; world <= endWorld; ++world) {
        const left = Math.max(
          boxExtent[0] - world * worldWidth,
          worldExtent[0]
        );
        const right = Math.min(
          boxExtent[2] - world * worldWidth,
          worldExtent[2]
        );
        const extent = [left, boxExtent[1], right, boxExtent[3]];

        // features that intersect the box geometry are added to the
        // collection of selected features (if not already included)
        const boxFeatures = adminLayerSource
          .getFeaturesInExtent(extent)
          .filter(
            feature =>
              !selectedFeatureIds.includes(feature.get(featureId)) &&
              feature.getGeometry()?.intersectsExtent(extent)
          );

        // if the view is not obliquely rotated the box geometry and
        // its extent are equalivalent so intersecting features can
        // be added directly to the collection
        const rotation = this.map.getView().getRotation();
        const oblique = rotation % (Math.PI / 2) !== 0;

        // when the view is obliquely rotated the box extent will
        // exceed its geometry so both the box and the candidate
        // feature geometries are rotated around a common anchor
        // to confirm that, with the box geometry aligned with its
        // extent, the geometries intersect
        if (oblique) {
          const anchor = [0, 0];
          const geometry = dragBox.getGeometry().clone();
          geometry.translate(-world * worldWidth, 0);
          geometry.rotate(-rotation, anchor);
          const extent = geometry.getExtent();
          boxFeatures.forEach(function (feature) {
            const id = feature.get(featureId);
            const geometry = feature.getGeometry()?.clone();

            geometry?.rotate(-rotation, anchor);

            if (geometry?.intersectsExtent(extent)) {
              selectedFeatureIds.push(id);
            }
          });
        } else {
          const boxFeatureIds = boxFeatures.map(feature =>
            feature.get(featureId)
          );
          selectedFeatureIds.push(...boxFeatureIds);
        }
      }

      this.setSelectedFeatureIdsOfAdminLayer({
        adminLayerType: this.adminLayerType,
        featureIds: selectedFeatureIds
      });
    },
    toggleBoxSelection() {
      if (this.hasMultipleFeatureSelection) {
        // Enable box selection for map with multiple feature selection
        this.map?.addInteraction(dragBox);
        dragBox.on('boxend', this.handleBoxEnd);
      } else {
        // Enable box selection for map without multiple feature selection
        dragBox.un('boxend', this.handleBoxEnd);
        this.map?.removeInteraction(dragBox);
      }
    },
    handleHoverOnMap(event: MapBrowserEvent<UIEvent>) {
      const hoveredFeatures = this.map?.getFeaturesAtPixel(
        event.pixel
      ) as Array<Feature<Geometry>>;

      // Highlight hovered laboratory feature
      const hoveredLaboratoryFeature = hoveredFeatures.find(feature =>
        this.allLaboratoriesLayers.some(layer =>
          layer.getSource().hasFeature(feature)
        )
      );
      const hoveredLaboratoryId = hoveredLaboratoryFeature?.get('id') || null;
      this.setHoveredLaboratoryId(hoveredLaboratoryId);
    },
    toggleMapStyleLayers() {
      for (const layer of this.allMapStyleLayers) {
        if (layer.get('name') === this.mapStyle) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    toggleAdminLayers() {
      for (const layer of this.allAdminLayers) {
        if (layer.get('name') === this.adminLayerType) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    toggleBaseLayers() {
      for (const layer of this.allBaseLayers) {
        if (this.baseLayerTypes.includes(layer.get('name'))) {
          layer.setVisible(true);

          // Update source and style of data layers
          if (dataLayerIds.includes(layer.get('name'))) {
            this.updateDataLayer(layer, dataLayerOptions);
            continue;
          }

          // Toggle visibility of sublayers in tile layer groups
          const baseLayerOption = this.baseLayerOptions[layer.get('name')];

          if (baseLayerOption && layer instanceof LayerGroup) {
            const sublayers = layer.getLayersArray();

            for (const sublayer of sublayers) {
              const source = sublayer.getSource();

              if (source instanceof TileWMS) {
                const sourceLayers = Array.isArray(source.getParams().LAYERS)
                  ? source.getParams().LAYERS
                  : [source.getParams().LAYERS];
                const isVisible = sourceLayers.includes(baseLayerOption);
                sublayer.setVisible(isVisible);
              }
            }
          }
        } else {
          layer.setVisible(false);
        }
      }
    },
    handleAdminAreaSelectionAndHighlighting() {
      for (const layer of this.allAdminLayers) {
        if (this.adminLayerType && layer.get('name') === this.adminLayerType) {
          const {featureId} = adminLayers[this.adminLayerType];

          const sourceLoadingHandler = (event: BaseEvent) => {
            const source = event.target as VectorSource<Geometry>;
            if (source.getState() === 'ready') {
              handleSelectionAndHighlighting(source.getFeatures());
            }
          };

          const handleSelectionAndHighlighting = (
            features: Array<Feature<Geometry>>
          ) => {
            adminLayerSource.un('change', sourceLoadingHandler);

            features.forEach(feature => {
              const id = feature.get(featureId);

              const isSelected =
                !this.disableFeatureSelection &&
                this.currentLayerSelectedFeatureIds.includes(id);
              feature.set('selected', isSelected);

              const isHighlighted = this.highlightedFeatureIds?.includes(id);
              feature.set('highlighted', isHighlighted);
            });
          };

          const adminLayerSource = layer.getSource();
          const adminLayerFeatures = adminLayerSource.getFeatures();

          if (adminLayerFeatures.length) {
            handleSelectionAndHighlighting(adminLayerFeatures);
          } else {
            // Wait for source to be loaded
            adminLayerSource.on('change', sourceLoadingHandler);
          }
        }
      }
    },
    updateDataLayer(layer: BaseLayer, dataLayerOptions: DataLayerOptions) {
      if (dataLayerOptions.sources) {
        this.updateDataLayerSource(layer, dataLayerOptions.sources);
      }
      if (dataLayerOptions.style) {
        this.updateDataLayerStyle(layer, dataLayerOptions.style);
      }
    },
    updateDataLayerSource(
      layer: BaseLayer,
      dataLayerSources: Exclude<DataLayerOptions['sources'], undefined>
    ) {
      // Update the source depending on the current admin layer type
      if (this.adminLayerType) {
        const sourceOptions = dataLayerSources[this.adminLayerType];
        (layer as VectorLayer<VectorSource<Geometry>>).setSource(
          new VectorSource(sourceOptions)
        );
      }
    },
    updateDataLayerStyle(
      layer: BaseLayer,
      dataLayerStyle: Exclude<DataLayerOptions['style'], undefined>
    ) {
      const layerConfig = this.layersConfig[layer.get('name')];
      const selectedClassificationIndex =
        this.layerClassificationSelection[layer.get('name')];

      // Update the style depending on the layer config and data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (this.adminLayerType && layerConfig && (layer as any).setStyle) {
        const data = this.adminLayerData[this.adminLayerType];
        const {dataId, featureId} = adminLayers[this.adminLayerType];
        const adminLayerDataById: Record<string, AdminLayerFeatureData> =
          data.reduce(
            (byId, data) => ({...byId, [String(data[dataId])]: data}),
            {}
          );

        (layer as VectorLayer<VectorSource<Geometry>>).setStyle(
          dataLayerStyle({
            layerConfig,
            selectedClassificationIndex,
            adminLayerDataById,
            featureId
          })
        );
      }
    },
    updateDrawingLayer() {
      if (!this.map || (!this.drawingOptions.source && !this.drawingLayer)) {
        return;
      }

      if (!this.drawingOptions.source && this.drawingLayer) {
        this.map.removeLayer(this.drawingLayer);
        return;
      }

      this.drawingLayer = new VectorLayer({
        source: this.drawingOptions.source,
        style: this.drawingOptions.style,
        zIndex: 8
      });

      this.map.addLayer(this.drawingLayer);
    },
    addDrawingTools() {
      if (this.map && this.drawingLayer) {
        if (this.drawingOptions.mode === 'draw') {
          // Add interactions to draw and modify features on the map
          const draw = new Draw({
            source: this.drawingOptions.source,
            type: this.drawingOptions.type,
            style: this.drawHandleStyle
          });

          if (this.drawingOptions.maxNumberOfDrawings != null) {
            draw.on('drawstart', () => {
              const numberOfFeaturesDrawn =
                this.drawingOptions.source.getFeatures().length;

              if (
                this.drawingOptions.maxNumberOfDrawings != null &&
                numberOfFeaturesDrawn >= this.drawingOptions.maxNumberOfDrawings
              ) {
                if (this.drawingOptions.type !== 'Point') {
                  draw.abortDrawing();
                }
                this.showNewDrawingConfirmationDialog = true;
              }
            });
          }

          this.drawingInteractions.push(draw);
          this.map.addInteraction(draw);

          const modify = new Modify({
            source: this.drawingOptions.source,
            style: this.modifyHandleStyle
          });
          this.drawingInteractions.push(modify);
          this.map.addInteraction(modify);
        } else {
          // Add interaction to select and delete drawn features on the map
          const select = new Select({
            condition: pointerMove,
            layers: [this.drawingLayer],
            style: this.modifyHandleStyle
          });
          this.drawingInteractions.push(select);
          this.map.addInteraction(select);

          this.map?.on('click', this.handleDeleteDrawnFeature);
        }
      }
    },
    removeDrawingTools() {
      // Remove drawing interactions from the map
      this.drawingInteractions.forEach(interaction => {
        this.map?.removeInteraction(interaction);
      });

      // Clean up event listeners
      this.map?.un('click', this.handleDeleteDrawnFeature);
    },
    handleDeleteDrawnFeature() {
      // Delete selected features from the drawing source
      this.drawingInteractions.forEach(interaction => {
        if (interaction instanceof Select) {
          const selectedFeatures = interaction.getFeatures();
          selectedFeatures.forEach(feature =>
            this.drawingOptions.source.removeFeature(feature)
          );
        }
      });
    },
    resetDrawing() {
      this.drawingOptions.source?.clear();
      this.showNewDrawingConfirmationDialog = false;
    },
    toggleMobilityIsochronesLayer() {
      if (!this.map) {
        return;
      }

      const layerIsVisible = this.$route.path.startsWith('/potential/mobility');
      this.mobilityIsochronesLayer.setVisible(layerIsVisible);
    },
    updateMobilityIsochronesFeatures() {
      const source = this.mobilityIsochronesLayer.getSource();

      // Remove old isochrones polygons
      source.clear();

      // Add isochrones polygons to the map
      Object.values(this.mobilityIsochrones).forEach(locationFeatures => {
        locationFeatures.forEach(feature => {
          source.addFeature(
            new GeoJSON().readFeature(feature, {
              featureProjection: 'EPSG:3857'
            })
          );
        });
      });
    },
    toggleLaboratoriesLayers() {
      if (!this.map) {
        return;
      }

      for (const layer of this.allLaboratoriesLayers) {
        const layerIsVisible =
          this.$route.params.laboratoryType === layer.get('name') ||
          (!this.$route.path.startsWith('/urban-testbeds') &&
            this.baseLayerTypes.includes(layer.get('name')));

        layer.setVisible(layerIsVisible);
      }
    },
    updateLaboratoriesFeatures() {
      for (const layer of this.allLaboratoriesLayers) {
        const laboratoriesSource = layer.getSource();

        // Remove old laboratories
        laboratoriesSource.clear();

        // Add laboratories to the map
        laboratoriesSource.addFeatures(
          Object.values(this.laboratories)
            .filter(({type}) => type === layer.get('name'))
            .map(({feature}) => {
              // Hide the laboratory from the laboratories layer
              // if the user is editing this laboratory
              const isEditingLaboratory =
                this.$route.params.laboratoryId === feature.get('id');
              feature.set('hidden', isEditingLaboratory);
              feature.set('hovered', false);

              return feature;
            })
        );
      }
    },
    setupInfoWindow() {
      const infoWindowContainerElement = this.$refs.infoWindow as HTMLElement;

      this.infoWindow = new Overlay({
        element: infoWindowContainerElement,
        autoPan: {
          animation: {
            duration: 250
          }
        }
      });
      this.map?.addOverlay(this.infoWindow);
    },
    openInfoWindow(position: number[], content: string) {
      const infoWindowContentElement = this.$refs.infoWindowContent as Element;
      infoWindowContentElement.innerHTML = content;
      this.infoWindow?.setPosition(position);
    },
    closeInfoWindow() {
      this.infoWindow?.setPosition(undefined);
    },
    handleClickOutsideInfoWindow() {
      // Close info window when user clicked anywhere on the map /
      // outside the info window
      this.closeInfoWindow();
    },
    handleClickOutsideMap(event: MouseEvent) {
      const mapWrapperElement = this.$refs.mapWrapper as Element;

      // Close info window when user clicked outside the map
      if (
        !(event.target instanceof Node) ||
        !mapWrapperElement.contains(event.target)
      ) {
        this.closeInfoWindow();
      }
    },
    async handleTileLayersInfoWindow(event: MouseEvent) {
      // Prevent opening context menu
      event.preventDefault();

      const position = this.map?.getEventCoordinate(event);
      const view = this.map?.getView();
      const viewResolution = view?.getResolution();

      if (!position || viewResolution === undefined) {
        this.closeInfoWindow();
        return;
      }

      // Display info window for tile layers "Social Infrastructure",
      // "Building and Living", "Street Tree Cadastre" and "Specific Heat Demand"
      const layers = this.allBaseLayers
        .filter(layer => {
          const name = layer.get('name');
          const layersWithInfoWindow = [
            'buildingAndLiving',
            'socialInfrastructure',
            'streetTreeCadastre',
            'heatAtlas'
          ];

          return layersWithInfoWindow.includes(name);
        })
        .map(layerGroup => layerGroup?.getLayersArray() || [])
        .flat()
        .filter(layer => layer.getVisible());
      const sources = layers.map(layer => layer.getSource());

      let featureInfo = null;

      // Fetch feature info for all tile layer sources at the clicked location
      for await (const source of sources) {
        const projectionCode = source.getProjection().getCode();
        const featureInfoUrl = source.getFeatureInfoUrl(
          position,
          viewResolution,
          projectionCode,
          {INFO_FORMAT: 'text/xml'}
        );

        if (!featureInfoUrl) {
          continue;
        }

        await fetch(featureInfoUrl)
          .then(response => response.text())
          .then(text => {
            // Parse xml response and create a definition list from it
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            const hasContent = Boolean(
              xmlDoc.getElementsByTagName('gml:featureMember').length
            );

            if (!hasContent) {
              return;
            }

            featureInfo = getInfoWindowContentFromXML(xmlDoc);
          });
      }

      // Open the info window if feature info was found for the clicked position,
      // otherwise close the previous shown info window.
      if (featureInfo) {
        this.openInfoWindow(position, featureInfo);
      } else {
        this.closeInfoWindow();
      }
    }
  },
  created() {
    this.fetchLayersConfig();
    this.fetchLaboratories();
  },
  mounted() {
    this.map = new Map(this.mapOptions);

    // Update layers according to store data
    this.toggleMapStyleLayers();
    this.toggleAdminLayers();
    this.toggleBaseLayers();
    this.handleAdminAreaSelectionAndHighlighting();
    this.toggleLaboratoriesLayers();
    this.updateLaboratoriesFeatures();
    this.toggleMobilityIsochronesLayer();
    this.updateMobilityIsochronesFeatures();

    if (this.drawingOptions?.source) {
      this.updateDrawingLayer();
    }
    if (this.hasDrawingTools) {
      this.addDrawingTools();
    }

    // Handle info window
    this.setupInfoWindow();
    this.map
      .getViewport()
      .addEventListener('contextmenu', this.handleTileLayersInfoWindow);
    this.map.on('click', this.handleClickOutsideInfoWindow);
    document.body.addEventListener('click', this.handleClickOutsideMap);

    // Select map features
    this.map.on('click', this.handleClickOnMap);
    this.toggleBoxSelection();
    // Hover map features
    this.map.on('pointermove', this.handleHoverOnMap);
  },
  beforeDestroy() {
    // Clean up event listeners
    document.body.removeEventListener('click', this.handleClickOutsideMap);
  }
});
</script>

<style scoped>
.map-wrapper {
  position: relative;
  grid-area: left;
}

#map {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.map-overlays {
  position: absolute;
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
  padding: 8px;
}

.map-overlays.top-right {
  top: 0;
  right: 0;
}

.map-overlays.bottom-right {
  bottom: 0;
  right: 0;
}

.map-info-window {
  position: absolute;
  bottom: 16px;
  left: -48px;
  min-width: 10rem;
  max-width: 40vw;
  padding: 16px 52px 16px 16px;
  border-radius: 4px;
  background-color: #f5f5f5;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.map-info-window:after,
.map-info-window:before {
  content: '';
  position: absolute;
  top: 100%;
  left: 48px;
  height: 0;
  width: 0;
  border: solid transparent;
  pointer-events: none;
}

.map-info-window:after {
  margin-left: -14px;
  border-width: 14px;
  border-top-color: #f5f5f5;
}

.map-info-window:before {
  margin-left: -16px;
  border-width: 16px;
  border-top-color: rgba(0, 0, 0, 0.14);
}

.map-info-window > button {
  position: absolute;
  top: 8px;
  right: 8px;
}

.map-info-window-content {
  max-height: 50vh;
  overflow: auto;
}

.map-info-window-content::v-deep dt {
  font-weight: 500;
}

.map-info-window-content::v-deep dt:not(:first-child) {
  margin-top: 0.3em;
}

.map-info-window-content::v-deep dd > dl {
  margin-left: 0.5em;
}

.confirmation-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
}
</style>
