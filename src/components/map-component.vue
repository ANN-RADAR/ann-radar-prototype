<template>
  <div class="map-wrapper">
    <div id="map"></div>
    <div class="map-overlays top-right">
      <MapLayerSwitcher
        v-if="showLayerSwitcher"
        :thematicLayers="thematicLayerOptions"
        :thematicLayersTitle="layerSwitcherProps.thematicLayersTitle"
        :alwaysVisibleLayers="layerSwitcherProps.alwaysVisibleLayers"
      />
      <MapStyleSwitcher v-if="showStyleSwitcher" />
    </div>
    <div class="map-overlays bottom-right">
      <MapLegends v-if="showLegends" :thematicLayers="thematicLayerOptions" />
    </div>
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
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import {Draw, Modify} from 'ol/interaction';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

import {
  getMapStyleLayers,
  getAdminAreaLayers,
  getBaseLayers
} from '@/constants/layers';
import {dataLayerIds, dataLayerOptions} from '@/constants/data-layers';
import {adminLayers} from '@/constants/admin-layers';
import {
  getLaboratoriesLayer,
  laboratoriesStyles
} from '@/constants/laboratories-layers';
import {AdminLayerFeatureData} from '@/types/admin-layers';
import BaseLayer from 'ol/layer/Base';
import {DataLayerOptions, LayerOptions} from '@/types/layers';
import BaseEvent from 'ol/events/Event';
import TileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import {StyleFunction} from 'ol/style/Style';

import MapLayerSwitcher from './map-layer-switcher.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import MapLegends from './map-legends.vue';
import {LaboratoryId} from '@/types/laboratories';

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
  laboratoriesLayer: VectorLayer<VectorSource<Geometry>>;
  laboratoriesStyles: Record<string, StyleFunction | Style>;
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
      }>
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
    showDrawingTools: {
      type: Boolean,
      required: false,
      default: false
    },
    drawingSource: {
      type: VectorSource,
      required: false,
      default: null
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
    const laboratoriesLayer = getLaboratoriesLayer();

    return {
      map: null,
      mapStyleLayers,
      adminLayers,
      baseLayers,
      laboratoriesLayer,
      laboratoriesStyles,
      mapOptions: {
        target: 'map',
        controls: defaultControls().extend([new ScaleLine({units: 'metric'})]),
        layers: [mapStyleLayers, adminLayers, baseLayers, laboratoriesLayer],
        view: new View({
          projection: 'EPSG:25832',
          zoom: 12,
          minZoom: 9,
          maxZoom: 18,
          center: [565811, 5933977]
        })
      }
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
        .filter(({type}) => this.$route.params.laboratoryType === type)
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
    laboratories() {
      this.updateLaboratoriesFeatures();
    },
    hoveredLaboratoryId(newHoveredLaboratoryId: LaboratoryId | null) {
      this.laboratoryFeatures.forEach(feature => {
        const isHovered = feature.get('id') === newHoveredLaboratoryId;
        feature.set('hovered', isHovered);
      });
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchLayersConfig']),
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
      const laboratoriesSource = this.laboratoriesLayer.getSource();
      const hoveredLaboratoryId =
        hoveredFeatures
          .find(feature => laboratoriesSource.hasFeature(feature))
          ?.get('id') || null;
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
      const baseLayersAreVisible = Boolean(
        this.$route.path.startsWith('/potential')
      );

      for (const layer of this.allBaseLayers) {
        if (
          baseLayersAreVisible &&
          this.baseLayerTypes.includes(layer.get('name'))
        ) {
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

              const isSelected = !this.disableFeatureSelection
                ? this.currentLayerSelectedFeatureIds.includes(id)
                : false;
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
        const {data = [], dataId} = adminLayers[this.adminLayerType];
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
            dataId
          })
        );
      }
    },
    addDrawingTools() {
      if (this.map && this.drawingSource) {
        const vector = new VectorLayer({
          source: this.drawingSource,
          style: this.laboratoriesStyles.laboratoriesDrawAreaStyle
        });

        const modify = new Modify({
          source: this.drawingSource,
          style: this.laboratoriesStyles.laboratoriesModifyHandleStyle
        });
        this.map.addInteraction(modify);

        const draw = new Draw({
          source: this.drawingSource,
          type: 'Polygon',
          style: this.laboratoriesStyles.laboratoriesDrawHandleStyle
        });

        draw.on('drawstart', () => {
          if (this.drawingSource) {
            // TODO: ask if user wants to clear the drawing if there is already one
            this.drawingSource.clear();
          }
        });

        this.map.addInteraction(draw);
        this.map.addLayer(vector);
      }
    },
    toggleLaboratoriesLayer() {
      if (!this.map) {
        return;
      }

      const laboratoriesAreVisible = Boolean(this.$route.params.laboratoryType);
      this.laboratoriesLayer.setVisible(laboratoriesAreVisible);
    },
    updateLaboratoriesFeatures() {
      const laboratoriesSource = this.laboratoriesLayer.getSource();
      // Remove old laboratories
      laboratoriesSource.clear();
      // Add laboratories to the map
      laboratoriesSource.addFeatures(
        this.laboratoryFeatures.map(feature => {
          // Hide the laboratory from the laboratories layer
          // if the user is editing this laboratory
          const isEditingLaboratory =
            this.$route.params.laboratoryId === feature.get('id');
          feature.set('hidden', isEditingLaboratory);

          return feature;
        })
      );
    }
  },
  created() {
    this.fetchLayersConfig();
  },
  mounted() {
    this.map = new Map(this.mapOptions);

    // Update layers according to store data
    this.toggleMapStyleLayers();
    this.toggleAdminLayers();
    this.toggleBaseLayers();
    this.handleAdminAreaSelectionAndHighlighting();
    this.toggleLaboratoriesLayer();
    this.updateLaboratoriesFeatures();

    if (this.showDrawingTools) {
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
</style>
