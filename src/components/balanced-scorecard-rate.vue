<template>
  <div class="wrapper">
    <Map :highlightedFeatureIds="highlightedFeatureIds" showStyleSwitcher />
    <v-card class="rate">
      <v-card-title>{{ $t('balancedScorecards.rate.title') }}</v-card-title>
      <v-card-text class="rate-content">
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
import {mapState} from 'vuex';

import {MapStateToComputed} from '@/types/store';
import {ScorecardType} from '@/types/scorecards';

import Map from './map-component.vue';
import BalancedScorecard from './balanced-scorecard.vue';

export default Vue.extend({
  components: {
    Map,
    BalancedScorecard
  },
  props: {
    scorecardType: {
      type: String as PropType<ScorecardType>,
      required: true
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'selectedFeatureIds',
      'balancedScorecardRatings'
    ]),
    selectedFeatureId(): string | null {
      if (
        !this.adminLayerType ||
        !this.selectedFeatureIds[this.adminLayerType]?.length
      ) {
        return null;
      }

      return this.selectedFeatureIds[this.adminLayerType][0];
    },
    highlightedFeatureIds(): Array<string> {
      if (
        !this.adminLayerType ||
        !this.balancedScorecardRatings[this.scorecardType] ||
        !this.balancedScorecardRatings[this.scorecardType][this.adminLayerType]
      ) {
        return [];
      }

      return Object.keys(
        this.balancedScorecardRatings[this.scorecardType][this.adminLayerType]
      );
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
  min-height: 0;
  padding: 1rem;
}

.wrapper > * {
  position: relative;
}

.rate {
  display: grid;
  grid-template-rows: auto 1fr;
}

.rate-content {
  overflow: auto;
}
</style>
