<template>
  <div
    v-if="!adminLayerType || isAdminLayerOfBalacedScorecardType()"
    class="rate-wrapper"
  >
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text class="rate-content">
      <BalancedScorecard
        :selectedFeatures="selectedFeatureId ? [selectedFeatureId] : []"
        :scorecardType="scorecardType"
        isEditable
      />
    </v-card-text>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {
  AdminLayerFeatureId,
  BalancedScorecardAdminLayerType
} from '@/types/admin-layers';
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
    selectedFeatureId(): AdminLayerFeatureId | null {
      if (
        !this.adminLayerType ||
        !this.selectedFeatureIds[this.adminLayerType]?.length
      ) {
        return null;
      }

      return this.selectedFeatureIds[this.adminLayerType][0];
    },
    title(): string {
      // Get translations key by converting the scorecard type from kebab case to camel case
      const scorecardTranslationKey = this.scorecardType.replace(/-./g, str =>
        str[1].toUpperCase()
      );
      const scorecardName = this.$t(`navigation.${scorecardTranslationKey}`);
      return `${scorecardName} | ${this.$t('balancedScorecards.rate.title')}`;
    }
  },
  watch: {
    adminLayerType() {
      this.updateHighlightedFeatureIds();
    },
    scorecardType() {
      this.updateHighlightedFeatureIds();
    },
    balancedScorecardRatings() {
      this.updateHighlightedFeatureIds();
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setSelectedFeatureIds',
      'setHighlightedFeatureIds'
    ]),
    isAdminLayerOfBalacedScorecardType: function () {
      return (
        this.adminLayerType &&
        Object.values(BalancedScorecardAdminLayerType).includes(
          this.adminLayerType
        )
      );
    },
    updateHighlightedFeatureIds() {
      if (
        !this.adminLayerType ||
        !this.balancedScorecardRatings[this.scorecardType] ||
        !this.balancedScorecardRatings[this.scorecardType][this.adminLayerType]
      ) {
        this.setHighlightedFeatureIds([]);
      } else {
        this.setHighlightedFeatureIds(
          Object.keys(
            this.balancedScorecardRatings[this.scorecardType][
              this.adminLayerType
            ]
          )
        );
      }
    }
  },
  created() {
    this.updateHighlightedFeatureIds();
  }
});
</script>

<style scoped>
.rate-wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 0;
}

.rate-content {
  overflow: auto;
}
</style>
