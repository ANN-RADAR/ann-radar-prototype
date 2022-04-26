<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue from 'vue';
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
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

import {
  getMapStyleLayers,
  getAdminAreaLayers,
  getBaseLayers
} from '@/constants/layers';
import {dataLayers} from '@/constants/data-layers';
import {adminLayers} from '@/constants/admin-layers';
import {AdminLayerFeatureData} from '@/types/admin-layers';
import BaseLayer from 'ol/layer/Base';
import {DataLayerOptions} from '@/types/layers';
import BaseEvent from 'ol/events/Event';

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
};

export default Vue.extend({
  props: {
    hasMultipleFeatureSelection: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data(): Data {
    const mapStyleLayers = getMapStyleLayers();
    const adminLayers = getAdminAreaLayers();
    const baseLayers = getBaseLayers();

    return {
      map: null,
      mapStyleLayers,
      adminLayers,
      baseLayers,
      mapOptions: {
        target: 'map',
        controls: defaultControls().extend([new ScaleLine({units: 'metric'})]),
        layers: [mapStyleLayers, adminLayers, baseLayers],
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
      'layerClassificationSelection'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureDataKeys'
    ])
  },
  watch: {
    mapStyle() {
      this.toggleMapStyleLayers();
    },
    adminLayerType() {
      this.toggleAdminLayers();

      // Update source and style of data layers
      for (const layer of this.baseLayers.getLayers().getArray()) {
        if (layer.getVisible()) {
          const dataLayerOptions = dataLayers[layer.get('name')];
          if (dataLayerOptions) {
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
      for (const layer of this.baseLayers.getLayers().getArray()) {
        if (layer.getVisible()) {
          const dataLayerOptions = dataLayers[layer.get('name')];
          if (dataLayerOptions && dataLayerOptions.style) {
            this.updateDataLayerStyle(layer, dataLayerOptions.style);
          }
        }
      }
    },
    currentLayerSelectedFeatureDataKeys() {
      this.handleAdminAreaSelection();
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchLayersConfig']),
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setSelectedFeatureDataKeys'
    ]),
    handleClickOnMap(event: MapBrowserEvent<UIEvent>) {
      const coord = this.map?.getCoordinateFromPixel(event.pixel);

      if (!coord) {
        return;
      }

      let selectedFeatureDataKeys = [
        ...this.currentLayerSelectedFeatureDataKeys
      ];

      for (const layer of this.adminLayers.getLayers().getArray() as Array<
        VectorLayer<VectorSource<Geometry>>
      >) {
        if (this.adminLayerType && layer.get('name') === this.adminLayerType) {
          const {featureId} = adminLayers[this.adminLayerType];
          const clickedFeatures = layer
            .getSource()
            .getFeaturesAtCoordinate(coord);

          clickedFeatures.forEach(feature => {
            const id = feature.get(featureId);

            // Toggle the clicked feature's keys
            if (
              selectedFeatureDataKeys.some(
                keys => String(keys.featureId) === id
              )
            ) {
              selectedFeatureDataKeys = selectedFeatureDataKeys.filter(
                keys => String(keys.featureId) !== id
              );
            } else {
              const featureDataKeys = {featureId: id};

              if (this.hasMultipleFeatureSelection) {
                selectedFeatureDataKeys.push(featureDataKeys);
              } else {
                selectedFeatureDataKeys = [featureDataKeys];
              }
            }
          });

          this.setSelectedFeatureDataKeys({
            adminLayerType: this.adminLayerType,
            keys: selectedFeatureDataKeys
          });
        }
      }
      // TODO: Add selected feature id / name to store
    },
    toggleMapStyleLayers() {
      for (const layer of this.mapStyleLayers.getLayers().getArray()) {
        if (layer.get('name') === this.mapStyle) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    toggleAdminLayers() {
      for (const layer of this.adminLayers.getLayers().getArray()) {
        if (layer.get('name') === this.adminLayerType) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    toggleBaseLayers() {
      for (const layer of this.baseLayers.getLayers().getArray()) {
        if (this.baseLayerTypes.includes(layer.get('name'))) {
          layer.setVisible(true);

          const dataLayerOptions = dataLayers[layer.get('name')];
          // Update source and style of data layers
          if (dataLayerOptions) {
            this.updateDataLayer(layer, dataLayerOptions);
          }
        } else {
          layer.setVisible(false);
        }
      }
    },
    handleAdminAreaSelection() {
      for (const layer of this.adminLayers.getLayers().getArray() as Array<
        VectorLayer<VectorSource<Geometry>>
      >) {
        if (this.adminLayerType && layer.get('name') === this.adminLayerType) {
          const {featureId} = adminLayers[this.adminLayerType];

          const sourceLoadingHandler = (event: BaseEvent) => {
            const source = event.target as VectorSource<Geometry>;
            if (source.getState() === 'ready') {
              handleSelection(source.getFeatures());
            }
          };

          const handleSelection = (features: Array<Feature<Geometry>>) => {
            adminLayerSource.un('change', sourceLoadingHandler);

            features.forEach(feature => {
              const isSelected = this.currentLayerSelectedFeatureDataKeys.some(
                keys => keys.featureId === feature.get(featureId)
              );
              feature.set('selected', isSelected);
            });
          };

          const adminLayerSource = layer.getSource();
          const adminLayerFeatures = adminLayerSource.getFeatures();

          if (adminLayerFeatures.length) {
            handleSelection(adminLayerFeatures);
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
    this.handleAdminAreaSelection();

    // Select map features
    this.map.on('click', this.handleClickOnMap);
  }
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
</style>
