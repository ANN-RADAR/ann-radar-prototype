<template>
  <div class="inspector">
    <v-card-title>{{ $t('selectAreas') }}</v-card-title>
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
</style>
