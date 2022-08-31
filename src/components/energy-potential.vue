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
        <v-card-text>
          <PotentialInspectorTable category="energyEfficiency" />
        </v-card-text>
      </v-card>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Map from './map-component.vue';
import PotentialInspectorTable from './potential-inspector-table.vue';

import {LayerOptions} from '@/types/layers';
import {energyPotentialLayersOptions} from '../constants/layers';

interface Data {
  energyPotentialLayers: Array<LayerOptions>;
}

export default Vue.extend({
  components: {
    Map,
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
