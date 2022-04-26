<template>
  <table class="scorecard" v-if="selectedFeatures.length">
    <thead>
      <th />
      <th v-for="selectedFeature in selectedFeatures" :key="selectedFeature">
        {{ selectedFeature }}
      </th>
    </thead>

    <tbody
      v-for="({objective, measures}, index) in scorecard"
      :key="objective || `objective-${index}`"
    >
      <tr v-if="objective">
        <td class="scorecard-objective">
          {{ objective }}
        </td>
        <td v-for="index in selectedFeatures.length" :key="index" />
      </tr>

      <tr v-for="measure in measures" :key="measure.id">
        <td :class="`scorecard-measure ${objective && 'indented'}`">
          {{ measure.description }}
        </td>
        <td v-for="featureName in selectedFeatures" :key="featureName">
          <div class="scorecard-measure-value">
            <v-checkbox
              hide-details
              class="scorecard-measure-checkbox"
              :input-value="
                (selectedFeaturesRatings[featureName] || {})[measure.id]
              "
              :indeterminate="
                (selectedFeaturesRatings[featureName] || {})[measure.id] ===
                undefined
              "
              on-icon="mdi-checkbox-marked"
              off-icon="mdi-close-box"
              indeterminate-icon="mdi-checkbox-blank-outline"
              @change="onChangeRating(measure.id)"
            />
            <v-textarea solo flat dense hide-details rows="1" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapActions, mapState} from 'vuex';

import {MapActionsToMethods, MapStateToComputed} from '@/types/store';

import {Scorecard, ScorecardMeasureId, ScorecardType} from '@/types/scorecards';

export default Vue.extend({
  props: {
    selectedFeatures: {
      type: Array as PropType<Array<string>>,
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
      'adminLayerData',
      'scorecards',
      'scorecardRatings'
    ]),
    selectedFeatureName(): string | null {
      if (
        !this.adminLayerType ||
        !this.adminLayerData[this.adminLayerType] ||
        !this.adminLayerData[this.adminLayerType].selectedFeatureDataKeys.length
      ) {
        return null;
      }

      return this.adminLayerData[this.adminLayerType].selectedFeatureDataKeys[0]
        .featureName;
    },
    scorecard(): Scorecard {
      return this.scorecards[this.scorecardType];
    },
    ratings(): Record<string, Record<ScorecardMeasureId, boolean | undefined>> {
      if (
        !this.adminLayerType ||
        !this.scorecardRatings[this.scorecardType] ||
        !this.scorecardRatings[this.scorecardType][this.adminLayerType]
      ) {
        return {};
      }

      return this.scorecardRatings[this.scorecardType][this.adminLayerType];
    },
    selectedFeaturesRatings(): Record<
      string,
      Record<ScorecardMeasureId, boolean | undefined>
    > {
      return this.selectedFeatures.reduce(
        (ratings, selectedFeatureName) => ({
          ...ratings,
          [selectedFeatureName]: this.ratings[selectedFeatureName]
        }),
        {}
      );
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'savePlansScorecardRatings'
    ]),
    onChangeRating(measureId: ScorecardMeasureId) {
      if (this.adminLayerType && this.selectedFeatureName) {
        this.savePlansScorecardRatings({
          adminLayerType: this.adminLayerType,
          featureName: this.selectedFeatureName,
          measureId
        });
      }
    }
  }
});
</script>

<style scoped>
.scorecard {
  position: relative;
  table-layout: fixed;
  border-spacing: 0;
  min-width: 100%;
}

.scorecard thead th {
  z-index: 1;
  position: sticky;
  top: 0;
  min-width: 6rem;
  height: 48px;
  padding: 0 0.75rem 0.5rem;
  background-color: #fff;
  line-height: 1.2;
}

.scorecard th:first-child,
.scorecard td:first-child {
  z-index: 2;
  position: sticky;
  left: 0;
  min-width: 18rem;
  width: 50%;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.scorecard th:first-child {
  z-index: 3;
}

.scorecard tbody:not(:first-of-type) tr:first-child td {
  border-top: 0.5rem solid #fff;
}

.scorecard tbody tr:first-child td {
  padding-top: 0.5rem;
}

.scorecard tbody tr:last-child td {
  padding-bottom: 0.5rem;
}

.scorecard tbody tr td {
  background-color: #f5f5f5;
}

.scorecard-objective {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 700;
}

.scorecard-measure {
  padding: 0.4375rem 0.75rem;
  line-height: 1.2em;
}

.scorecard-measure.indented {
  padding-left: 1.75rem;
}

.scorecard tbody tr:last-child .scorecard-measure ~ td {
  height: calc(48px + 0.5rem);
}

.scorecard-measure ~ td {
  height: 48px;
  padding: 0 0.75rem;
  text-align: center;
}

.scorecard-measure-value {
  display: flex;
  align-items: center;
  height: 48px;
}

.scorecard-measure-value > div {
  margin: 0;
  padding: 0;
}

.scorecard-measure-checkbox
  >>> .v-input--selection-controls__input
  .v-icon:not(.mdi-checkbox-blank-outline)
  ~ .v-input--selection-controls__ripple,
.scorecard-measure-checkbox
  >>> .v-input--selection-controls__input
  .mdi-close-box,
.scorecard-measure-checkbox
  >>> .v-input--selection-controls__input
  .mdi-checkbox-marked {
  color: #1976d2;
}
</style>
