<template>
  <div class="wrapper">
    <div class="map">
      <Map />
    </div>
    <div class="layers">
      <Layers />
    </div>
    <div class="notes">
      <Notes />
    </div>
    <div class="cockpit">
      <Cockpit />
    </div>
    <div class="inspector">
      <Inspector>
        <EnergyPotentialInspectorTable />
      </Inspector>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Map from './map-component.vue';
import Layers from './energy-potential-layers.vue';
import Notes from './notes-section.vue';
import Cockpit from './energy-potential-cockpit.vue';
import Inspector from './admin-areas-inspector.vue';
import EnergyPotentialInspectorTable from './energy-potential-inspector-table.vue';

export default Vue.extend({
  components: {
    Map,
    Layers,
    Notes,
    Cockpit,
    Inspector,
    EnergyPotentialInspectorTable
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 50% 2fr 1fr;
  grid-template-rows: 1fr 9rem 1fr;
  gap: 0.75rem;
  padding: 0.5rem;
  height: calc(100vh - 64px - 48px);
}

.wrapper > * {
  display: grid;
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
