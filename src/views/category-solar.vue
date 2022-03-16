<template>
  <v-main>
    <Header />
    <v-container
      fluid
      style="display: flex; flex-direction: column; height: 100%; padding: 0"
    >
      <div class="solar-header">
        <v-tabs v-model="tab">
          <v-tab>{{ $t('navigation.potential') }}</v-tab>
          <v-tab>{{ $t('navigation.plans') }}</v-tab>
          <v-tab>{{ $t('navigation.stakeholders') }}</v-tab>
          <v-tab>{{ $t('navigation.urbanData') }}</v-tab>
          <v-tab>{{ $t('navigation.governance') }}</v-tab>
        </v-tabs>

        <div class="solar-header-scenario-actions">
          <ScenarioSaveDialog scope="solar-potential" />
          <ScenarioLoadDialog scope="solar-potential" />
        </div>
      </div>

      <v-tabs-items v-model="tab" style="height: 100%">
        <v-tab-item style="flex-grow: 1">
          <Potential />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue';

import Potential from '../components/solar-potential.vue';
import Header from '../components/app-header.vue';
import ScenarioSaveDialog from '../components/scenario-save-dialog.vue';
import ScenarioLoadDialog from '../components/scenario-load-dialog.vue';

export default Vue.extend({
  components: {
    Potential,
    Header,
    ScenarioSaveDialog,
    ScenarioLoadDialog
  },
  data() {
    return {
      tab: 0
    };
  }
});
</script>

<style scoped>
.solar-header {
  display: grid;
  grid-template-columns: 1fr auto;
}

.solar-header-scenario-actions {
  display: flex;
  align-items: center;
  grid-gap: 8px;
  padding-right: 16px;
}
</style>
