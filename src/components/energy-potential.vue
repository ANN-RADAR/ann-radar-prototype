<template>
  <div class="wrapper">
    <div class="map">
      <Map
        :mapStyleLayer="mapStyle"
        :adminLayerType="adminLayerType"
        :activeLayers="activeLayers"
      />
      />
    </div>
    <div class="layers">
      <Layers
        @mapStyleChanged="mapStyle = $event"
        @layersChanged="activeLayers = $event"
      />
    </div>
    <div class="notes">notes</div>
    <div class="cockpit">
      <Cockpit />
    </div>
    <div class="inspector">
      <Inspector @onAdminAreaTypeSelected="adminLayerType = $event" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Map from './map-component.vue';
import Layers from './energy-potential-layers.vue';
import Cockpit from './energy-potential-cockpit.vue';
import Inspector from './energy-potential-inspector.vue';

import {mapStyleLayersOptions} from '@/constants/layers';
import {areaUnit} from '@/constants/units';

const mapStyle = mapStyleLayersOptions[0].properties.name;
const adminLayer = null;

export default Vue.extend({
  data() {
    return {
      mapStyleLayersOptions,
      mapStyle,
      adminLayer,
      activeLayers: [],
      areaUnit,
      adminLayerType: null
    };
  },
  components: {
    Map,
    Layers,
    // Notes,
    Cockpit,
    Inspector
  },
  methods: {
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
