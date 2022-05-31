<template>
  <div class="wrapper">
    <div class="potential">
      <Map
        hasMultipleFeatureSelection
        :thematicLayerOptions="energyPotentialLayers"
        showLayerSwitcher
        :layerSwitcherProps="{
          thematicLayersTitle: $t('layerOptions.energyLayers')
        }"
        showStyleSwitcher
        showLegends
      />
      <v-card>
        <AdminAreasInspector>
          <PotentialInspectorTable category="energyEfficiency" />
        </AdminAreasInspector>
      </v-card>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Map from './map-component.vue';
import AdminAreasInspector from './admin-areas-inspector.vue';
import PotentialInspectorTable from './potential-inspector-table.vue';

import {LayerOptions} from '@/types/layers';
import {energyPotentialLayersOptions} from '../constants/layers';

interface Data {
  energyPotentialLayers: Array<LayerOptions>;
}

export default Vue.extend({
  components: {
    Map,
    AdminAreasInspector,
    PotentialInspectorTable
  },
  data(): Data {
    return {
      energyPotentialLayers: energyPotentialLayersOptions
    };
  }
});
</script>

<style scoped>
.potential {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  height: 100%;
  padding: 1rem;
}

.potential > * {
  position: relative;
  display: grid;
}
</style>
