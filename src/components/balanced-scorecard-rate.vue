<template>
  <div class="wrapper">
    <div class="map">
      <Map />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card class="rate">
      <v-card-title>{{ $t('balancedScorecards.rate.rateAreas') }}</v-card-title>
      <v-card-text class="rate-content">
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

        <BalancedScorecard
          :selectedFeatures="selectedFeatureId ? [selectedFeatureId] : []"
          :scorecardType="scorecardType"
          isEditable
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {ScorecardType} from '@/types/scorecards';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import BalancedScorecard from './balanced-scorecard.vue';

export default Vue.extend({
  components: {
    Map,
    MapStyleSwitcher,
    BalancedScorecard
  },
  props: {
    adminLayerTypes: {
      type: Array as PropType<Array<AdminLayerType>>,
      required: true
    },
    scorecardType: {
      type: String as PropType<ScorecardType>,
      required: true
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'adminLayerData'
    ]),
    selectedFeatureId(): string | null {
      if (
        !this.adminLayerType ||
        !this.adminLayerData[this.adminLayerType] ||
        !this.adminLayerData[this.adminLayerType].selectedFeatureIds.length
      ) {
        return null;
      }

      return this.adminLayerData[this.adminLayerType].selectedFeatureIds[0];
    }
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

.rate-content {
  display: grid;
  grid-template-rows: auto 40px auto 1fr;
  height: calc(100% - 2rem - 32px);
}
</style>
