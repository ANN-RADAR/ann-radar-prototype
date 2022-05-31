<template>
  <div class="wrapper">
    <div class="potential">
      <Map
        hasMultipleFeatureSelection
        :thematicLayerOptions="solarPotentialLayers"
        showLayerSwitcher
        :layerSwitcherProps="{
          thematicLayersTitle: $t('layerOptions.solarLayers')
        }"
        showStyleSwitcher
        showLegends
      />
      <v-card>
        <AdminAreasInspector>
          <PotentialInspectorTable category="solar" />
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
import {solarPotentialLayersOptions} from '../constants/layers';

interface Data {
  solarPotentialLayers: Array<LayerOptions>;
}

export default Vue.extend({
  components: {
    Map,
    AdminAreasInspector,
    PotentialInspectorTable
  },
  data(): Data {
    return {
      solarPotentialLayers: solarPotentialLayersOptions
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
