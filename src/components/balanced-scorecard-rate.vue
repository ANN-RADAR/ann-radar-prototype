<template>
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
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {ScorecardType} from '@/types/scorecards';

import BalancedScorecard from './balanced-scorecard.vue';

export default Vue.extend({
  components: {
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
    }
  },
  watch: {
    balancedScorecardRatings(newBalancedScorecardRatings) {
      if (
        !this.adminLayerType ||
        !newBalancedScorecardRatings[this.scorecardType] ||
        !newBalancedScorecardRatings[this.scorecardType][this.adminLayerType]
      ) {
        this.setHighlightedFeatureIds([]);
      } else {
        this.setHighlightedFeatureIds(
          Object.keys(
            newBalancedScorecardRatings[this.scorecardType][this.adminLayerType]
          )
        );
      }
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setSelectedFeatureIds',
      'setHighlightedFeatureIds'
    ])
  }
});
</script>

<style scoped>
.rate {
  display: grid;
  grid-template-rows: auto 1fr;
}

.rate-content {
  overflow: auto;
}
</style>
