<template>
  <v-card>
    <v-card-title>Cockpit</v-card-title>
    <v-card-text>
      <div
        v-if="aggregation"
        v-resize="onResize"
        style="display: flex; justify-content: space-around"
      >
        <v-sheet>
          Flurstücke
          <div class="kpi">
            {{ formatNumber(aggregation.AnzFl) }}
          </div>
        </v-sheet>
        <v-sheet>
          mittl. Flurstückgröße
          <div class="kpi">
            {{ formatNumber(Math.round(aggregation.mittlFl)) }}&nbsp;m²
          </div>
        </v-sheet>
        <v-sheet>
          BGF
          <div class="kpi">
            {{ formatNumber(Math.round(aggregation.BGF)) }}&nbsp;m²
          </div>
        </v-sheet>
        <v-sheet>
          Wohnbaufläche
          <div class="kpi">
            {{
              formatNumber(Math.round(aggregation.tatNu_WB_P * 100) / 100)
            }}&nbsp;%
          </div>
        </v-sheet>
        <v-sheet>
          Bevölkerung
          <div class="kpi">
            {{ formatNumber(aggregation.Bev_311219) }}
          </div>
        </v-sheet>
        <v-sheet>
          Solarpotenzial
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
import Vue, {PropType} from 'vue';

import {calculateAggregateValues} from '@/libs/admin-layers';
import {AdminLayerType} from '@/types/admin-layers';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';

export default Vue.extend({
  props: {
    adminLayerType: {
      type: String as PropType<AdminLayerType | null>,
      default: null,
      required: false
    },
    selectedFeatures: {
      type: Array as PropType<Array<Feature<Geometry>>>,
      required: true
    }
  },
  computed: {
    aggregation(): Record<string, number> | null {
      if (
        !this.adminLayerType ||
        this.adminLayerType === 'Stadt' ||
        !this.selectedFeatures.length
      ) {
        return null;
      }

      return calculateAggregateValues(
        this.adminLayerType,
        this.selectedFeatures
      );
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
