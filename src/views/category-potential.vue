<template>
  <div>
    <div class="potential-header">
      <v-tabs>
        <v-tab to="solar">{{ $t('navigation.solar') }}</v-tab>
        <v-tab to="energy-efficiency">
          {{ $t('navigation.energyEfficiency') }}
        </v-tab>
        <v-tab to="mobility">{{ $t('navigation.mobility') }}</v-tab>
      </v-tabs>

      <div class="potential-header-scenario-actions">
        <ScenarioSaveDialog :scope="scope" />
        <ScenarioLoadDialog :scope="scope" />
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ScenarioSaveDialog from '../components/scenario-save-dialog.vue';
import ScenarioLoadDialog from '../components/scenario-load-dialog.vue';

export default Vue.extend({
  components: {
    ScenarioSaveDialog,
    ScenarioLoadDialog
  },
  data() {
    return {
      scope: 'potential-solar'
    };
  },
  watch: {
    $route(to) {
      this.scope =
        (to.path.includes('energy-efficiency') && 'potential-energy') ||
        (to.path.includes('mobility') && 'potential-mobility') ||
        'potential-solar';
    }
  }
});
</script>

<style scoped>
.potential-header {
  display: grid;
  grid-template-columns: 1fr auto;
}

.potential-header-scenario-actions {
  display: flex;
  align-items: center;
  grid-gap: 8px;
  padding-right: 16px;
}
</style>
