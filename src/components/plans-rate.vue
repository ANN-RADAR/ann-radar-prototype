<template>
  <div class="wrapper">
    <div class="map">
      <Map />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card class="rate">
      <v-card-title>{{ $t('rateAreas') }}</v-card-title>
      <v-card-text class="rate-content">
        <nav class="areas-navigation">
          <v-btn
            v-for="layerType in adminLayerTypes"
            :key="layerType"
            :color="layerType === adminLayerType ? 'primary' : ''"
            @click="onLayerTypeChanged(layerType)"
          >
            {{ $t(`adminLayer.${layerType}`) }}
          </v-btn>
        </nav>

        <template v-if="showScorecard">
          <div class="rate-selected-area">{{ selectedFeatureName }}</div>
          <div class="scorecard">
            <article
              v-for="({objective, measures}, index) in scorecard"
              :key="objective || `objective-${index}`"
            >
              <h3 v-if="objective" class="scorecard-objective">
                {{ objective }}
              </h3>

              <div
                v-for="measure in measures"
                :key="measure.id"
                class="scorecard-measure"
              >
                <label>
                  {{ measure.description }}
                </label>

                <v-checkbox hide-details />
                <v-textarea solo flat dense hide-details rows="1" />
              </div>
            </article>
          </div>
        </template>
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

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import {Scorecard, ScorecardType} from '@/types/scorecards';

interface Data {
  adminLayerTypes: AdminLayerType[];
}

export default Vue.extend({
  components: {
    Map,
    MapStyleSwitcher
  },
  data(): Data {
    return {
      adminLayerTypes: [
        AdminLayerType.BOROUGH,
        AdminLayerType.QUARTER,
        AdminLayerType.STATISTICAL_AREA
      ]
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'adminLayerData',
      'scorecards'
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
    showScorecard(): boolean {
      return Boolean(
        this.adminLayerType &&
          this.adminLayerData[this.adminLayerType] &&
          this.adminLayerData[this.adminLayerType].selectedFeatureDataKeys
            .length
      );
    },
    scorecard(): Scorecard {
      return this.scorecards[ScorecardType.PLANS];
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchPlansScorecard']),
    ...(mapMutations as MapMutationsToMethods)('root', ['setAdminLayerType']),
    onLayerTypeChanged(adminLayerType: AdminLayerType) {
      const selectedAdminLayerType =
        adminLayerType === this.adminLayerType ? null : adminLayerType;
      this.setAdminLayerType(selectedAdminLayerType);
    }
  },
  created() {
    this.fetchPlansScorecard();
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 48px - 48px);
}

.wrapper > * {
  position: relative;
}

.map-overlays {
  position: absolute;
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
  padding: 8px;
}

.map-overlays.top-right {
  top: 0;
  right: 0;
}

.areas-navigation {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 0.5rem;
  margin-bottom: 1rem;
}

.rate-content {
  display: grid;
  grid-template-rows: auto 40px auto 1fr;
  height: calc(100% - 2rem - 32px);
}

.rate-selected-area {
  display: flex;
  align-items: center;
  height: 24px;
  margin: 0.5rem 0;
  padding-left: 50%;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 700;
}

.scorecard {
  display: grid;
  row-gap: 0.5rem;
  overflow: auto;
}

.scorecard > article {
  position: relative;
  display: grid;
  padding: 0.5rem 0.75rem;
  background-color: #f5f5f5;
}

.scorecard-objective {
  z-index: 1;
  position: sticky;
  top: 0;
  margin: -0.5rem -0.75rem 0;
  padding: 0.5rem 0.75rem;
  background-color: #f5f5f5;
}

.scorecard-objective ~ .scorecard-measure > label {
  margin-left: 1rem;
}

.scorecard-measure {
  display: grid;
  grid-template-columns: 50% auto 1fr;
  column-gap: 0.25rem;
  align-items: center;
  min-height: 48px;
}

.scorecard-measure > div {
  margin: 0;
  padding: 0;
}

.scorecard-measure > label {
  padding: 0.4375rem 0;
  line-height: 1.2em;
}
</style>
