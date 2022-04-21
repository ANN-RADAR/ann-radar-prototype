<template>
  <div class="wrapper">
    <div class="map">
      <Map />
      <div class="map-overlays top-right">
        <MapLayerSwitcher
          :thematicLayers="energyPotentialLayers"
          :thematicLayersTitle="$t('layerOptions.energyLayers')"
        />
        <MapStyleSwitcher />
      </div>
      <div class="map-overlays bottom-right">
        <MapLegends />
      </div>
    </div>
    <v-card class="data">
      <AdminAreasInspector>
        <EnergyPotentialInspectorTable />
      </AdminAreasInspector>
      <Notes />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Map from './map-component.vue';
import MapLayerSwitcher from './map-layer-switcher.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import MapLegends from './map-legends.vue';
import Notes from './notes-section.vue';
import AdminAreasInspector from './admin-areas-inspector.vue';
import EnergyPotentialInspectorTable from './energy-potential-inspector-table.vue';

import {LayerOptions} from '@/types/layers';
import {energyPotentialLayersOptions} from '../constants/layers';

interface Data {
  energyPotentialLayers: Array<LayerOptions>;
}

export default Vue.extend({
  components: {
    Map,
    MapLayerSwitcher,
    MapStyleSwitcher,
    MapLegends,
    Notes,
    AdminAreasInspector,
    EnergyPotentialInspectorTable
  },
  data(): Data {
    return {
      energyPotentialLayers: energyPotentialLayersOptions
    };
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 48px - 48px);
}

.wrapper > * {
  position: relative;
  display: grid;
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

.data {
  display: grid;
  grid-template-rows: minmax(18rem, 1fr) minmax(10rem, 14rem);
}
</style>
