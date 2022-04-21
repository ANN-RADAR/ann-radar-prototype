<template>
  <div class="inspector">
    <v-card-title>{{ $t('inspectAreas') }}</v-card-title>
    <v-card-text class="inspector-content">
      <nav class="inspector-navigation">
        <v-btn
          v-for="layerType in adminLayerTypes"
          :key="layerType"
          :color="layerType === adminLayerType ? 'primary' : ''"
          @click="onLayerTypeChanged(layerType)"
        >
          {{ $t(`adminLayer.${layerType}`) }}
        </v-btn>
      </nav>

      <slot></slot>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

interface Data {
  adminLayerTypes: AdminLayerType[];
}

export default Vue.extend({
  data(): Data {
    return {
      adminLayerTypes: Object.values(AdminLayerType)
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['adminLayerType'])
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setAdminLayerType']),
    onLayerTypeChanged(adminLayerType: AdminLayerType) {
      const selectedAdminLayerType =
        adminLayerType === this.adminLayerType ? null : adminLayerType;
      this.setAdminLayerType(selectedAdminLayerType);
    }
  }
});
</script>

<style scoped>
.inspector-content {
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - 2rem - 32px);
}

.inspector-navigation {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 0.5rem;
  margin-bottom: 1rem;
}

.inspector >>> table th:nth-child(1),
.inspector >>> table td:nth-child(1),
.inspector >>> table th:nth-child(2),
.inspector >>> table td:nth-child(2) {
  position: sticky;
  z-index: 3;
  background-color: #fff;
}

.inspector >>> table th:nth-child(1),
.inspector >>> table td:nth-child(1) {
  left: 0;
  padding-right: 0;
}

.inspector >>> table th:nth-child(2),
.inspector >>> table td:nth-child(2) {
  left: 48px;
  border-right: thin solid rgba(0, 0, 0, 0.12);
}

.inspector >>> table tr:not(:last-child) td:nth-child(1),
.inspector >>> table tr:not(:last-child) td:nth-child(2) {
  z-index: 2;
}

.inspector >>> table tr:last-child {
  position: sticky;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 -1px 0 rgb(0, 0, 0, 0.12);
  font-weight: 600;
}

.inspector >>> table tr:last-child,
.inspector >>> table tr:last-child td:nth-child(1),
.inspector >>> table tr:last-child td:nth-child(2) {
  background-color: #f5f5f5;
}
</style>
