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
import {Map, MapBrowserEvent, View} from 'ol';
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
import {adminLayers} from '@/constants/admin-layers';
import {FeaturesDataKeys} from '@/types/admin-layers';

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
      'baseLayerTypes'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureDataKeys'
    ])
  },
  watch: {
    mapStyle(newMapStyleLayer: string) {
      for (const layer of this.mapStyleLayers.getLayers().getArray()) {
        if (layer.get('name') === newMapStyleLayer) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    adminLayerType(newAdminLayerType: string) {
      for (const layer of this.adminLayers.getLayers().getArray()) {
        if (layer.get('name') === newAdminLayerType) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    baseLayerTypes(newBaseLayerTypes: Array<string>) {
      for (const layer of this.baseLayers.getLayers().getArray()) {
        if (newBaseLayerTypes.includes(layer.get('name'))) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    },
    currentLayerSelectedFeatureDataKeys(
      newCurrentLayerSelectedFeatureDataKeys: Array<FeaturesDataKeys>
    ) {
      for (const layer of this.adminLayers.getLayers().getArray() as Array<
        VectorLayer<VectorSource<Geometry>>
      >) {
        if (this.adminLayerType && layer.get('name') === this.adminLayerType) {
          const {featureId} = adminLayers[this.adminLayerType];
          const adminLayerFeatures = layer.getSource().getFeatures();

          adminLayerFeatures.forEach(feature => {
            const isSelected = newCurrentLayerSelectedFeatureDataKeys.some(
              keys => keys.featureId === feature.get(featureId)
            );
            feature.set('selected', isSelected);
          });
        }
      }
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
          const {featureId, featureName} = adminLayers[this.adminLayerType];
          const clickedFeatures = layer
            .getSource()
            .getFeaturesAtCoordinate(coord);

          clickedFeatures.forEach(feature => {
            const id = feature.get(featureId);
            const name = feature.get(featureName);

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
              selectedFeatureDataKeys = [
                ...selectedFeatureDataKeys,
                {featureId: id, featureName: name}
              ];
            }
          });

          this.setSelectedFeatureDataKeys({
            adminLayerType: this.adminLayerType,
            keys: selectedFeatureDataKeys
          });
        }
      }
      // TODO: Add selected feature id / name to store
    }
  },
  created() {
    this.fetchLayersConfig();
  },
  mounted() {
    this.map = new Map(this.mapOptions);

    // Select map features
    this.map.on('click', this.handleClickOnMap);

    //   // Update the legend
    //   this.map.on('postcompose', () => {
    //     const legendUrls = Object.entries(this.layers).reduce(
    //       (obj, [key, layer]) => {
    //         const sources =
    //           layer instanceof LayerGroup
    //             ? layer.getLayersArray().map(l => l.getSource())
    //             : [layer.getSource()];
    //         obj[key] = sources
    //           .filter(source => source instanceof TileWMS)
    //           .map(source => (source as TileWMS).getLegendUrl() as string);
    //         return obj;
    //       },
    //       {} as {[key: string]: string[]}
    //     );

    //     this.$emit('legendUrls', legendUrls);
    //   });
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
