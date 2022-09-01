<template>
  <div>
    <div class="potential-header">
      <v-tabs>
        <v-tab to="solar">{{ $t('navigation.solar') }}</v-tab>
        <v-tab to="energy-efficiency" id="tour-sustainability-themes">
          {{ $t('navigation.energyEfficiency') }}
        </v-tab>
        <v-tab to="mobility">{{ $t('navigation.mobility') }}</v-tab>
      </v-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapMutations} from 'vuex';

import {MapActionsToMethods, MapMutationsToMethods} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';

export default Vue.extend({
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setSelectedFeatureIds'
    ]),
    ...(mapActions as MapActionsToMethods)('root', ['fetchPotentialConfig'])
  },
  created() {
    this.fetchPotentialConfig();
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

<style>
.potential-table.v-data-table--fixed-header
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th:nth-child(1),
.potential-table table td:nth-child(1),
.potential-table.selectable table th:nth-child(2),
.potential-table.selectable table td:nth-child(2) {
  position: sticky;
  z-index: 3;
  background-color: #fff;
}

.potential-table table th:nth-child(1),
.potential-table table td:nth-child(1) {
  left: 0;
}

.potential-table.selectable table th:nth-child(1),
.potential-table.selectable table td:nth-child(1) {
  padding-right: 0;
}

.potential-table.selectable table th:nth-child(2),
.potential-table.selectable table td:nth-child(2) {
  left: 48px;
}

.potential-table:not(.selectable) table th:nth-child(1),
.potential-table:not(.selectable) table td:nth-child(1),
.potential-table.selectable table th:nth-child(2),
.potential-table.selectable table td:nth-child(2) {
  border-right: thin solid rgba(0, 0, 0, 0.12);
}

.potential-table table tr:not(:last-child) td:nth-child(1),
.potential-table.selectable table tr:not(:last-child) td:nth-child(2) {
  z-index: 2;
}

.potential-table table tr:last-child {
  position: sticky;
  bottom: 0;
  z-index: 3;
  box-shadow: 0 -1px 0 rgb(0, 0, 0, 0.12);
  font-weight: 600;
}

.potential-table table tr:last-child,
.potential-table table tr:last-child td:nth-child(1),
.potential-table.selectable table tr:last-child td:nth-child(2) {
  background-color: #f5f5f5;
}
</style>
