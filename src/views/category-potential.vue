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
    </div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations} from 'vuex';

import {MapMutationsToMethods} from '@/types/store';
import {AdminLayerData, AdminLayerType} from '@/types/admin-layers';

export default Vue.extend({
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
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setAdminLayerData'
    ])
  },
  destroyed() {
    // Reset selections on destroy
    this.setAdminLayerType(null);
    this.setAdminLayerData({} as Record<AdminLayerType, AdminLayerData>);
  }
});
</script>

<style scoped>
.potential-header {
  display: grid;
  grid-template-columns: 1fr auto;
}
</style>
