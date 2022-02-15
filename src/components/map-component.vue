<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue from 'vue';

import {Map, MapBrowserEvent, View} from 'ol';
import {MapOptions} from 'ol/PluggableMap';
import LayerGroup from 'ol/layer/Group';
// import {TileWMS} from 'ol/source';

import {
  getMapStyleLayers,
  getAdminAreaLayers,
  getBaseLayers
} from '@/constants/layers';
// import {vectorSources} from '@/constants/sources';
// import TileLayer from 'ol/layer/Tile';
// import BaseLayer from 'ol/layer/Base';
// import {Options} from 'ol/Collection';
// import TileSource from 'ol/source/Tile';

type Data = {
  map: null | Map;
  mapOptions: MapOptions;
  mapStyleLayers: LayerGroup;
  adminLayers: LayerGroup;
  layers: LayerGroup;
};

export default Vue.extend({
  props: {
    mapStyleLayer: {
      type: String,
      default: 'farbig'
    },
    adminLayerType: {
      type: String,
      default: null
    },
    activeLayers: {
      type: Array,
      default: null
    }
  },
  data(): Data {
    const mapStyleLayers = getMapStyleLayers();
    const adminLayers = getAdminAreaLayers();
    const layers = getBaseLayers();

    return {
      map: null,
      mapStyleLayers,
      adminLayers,
      layers,
      mapOptions: {
        target: 'map',
        layers: [mapStyleLayers, adminLayers, layers],
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
  watch: {
    mapStyleLayer(newMapStyleLayer: string) {
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
    activeLayers(newActiveLayers: Array<string>) {
      for (const layer of this.layers.getLayers().getArray()) {
        if (newActiveLayers.includes(layer.get('name'))) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    }
  },
  mounted() {
    this.map = new Map(this.mapOptions);

    // Select map features
    this.map.on('click', (evt: MapBrowserEvent<UIEvent>) => {
      const coord = this.map?.getCoordinateFromPixel(evt.pixel);
      console.log({evt});

      this.map?.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        console.log(feature, layer);
      });
      if (!this.adminLayerType) {
        return;
      }

      for (const layer of this.adminLayers.getLayers().getArray()) {
        // console.log(layer);
        // const features = layer.get.getFeaturesAtCoordinate(coord);
        // features.forEach(feature => {
        //   feature.set('selected', !feature.get('selected'));
        //   console.log(feature.get('name'));
        // });
      }
    });

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
}
</style>
