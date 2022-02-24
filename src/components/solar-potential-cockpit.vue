<template>
  <v-card>
    <v-card-title>{{ $t('cockpit') }}</v-card-title>
    <v-card-text>
      <div
        v-if="aggregation"
        v-resize="onResize"
        style="display: flex; justify-content: space-around"
      >
        <v-sheet>
          {{ $t('parcels') }}
          <div class="kpi">
            {{ formatNumber(aggregation.AnzFl) }}
          </div>
        </v-sheet>
        <v-sheet>
          {{ $t('meanParcelSize') }}
          <div class="kpi">
            {{ formatNumber(Math.round(aggregation.mittlFl)) }}&nbsp;m²
          </div>
        </v-sheet>
        <v-sheet>
          {{ $t('grossFloorArea') }}
          <div class="kpi">
            {{ formatNumber(Math.round(aggregation.BGF)) }}&nbsp;m²
          </div>
        </v-sheet>
        <v-sheet>
          {{ $t('residentialBuildingArea') }}
          <div class="kpi">
            {{
              formatNumber(Math.round(aggregation.tatNu_WB_P * 100) / 100)
            }}&nbsp;%
          </div>
        </v-sheet>
        <v-sheet>
          {{ $t('population') }}
          <div class="kpi">
            {{ formatNumber(aggregation.Bev_311219) }}
          </div>
        </v-sheet>
        <v-sheet>
          {{ $t('solarPotential') }}
          <div v-if="isNaN(aggregation.p_st_mwh_a)" class="kpi">?</div>
          <div v-else class="kpi">
            {{ formatNumber(Math.round(aggregation.p_st_mwh_a)) }}&nbsp;MWh/a
          </div>
        </v-sheet>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState} from 'vuex';

import {MapStateToComputed} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';
import {calculateAggregateValues} from '@/libs/admin-layers';
import {formatNumber} from '@/libs/format';

export default Vue.extend({
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'selectedFeatureDataKeys'
    ]),
    aggregation(): Record<string, number> | null {
      if (
        !this.adminLayerType ||
        this.adminLayerType === AdminLayerType.CITY ||
        !this.selectedFeatureDataKeys[this.adminLayerType]?.length
      ) {
        return null;
      }

      return calculateAggregateValues(
        this.adminLayerType,
        this.selectedFeatureDataKeys[this.adminLayerType]
      );
    }
  },
  methods: {
    onResize(): void {
      // TODO: reimplement resize
    },
    formatNumber(
      ...args: Parameters<typeof formatNumber>
    ): ReturnType<typeof formatNumber> {
      return formatNumber(...args);
    }
  }
});
</script>

<style scoped>
.kpi {
  font-size: 1.25rem;
  line-height: 1.8;
}
</style>
