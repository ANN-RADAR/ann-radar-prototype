<template>
  <div class="wrapper">
    <div class="map"><Map /></div>
    <div class="layers">
      <Layers :basemaps="basemaps" v-model="currentBasemap" />
    </div>
    <div class="notes">notes</div>
    <div class="cockpit"><Cockpit /></div>
    <div class="inspector">inspector</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Map from './map-component.vue';
import Layers from './energy-potential-layers.vue';
import Cockpit from './energy-potential-cockpit.vue';

const basemaps = [
  {
    name: 'farbig',
    visible: true
  },
  {
    name: 'grau-blau',
    visible: false
  },
  {
    name: 'schwarz-grau',
    visible: false
  }
];
const currentBasemap = basemaps[0].name;

export default Vue.extend({
  data() {
    return {
      basemaps,
      currentBasemap
    };
  },
  components: {
    Map,
    Layers,
    // Notes,
    Cockpit
    // Inspector
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
