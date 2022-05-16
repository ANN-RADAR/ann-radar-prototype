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
      <v-card>
        <v-card-title>
          {{ $t('results.title') }} |
          {{ $t(`adminLayer.${adminLayerType}`) }}
        </v-card-title>
        <v-card-text>
          <div class="results-data-areas">
            {{ currentLayerSelectedFeatureIds.join(', ') }}
          </div>

          <v-expansion-panels accordion flat tile class="panels">
            <v-expansion-panel>
              <v-expansion-panel-header color="grey lighten-4">
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
              <v-expansion-panel-header color="grey lighten-4">
                {{ $t('results.balancedScorecards') }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="panel-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="grey lighten-4">
                {{ $t('results.potential') }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="panel-content">
                {{ currentLayerSelectedFeatureIds }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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

import {LayerOptions} from '@/types/layers';
import {mapGetters, mapState} from 'vuex';
import {MapGettersToComputed, MapStateToComputed} from '@/types/store';

interface Data {
  initialActiveLayers: Array<string>;
}

export default Vue.extend({
  components: {
    Map,
    MapLayerSwitcher,
    MapStyleSwitcher,
    MapLegends
  },
  props: {
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
      initialActiveLayers: []
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
}

.panel-content::v-deep > div {
  padding-top: 16px;
}

.layer-chip {
  margin-bottom: 8px;
  opacity: 1;
}

.layer-chip:not(:last-child) {
  margin-right: 8px;
}

.empty-message {
  color: rgba(0, 0, 0, 0.6);
}
</style>
