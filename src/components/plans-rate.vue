<template>
  <div class="wrapper">
    <div class="map">
      <Map />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card>
      <v-card-title>{{ $t('rateAreas') }}</v-card-title>
      <v-card-text>
        <nav class="areas-navigation">
          <v-btn
            v-for="layerType in adminLayerTypes"
            :key="layerType"
            :color="layerType === adminLayerType ? 'primary' : ''"
            @click="onLayerTypeChanged(layerType)"
          >
            {{ $t(`adminLayer.${layerType}`) }}
          </v-btn>
        </nav>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';

interface Data {
  adminLayerTypes: AdminLayerType[];
}

export default Vue.extend({
  components: {
    Map,
    MapStyleSwitcher
  },
  data(): Data {
    return {
      adminLayerTypes: [
        AdminLayerType.BOROUGH,
        AdminLayerType.QUARTER,
        AdminLayerType.STATISTICAL_AREA
      ]
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
.wrapper {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 48px - 48px);
}

.wrapper > * {
  position: relative;
}

.map-overlays {
  position: absolute;
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
  padding: 8px;
}

.map-overlays.top-right {
  top: 0;
  right: 0;
}

.areas-navigation {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
