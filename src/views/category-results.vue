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
      <Map
        hasMultipleFeatureSelection
        :highlightedFeatureIds="currentLayerSelectedFeatureIds"
        disableFeatureSelection
        :thematicLayerOptions="thematicLayers"
        showLayerSwitcher
        :layerSwitcherProps="{
          thematicLayersTitle: thematicLayersTitle,
          alwaysVisibleLayers: initialActiveLayers
        }"
        showStyleSwitcher
        showLegends
      />

      <v-card class="results-data" id="tour-results">
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
            <PotentialInspectorTable
              :category="category"
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
import BalancedScorecardResults from '../components/balanced-scorecard-results.vue';
import PotentialInspectorTable from '../components/potential-inspector-table.vue';

import {LayerOptions} from '@/types/layers';
import {mapGetters, mapState} from 'vuex';
import {MapGettersToComputed, MapStateToComputed} from '@/types/store';

interface Data {
  initialActiveLayers: Array<string>;
  expandedPanelIndex: number | null;
  panelIndices: Record<string, number>;
}

export default Vue.extend({
  components: {
    Map,
    BalancedScorecardResults,
    PotentialInspectorTable
  },
  props: {
    category: {
      type: String as PropType<'solar' | 'energyEfficiency' | 'mobility'>,
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
    thematicLayersTitle: {
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
