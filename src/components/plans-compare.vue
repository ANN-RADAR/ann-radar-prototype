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

        <v-list class="list">
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
      </v-card-text>
    </v-card>

    <v-card class="compare">
      <v-card-title>{{ $t('compareAreaRatings') }}</v-card-title>
      <v-card-text class="compare-content">
        {{ selectedAreaIndices.map(index => adminAreasWithRating[index]) }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {
  MapActionsToMethods,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';
import {ScorecardMeasureId, ScorecardType} from '@/types/scorecards';

interface Data {
  adminAreaOptions: Array<{text: string; value: string}>;
  selectedAreaIndices: Array<number>;
}

export default Vue.extend({
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
      selectedAreaIndices: []
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'scorecardRatings'
    ]),
    ratings(): Record<string, Record<ScorecardMeasureId, boolean>> {
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
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchPlansScorecardRatings'
    ]),
    ...(mapMutations as MapMutationsToMethods)('root', ['setAdminLayerType']),
    onLayerTypeChanged(adminLayerType: AdminLayerType) {
      const selectedAdminLayerType =
        adminLayerType === this.adminLayerType ? null : adminLayerType;
      this.setAdminLayerType(selectedAdminLayerType);

      // Reset list selection if admin area selection changed
      this.selectedAreaIndices = [];
    }
  },
  created() {
    this.fetchPlansScorecardRatings();
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
</style>
