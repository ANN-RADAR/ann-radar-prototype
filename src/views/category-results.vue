<template>
  <v-navigation-drawer
    class="results"
    :value="true"
    @input="toggleResults"
    fixed
    temporary
    width="100%"
  >
    <div class="results-content">
      <div class="map">
        <Map
          hasMultipleFeatureSelection
          :highlightedFeatureIds="currentLayerSelectedFeatureIds"
          disableFeatureSelection
        />
        <div class="map-overlays top-right">
          <MapLayerSwitcher
            :thematicLayers="thematicLayers"
            :thematicLayersTitle="$t(thematicLayersTitleKey)"
            :alwaysVisibleLayers="initialActiveLayers"
          />
          <MapStyleSwitcher />
        </div>
        <div class="map-overlays bottom-right">
          <MapLegends />
        </div>
      </div>

      <v-card class="results-data">
        <v-card-title>
          {{ $t('results.title') }} |
          {{ $t(`adminLayer.${adminLayerType}`) }}
        </v-card-title>
        <v-card-text class="results-data-content">
          <div class="results-data-areas">
            {{ currentLayerSelectedFeatureIds.join(', ') }}
          </div>

          <v-expansion-panels
            accordion
            flat
            tile
            class="panels"
            :class="{closed: expandedPanelIndex == null}"
            v-model="expandedPanelIndex"
          >
            <v-expansion-panel>
              <v-expansion-panel-header
                class="panel-header"
                color="grey lighten-4"
              >
                {{ $t('results.layers', {count: baseLayerTypes.length}) }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="panel-content">
                <v-chip
                  v-for="baseLayerType in baseLayerTypes"
                  :key="baseLayerType"
                  label
                  disabled
                  outlined
                  class="layer-chip"
                >
                  {{ $t(`layer.${baseLayerType}`) }}
                </v-chip>

                <p v-if="!baseLayerTypes.length" class="empty-message">
                  {{ $t('results.noLayersSelected') }}
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header
                class="panel-header"
                color="grey lighten-4"
              >
                {{ $t('results.balancedScorecards') }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="panel-content">
                <BalancedScorecardResults />
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header
                class="panel-header"
                color="grey lighten-4"
              >
                {{ $t('results.potential') }}
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>

          <div
            class="potential-table-wrapper"
            :class="{reduced: expandedPanelIndex !== panelIndices.POTENTIAL}"
          >
            <SolarPotentialInspectorTable
              v-if="category === 'solar'"
              :showAggregationOnly="
                expandedPanelIndex !== panelIndices.POTENTIAL
              "
              :showSelected="false"
            />
            <EnergyPotentialInspectorTable
              v-if="category === 'energy-efficiency'"
              :showAggregationOnly="
                expandedPanelIndex !== panelIndices.POTENTIAL
              "
              :showSelected="false"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import Map from '../components/map-component.vue';
import MapLayerSwitcher from '../components/map-layer-switcher.vue';
import MapStyleSwitcher from '../components/map-style-switcher.vue';
import MapLegends from '../components/map-legends.vue';
import BalancedScorecardResults from '../components/balanced-scorecard-results.vue';
import SolarPotentialInspectorTable from '../components/solar-potential-inspector-table.vue';
import EnergyPotentialInspectorTable from '../components/energy-potential-inspector-table.vue';

import {LayerOptions} from '@/types/layers';
import {mapActions, mapGetters, mapState} from 'vuex';
import {
  MapActionsToMethods,
  MapGettersToComputed,
  MapStateToComputed
} from '@/types/store';
import {ScorecardType} from '@/types/scorecards';

interface Data {
  initialActiveLayers: Array<string>;
  expandedPanelIndex: number | null;
  panelIndices: Record<string, number>;
}

export default Vue.extend({
  components: {
    Map,
    MapLayerSwitcher,
    MapStyleSwitcher,
    MapLegends,
    BalancedScorecardResults,
    SolarPotentialInspectorTable,
    EnergyPotentialInspectorTable
  },
  props: {
    category: {
      type: String,
      required: true
    },
    returnTo: {
      type: String,
      required: true
    },
    thematicLayers: {
      type: Array as PropType<Array<LayerOptions>>,
      required: true
    },
    thematicLayersTitleKey: {
      type: String,
      required: true
    }
  },
  data(): Data {
    return {
      initialActiveLayers: [],
      expandedPanelIndex: null,
      panelIndices: {
        LAYERS: 0,
        BALANCED_SCORECARDS: 1,
        POTENTIAL: 2
      }
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'baseLayerTypes',
      'adminLayerType'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ])
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchBalancedScorecard',
      'fetchBalancedScorecardRatings'
    ]),
    toggleResults(open: boolean) {
      if (!open) {
        this.$router.push(this.returnTo);
      }
    }
  },
  created() {
    if (!this.adminLayerType || !this.currentLayerSelectedFeatureIds.length) {
      this.$router.push(this.returnTo);
      return;
    }

    this.initialActiveLayers = this.baseLayerTypes;

    Object.values(ScorecardType).forEach(scorecardType => {
      this.fetchBalancedScorecard(scorecardType);
    });
    this.fetchBalancedScorecardRatings();
  }
});
</script>

<style scoped>
.results {
  top: auto !important;
  bottom: 0;
  max-height: calc(100% - (48px * 3));
}

.results-content {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  height: 100%;
  padding: 1rem;
}

.results-data {
  display: flex;
  flex-direction: column;
}

.results-data-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 64px);
}

.results-data-areas {
  margin-bottom: 16px;
}

.map {
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

.map-overlays.bottom-right {
  bottom: 0;
  right: 0;
}

.panels {
  grid-gap: 2px;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 164px;
}

.panels.closed {
  min-height: 148px;
}

.panels::v-deep > div {
  display: flex;
  flex-direction: column;
  flex: initial;
  justify-content: center;
  min-height: 48px;
}

.panel-header {
  height: 48px;
}

.panel-content {
  min-height: 0;
}

.panel-content::v-deep > div {
  display: flex;
  padding-top: 16px;
}

.potential-table-wrapper {
  padding: 16px;
  overflow: hidden;
}

.potential-table-wrapper.reduced {
  flex-shrink: 0;
}

.potential-table-wrapper::v-deep > div,
.potential-table-wrapper::v-deep > div > div:last-child,
.potential-table-wrapper::v-deep > div > div:last-child > div,
.potential-table-wrapper::v-deep > div > div:last-child > div > div {
  height: 100% !important;
}

.layer-chip {
  margin-bottom: 8px;
  opacity: 1;
}

.layer-chip:not(:last-child) {
  margin-right: 8px;
}

.empty-message {
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
}
</style>
