<template>
  <div class="wrapper">
    <div class="map">
      <Map
        :layerVisibility="{
          ...baseLayers.reduce((layers, layer) => {
            layers[layer.name] = layer.name === mapStyle ? true : false;
            return layers;
          }, {}),
          ...thematicLayers.reduce((layers, layer) => {
            layers[layer.name] = layer.visible;
            return layers;
          }, {})
        }"
        :adminLayerVisibility="
          adminLevels.reduce((obj, key) => {
            obj[key] = areaUnit === key;
            return obj;
          }, {})
        "
        :selectedAdminAreas="selectedAreas[areaUnit]"
        @selectedAdminAreas="onAdminAreasSelected"
        @legendUrls="onLegendUrlsChange"
      />
    </div>
    <div class="layers">
      <Layers
        @mapStyleChanged="mapStyle = $event"
        @layersChanged="thematicLayers = $event"
      />
    </div>
    <div class="notes">notes</div>
    <div class="cockpit">
      <Cockpit :areaUnit="areaUnit" :selectedAreas="selectedAreas" />
    </div>
    <div class="inspector">inspector</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Map from './map-component.vue';
import Layers from './energy-potential-layers.vue';
import Cockpit from './energy-potential-cockpit.vue';

import {thematicLayers, baseLayers} from '../constants/layers';
import {adminLevels} from '../constants/admin-levels';

const mapStyle = baseLayers[0].name;

export default Vue.extend({
  data() {
    return {
      baseLayers,
      mapStyle,
      thematicLayers,
      adminLevels,
      areaUnit: 'ha',
      selectedAreas: {
        Stadt: [],
        Bezirk: [],
        Stadtteil: [],
        StatGebiet: [],
        Baublock: []
      }
    };
  },
  components: {
    Map,
    Layers,
    // Notes,
    Cockpit
    // Inspector
  },
  methods: {
    onAdminAreasSelected(selectedAreas: Record<string, any>) {
      console.log(selectedAreas);
      // this.selectedAreas = selectedAreas;
    },
    onLegendUrlsChange(legendUrls: Record<string, string>) {
      console.log(legendUrls);
    }
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 50% 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.5rem;
  height: 100%;
}

.map {
  grid-column: 1 / 2;
  grid-row: 1 / 4;
}

.layer {
  grid-column: 2 / 3;
  grid-row: 1 / 4;
}

.cockpit {
  grid-column: 2 / 4;
  grid-row: 2 / 3;
}

.inspector {
  grid-column: 2 / 4;
  grid-row: 3 / 4;
}
</style>
