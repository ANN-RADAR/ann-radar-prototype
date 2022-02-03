<template>
  <v-card>
    <v-card-title>Cockpit</v-card-title>
    <v-card-text>
      <div
        v-if="
          areaUnit !== 'Stadt' &&
          selectedAreas[areaUnit] &&
          selectedAreas[areaUnit].length > 0
        "
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
import Vue from 'vue';

export default Vue.extend({});
</script>

<style scoped>
.kpi {
  font-size: 1.25rem;
  line-height: 1.8;
}
</style>
