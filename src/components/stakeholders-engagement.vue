<template>
  <v-card class="stakeholders-engagement-wrapper">
    <v-card-title>
      {{ $t(`stakeholdersEngagement.${stakeholdersEngagementType}`) }}
    </v-card-title>
    <v-card-text class="stakeholders-engagement">
      <table class="stakeholders-engagement-table" v-if="selectedFeatureId">
        <thead>
          <th />
          <th>{{ selectedFeatureId }}</th>
        </thead>

        <tbody
          v-for="(
            {objective, measures}, index
          ) in stakeholdersEngagementTemplate"
          :key="objective || `objective-${index}`"
        >
          <tr v-if="objective">
            <td class="stakeholders-engagement-objective">
              {{ objective }}
            </td>
            <td />
          </tr>

          <tr v-for="measure in measures" :key="measure.id">
            <td
              :class="`stakeholders-engagement-measure ${
                objective && 'indented'
              }`"
            >
              {{ measure.description }}
            </td>
            <td>
              <div class="stakeholders-engagement-measure-value">
                <v-checkbox
                  hide-details
                  class="stakeholders-engagement-measure-checkbox"
                  :input-value="getFeatureMeasureValue(measure.id)"
                  :indeterminate="
                    getFeatureMeasureValue(measure.id) === undefined
                  "
                  on-icon="mdi-checkbox-marked"
                  off-icon="mdi-close-box"
                  indeterminate-icon="mdi-checkbox-blank-outline"
                  @change="onChangeRatingValue(measure.id)"
                />
                <v-textarea
                  solo
                  flat
                  dense
                  hide-details
                  rows="1"
                  :value="getFeatureMeasureComment(measure.id)"
                  @change="onChangeRatingComment(measure.id, $event)"
                />
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <td
              class="stakeholders-engagement-objective stakeholders-engagement-measure"
            >
              {{ $t('stakeholdersEngagement.links') }}
            </td>
            <td>
              <v-text-field
                solo
                flat
                dense
                hide-details
                name="links"
                type="text"
                :value="stakeholderEngagement.links"
                @change="onChangeLinks($event)"
                required
              ></v-text-field>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapActions, mapMutations, mapState} from 'vuex';

import {
  StakeholdersEngagement,
  StakeholdersEngagementMeasureId,
  StakeholdersEngagementRating,
  StakeholdersEngagementTemplate,
  StakeholdersEngagementType
} from '@/types/stakeholders';
import {
  MapActionsToMethods,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';

export default Vue.extend({
  props: {
    stakeholdersEngagementType: {
      type: String as PropType<StakeholdersEngagementType>,
      required: true
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'selectedFeatureIds',
      'stakeholdersEngagementTemplates',
      'stakeholdersEngagementRatings'
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
    stakeholdersEngagementTemplate(): StakeholdersEngagementTemplate {
      return this.stakeholdersEngagementTemplates[
        this.stakeholdersEngagementType
      ];
    },
    stakeholderEngagement(): StakeholdersEngagement {
      if (
        !this.adminLayerType ||
        !this.selectedFeatureId ||
        !this.stakeholdersEngagementRatings[this.stakeholdersEngagementType] ||
        !this.stakeholdersEngagementRatings[this.stakeholdersEngagementType][
          this.adminLayerType
        ] ||
        !this.stakeholdersEngagementRatings[this.stakeholdersEngagementType][
          this.adminLayerType
        ][this.selectedFeatureId]
      ) {
        return {ratings: {}, links: ''};
      }

      return this.stakeholdersEngagementRatings[
        this.stakeholdersEngagementType
      ][this.adminLayerType][this.selectedFeatureId];
    }
  },
  watch: {
    adminLayerType() {
      this.updateHighlightedFeatureIds();
    },
    stakeholdersEngagementType(
      newStakeholdersEngagementType: StakeholdersEngagementType
    ) {
      this.fetchStakeholdersEngagementTemplate(newStakeholdersEngagementType);
      this.updateHighlightedFeatureIds();
    },
    stakeholdersEngagementRatings() {
      this.updateHighlightedFeatureIds();
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setHighlightedFeatureIds'
    ]),
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchStakeholdersEngagementTemplate',
      'updateStakeholdersEngagementRatings'
    ]),
    onChangeRatingValue(measureId: StakeholdersEngagementMeasureId) {
      if (this.adminLayerType && this.selectedFeatureId) {
        const comment = this.getFeatureMeasureComment(measureId);
        const previousValue = this.getFeatureMeasureValue(measureId);
        const newValue =
          previousValue === true
            ? false
            : previousValue === false
            ? undefined
            : true;

        this.updateStakeholdersEngagementRatings({
          stakeholdersEngagementType: this.stakeholdersEngagementType,
          adminLayerType: this.adminLayerType,
          featureId: this.selectedFeatureId,
          measureId,
          rating: {value: newValue, comment}
        });
      }
    },
    onChangeRatingComment(
      measureId: StakeholdersEngagementMeasureId,
      newComment: string
    ) {
      if (this.adminLayerType && this.selectedFeatureId) {
        const value = this.getFeatureMeasureValue(measureId);

        this.updateStakeholdersEngagementRatings({
          stakeholdersEngagementType: this.stakeholdersEngagementType,
          adminLayerType: this.adminLayerType,
          featureId: this.selectedFeatureId,
          measureId,
          rating: {value, comment: newComment}
        });
      }
    },
    onChangeLinks(links: string) {
      if (this.adminLayerType && this.selectedFeatureId) {
        this.updateStakeholdersEngagementRatings({
          stakeholdersEngagementType: this.stakeholdersEngagementType,
          adminLayerType: this.adminLayerType,
          featureId: this.selectedFeatureId,
          links
        });
      }
    },
    getFeatureMeasureValue(
      measureId: StakeholdersEngagementMeasureId
    ): StakeholdersEngagementRating['value'] {
      return (this.stakeholderEngagement.ratings[measureId] || {}).value;
    },
    getFeatureMeasureComment(
      measureId: StakeholdersEngagementMeasureId
    ): StakeholdersEngagementRating['comment'] {
      return (this.stakeholderEngagement.ratings[measureId] || {}).comment;
    },
    updateHighlightedFeatureIds() {
      if (
        !this.adminLayerType ||
        !this.stakeholdersEngagementRatings[this.stakeholdersEngagementType] ||
        !this.stakeholdersEngagementRatings[this.stakeholdersEngagementType][
          this.adminLayerType
        ]
      ) {
        this.setHighlightedFeatureIds([]);
      } else {
        this.setHighlightedFeatureIds(
          Object.keys(
            this.stakeholdersEngagementRatings[this.stakeholdersEngagementType][
              this.adminLayerType
            ]
          )
        );
      }
    }
  },
  created() {
    this.fetchStakeholdersEngagementTemplate(this.stakeholdersEngagementType);
    this.updateHighlightedFeatureIds();
  }
});
</script>

<style scoped>
.stakeholders-engagement-wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 0;
}

.stakeholders-engagement {
  overflow: auto;
}

.stakeholders-engagement-table {
  position: relative;
  table-layout: fixed;
  border-spacing: 0;
  min-width: 100%;
}

.stakeholders-engagement-table thead th {
  z-index: 1;
  position: sticky;
  top: 0;
  min-width: 6rem;
  height: 48px;
  padding: 0 0.75rem 0.5rem;
  background-color: #fff;
  line-height: 1.2;
}

.stakeholders-engagement-table th:first-child,
.stakeholders-engagement-table td:first-child {
  z-index: 2;
  position: sticky;
  left: 0;
  min-width: 18rem;
  width: 50%;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.stakeholders-engagement-table th:first-child {
  z-index: 3;
}

.stakeholders-engagement-table tbody:not(:first-of-type) tr:first-child td {
  border-top: 0.5rem solid #fff;
}

.stakeholders-engagement-table tbody tr:first-child td {
  padding-top: 0.5rem;
}

.stakeholders-engagement-table tbody tr:last-child td {
  padding-bottom: 0.5rem;
}

.stakeholders-engagement-table
  tbody
  tr:last-child:not(:first-child)
  td:first-child {
  padding-bottom: 0.9375rem;
}

.stakeholders-engagement-table tbody tr td {
  background-color: #f5f5f5;
}

.stakeholders-engagement-objective {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 700;
}

.stakeholders-engagement-measure {
  padding: 0.4375rem 0.75rem;
  line-height: 1.2em;
}

.stakeholders-engagement-measure.indented {
  padding-left: 1.75rem;
}

.stakeholders-engagement
  tbody
  tr:last-child
  .stakeholders-engagement-measure
  ~ td {
  height: calc(48px + 0.5rem);
}

.stakeholders-engagement-measure ~ td {
  height: 48px;
  padding: 0 0.75rem;
  text-align: center;
}

.stakeholders-engagement-measure-value {
  display: flex;
  align-items: center;
  height: 48px;
}

.stakeholders-engagement-measure-value > div {
  margin: 0;
  padding: 0;
}

.stakeholders-engagement-measure-checkbox
  >>> .v-input--selection-controls__input
  .v-icon:not(.mdi-checkbox-blank-outline)
  ~ .v-input--selection-controls__ripple,
.stakeholders-engagement-measure-checkbox
  >>> .v-input--selection-controls__input
  .mdi-close-box,
.stakeholders-engagement-measure-checkbox
  >>> .v-input--selection-controls__input
  .mdi-checkbox-marked {
  color: #1976d2;
}
</style>
