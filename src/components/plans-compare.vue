<template>
  <div class="wrapper">
    <v-card class="area-selection">
      <v-card-text class="area-selection-content">
        <v-select
          outlined
          dense
          hide-details
          :value="adminLayerType"
          :items="adminAreaOptions"
          :label="$t('adminArea')"
          @change="onLayerTypeChanged"
        />

        <v-list class="list" v-if="adminAreasWithRating.length">
          <v-list-item-group
            multiple
            v-model="selectedAreaIndices"
            color="primary"
          >
            <v-list-item
              v-for="adminArea in adminAreasWithRating"
              :key="adminArea"
            >
              <v-list-item-content>
                <v-list-item-title>{{ adminArea }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <div v-else class="list">
          <p class="emptyMessage">
            {{
              !adminLayerType
                ? $t('plans.compare.emptyList')
                : $t('plans.compare.noRatings')
            }}
          </p>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="compare">
      <v-card-title>{{ $t('compareAreaRatings') }}</v-card-title>
      <v-card-text class="compare-content">
        <div v-if="selectedAreaIndices.length">
          <BalancedScorecard
            :selectedFeatures="
              selectedAreaIndices.map(index => adminAreasWithRating[index])
            "
            :scorecardType="scorecardType"
          />
        </div>

        <p v-else>{{ $t('plans.compare.emptyCompare') }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {ScorecardMeasureId, ScorecardType} from '@/types/scorecards';

import BalancedScorecard from './balanced-scorecard.vue';

interface Data {
  adminAreaOptions: Array<{text: string; value: string}>;
  selectedAreaIndices: Array<number>;
  scorecardType: ScorecardType;
}

export default Vue.extend({
  components: {
    BalancedScorecard
  },
  data(): Data {
    return {
      adminAreaOptions: [
        AdminLayerType.BOROUGH,
        AdminLayerType.QUARTER,
        AdminLayerType.STATISTICAL_AREA
      ].map(adminArea => ({
        text: this.$t(`adminLayer.${adminArea}`),
        value: adminArea
      })),
      selectedAreaIndices: [],
      scorecardType: ScorecardType.PLANS
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'scorecardRatings'
    ]),
    ratings(): Record<string, Record<ScorecardMeasureId, boolean | undefined>> {
      if (
        !this.adminLayerType ||
        !this.scorecardRatings[ScorecardType.PLANS] ||
        !this.scorecardRatings[ScorecardType.PLANS][this.adminLayerType]
      ) {
        return {};
      }

      return this.scorecardRatings[ScorecardType.PLANS][this.adminLayerType];
    },
    adminAreasWithRating(): Array<string> {
      return Object.keys(this.ratings);
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setAdminLayerType']),
    onLayerTypeChanged(adminLayerType: AdminLayerType) {
      const selectedAdminLayerType =
        adminLayerType === this.adminLayerType ? null : adminLayerType;
      this.setAdminLayerType(selectedAdminLayerType);

      // Reset list selection if admin area selection changed
      this.selectedAreaIndices = [];
    }
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: min(25rem, 30vw) 1fr;
  grid-template-rows: 100%;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 48px - 48px);
}

.area-selection-content {
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 1rem;
  height: 100%;
  padding-bottom: 0;
}

.list {
  margin: 0 -16px;
  padding: 0;
  overflow: auto;
  border-top: 1px solid #ddd;
}

.emptyMessage {
  padding: 16px;
}

.compare {
  overflow: auto;
}

.compare-content {
  height: calc(100% - 2rem - 32px);
}

.compare-content > div {
  height: 100%;
  overflow: auto;
}
</style>
