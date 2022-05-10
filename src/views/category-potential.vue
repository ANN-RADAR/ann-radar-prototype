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

      <v-btn>
        <span>{{ $t('results.show') }}</span>
      </v-btn>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations} from 'vuex';

import {MapMutationsToMethods} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';

export default Vue.extend({
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setSelectedFeatureIds'
    ])
  },
  destroyed() {
    // Reset selections on destroy
    this.setAdminLayerType(null);
    this.setSelectedFeatureIds({} as Record<AdminLayerType, Array<string>>);
  }
});
</script>

<style scoped>
.potential-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding-right: 1rem;
}
</style>
