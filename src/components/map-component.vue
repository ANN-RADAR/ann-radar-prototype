<template>
  <div class="map-wrapper">
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
import {Feature, Map, MapBrowserEvent, View} from 'ol';
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
import {Draw, Interaction, Modify, Select} from 'ol/interaction';
import {pointerMove} from 'ol/events/condition';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

import {
  getMapStyleLayers,
  getAdminAreaLayers,
  getBaseLayers,
  getLabortoriesLayers
} from '@/constants/layers';
import {dataLayerIds, dataLayerOptions} from '@/constants/data-layers';
import {adminLayers} from '@/constants/admin-layers';
import {drawHandleStyle, modifyHandleStyle} from '@/constants/map-layer-styles';

import {AdminLayerFeatureData} from '@/types/admin-layers';
import {DataLayerOptions, LayerOptions} from '@/types/layers';
import {LaboratoryId} from '@/types/laboratories';

import MapLayerSwitcher from './map-layer-switcher.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import MapLegends from './map-legends.vue';

// projection for UTM zone 32N
proj4.defs(
  'EPSG:25832',
  '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
register(proj4);

type Data = {
  map: null | Map;
  mapOptions: MapOptions;
  mapStyleLayers: LayerGroup;
  adminLayers: LayerGroup;
  baseLayers: LayerGroup;
  laboratoriesLayers: LayerGroup;
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

    return {
      map: null,
      mapStyleLayers,
      adminLayers,
      baseLayers,
      laboratoriesLayers,
      mapOptions: {
        target: 'map',
        controls: defaultControls().extend([new ScaleLine({units: 'metric'})]),
        layers: [mapStyleLayers, adminLayers, baseLayers, laboratoriesLayers],
        view: new View({
          projection: 'EPSG:25832',
          zoom: 12,
          minZoom: 9,
          maxZoom: 18,
          center: [565811, 5933977]
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
      'adminLayerType',
      'mapStyle',
      'baseLayerTypes',
      'layersConfig',
      'layerClassificationSelection',
      'laboratories',
      'hoveredLaboratoryId'
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
        const {data = [], dataId, featureId} = adminLayers[this.adminLayerType];
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

    if (this.drawingOptions?.source) {
      this.updateDrawingLayer();
    }
    if (this.hasDrawingTools) {
      this.addDrawingTools();
    }

    // Select map features
    this.map.on('click', this.handleClickOnMap);
    // Hover map features
    this.map.on('pointermove', this.handleHoverOnMap);
  }
});
</script>

<style scoped>
.map-wrapper {
  position: relative;
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

.confirmation-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
}
</style>
