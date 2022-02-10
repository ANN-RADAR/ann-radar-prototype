<template>
  <div class="wrapper">
    <div class="map">
      <Map :mapStyleLayer="mapStyle" :adminLayer="adminLayer" />
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
import Map from './map-component-2.vue';
import Layers from './energy-potential-layers.vue';
import Cockpit from './energy-potential-cockpit.vue';

import {thematicLayers, mapStyleLayers} from '../constants/layers';
import {adminLevels} from '../constants/admin-levels';

const mapStyle = mapStyleLayers[0].properties.name;
const adminLayer = null;

export default Vue.extend({
  data() {
    return {
      mapStyleLayers,
      mapStyle,
      adminLayer,
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
