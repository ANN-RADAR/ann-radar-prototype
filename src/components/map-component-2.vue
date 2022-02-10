<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue from 'vue';

import {Map, MapBrowserEvent, View} from 'ol';
import {MapOptions} from 'ol/PluggableMap';
import LayerGroup from 'ol/layer/Group';
import {TileWMS} from 'ol/source';

import {getMapStyleLayers, getAdminAreaLayers} from '@/constants/layers';
import {vectorSources} from '@/constants/sources';
import TileLayer from 'ol/layer/Tile';
import BaseLayer from 'ol/layer/Base';

type Data = {
  map: null | Map;
  mapOptions: MapOptions;
  mapStyleLayers: LayerGroup;
  adminLayers: LayerGroup;
};

export default Vue.extend({
  props: {
    mapStyleLayer: {
      type: String,
      default: 'farbig'
    },
    adminLayer: {
      type: String,
      default: null
    }
  },
  data(): Data {
    const mapStyleLayers = getMapStyleLayers();
    const adminLayers = getAdminAreaLayers();

    return {
      map: null,
      mapStyleLayers,
      adminLayers,
      mapOptions: {
        target: 'map',
        layers: [mapStyleLayers, adminLayers],
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
    adminLayer(newAdminLayer: string) {
      for (const layer of this.adminLayers.getLayers().getArray()) {
        if (layer.get('name') === newAdminLayer) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      }
    }
  },
  mounted() {
    this.map = new Map(this.mapOptions);

    //   // Select map features
    //   this.map.on('click', (evt: MapBrowserEvent<UIEvent>) => {
    //     const coord = this.map?.getCoordinateFromPixel(evt.pixel);
    //     const adminLevel = this.getVisibleAdminLevel();
    //     if (!adminLevel) {
    //       return;
    //     }

    //     for (const feature of vectorSources[adminLevel].getFeaturesAtCoordinate(
    //       coord
    //     )) {
    //       this.setFeatureSelected(feature, !feature.get('selected'));
    //     }

    //     this.emitSelected();
    //   });

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
