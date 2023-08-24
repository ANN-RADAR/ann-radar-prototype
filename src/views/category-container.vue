<template>
  <div>
    <router-view name="navigation" />
    <div class="wrapper" v-if="!$route.path.endsWith('/compare')">
      <keep-alive>
        <Map showLayerSwitcher showStyleSwitcher v-bind="mapProperties">
          <template
            v-if="$route.path.endsWith('/potential/mobility')"
            v-slot:map-controls
          >
            <MapMobilityDrawingPanel
              :drawingActive.sync="mobilityDrawingActive"
              :drawingMode.sync="mobilityDrawingMode"
            />
          </template>
        </Map>
      </keep-alive>
      <PotentialChart v-if="$route.query.chartProperty" />
      <v-card>
        <router-view name="content" />
      </v-card>
    </div>
    <router-view v-else name="content" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Style, {StyleFunction} from 'ol/style/Style';

import i18n from '../plugins/i18n';

import {BalancedScorecardAdminLayerType} from '@/types/admin-layers';
import {LayerOptions} from '@/types/layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

import {
  energyPotentialLayersOptions,
  solarPotentialLayersOptions
} from '@/constants/layers';
import {mobilityDrawPointStyle} from '@/constants/map-layer-styles';

import Map from '../components/map-component.vue';
import MapMobilityDrawingPanel from '../components/map-mobility-drawing-panel.vue';
import {MobilityLocation} from '@/types/potential';
import {Feature} from 'ol';
import Point from 'ol/geom/Point';

import PotentialChart from '../components/potential-chart.vue';

function getPotentialLayers(path: string) {
  if (path.startsWith('/potential/solar')) {
    return {
      title: i18n.t('layerOptions.solarLayers'),
      layerOptions: solarPotentialLayersOptions
    };
  } else if (path.startsWith('/potential/energy-efficiency')) {
    return {
      title: i18n.t('layerOptions.energyLayers'),
      layerOptions: energyPotentialLayersOptions
    };
  }
  return {title: '', layerOptions: []};
}

const mobilityDrawingSource = new VectorSource({wrapX: false});

interface Data {
  potentialLayers: {title: string; layerOptions: Array<LayerOptions>};
  mobilityDrawingSource: VectorSource<Geometry>;
  mobilityDrawPointStyle: StyleFunction | Style;
  mobilityDrawingActive: boolean;
  mobilityDrawingMode: 'draw' | 'erase';
}

export default Vue.extend({
  components: {
    Map,
    MapMobilityDrawingPanel,
    PotentialChart
  },
  data(): Data {
    return {
      potentialLayers: getPotentialLayers(this.$route.path),
      mobilityDrawingSource,
      mobilityDrawPointStyle,
      mobilityDrawingActive: false,
      mobilityDrawingMode: 'draw'
    };
  },
  watch: {
    $route(to, from) {
      this.potentialLayers = getPotentialLayers(to.path);

      if (to.path.startsWith('/potential/mobility')) {
        this.addMobilityLocationsToMap();
      } else if (from.path.startsWith('/potential/mobility')) {
        this.mobilityDrawingActive = false;
        this.updateMobilityLocationsStore();
        this.removeMobilityLocationsFromMap();
      }
    },
    mobilityLocations() {
      if (
        this.$route.path.startsWith('/potential/mobility') &&
        !this.mobilityDrawingSource.getFeatures().length
      ) {
        this.addMobilityLocationsToMap();
      }
    },
    mobilityDrawingActive(newMobilityDrawingActive: boolean) {
      const drawingChangeEventTypes: Array<
        'addfeature' | 'changefeature' | 'removefeature'
      > = ['addfeature', 'changefeature', 'removefeature'];

      if (newMobilityDrawingActive) {
        // Listen to mobility location drawing changes
        drawingChangeEventTypes.forEach(eventType => {
          this.mobilityDrawingSource.on(
            eventType,
            this.updateMobilityLocationsStore
          );
        });
      } else {
        // Clean up event listeners
        drawingChangeEventTypes.forEach(eventType => {
          this.mobilityDrawingSource.un(
            eventType,
            this.updateMobilityLocationsStore
          );
        });
      }
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'highlightedFeatureIds',
      'adminLayerType',
      'mobilityLocations'
    ]),
    mapProperties(): Record<string, unknown> {
      if (this.$route.path.startsWith('/potential')) {
        return {
          showLegends: true,
          hasMultipleFeatureSelection: true,
          thematicLayerOptions: this.potentialLayers.layerOptions,
          layerSwitcherProps: {
            thematicLayersTitle: this.potentialLayers.title
          },
          ...(this.$route.path.startsWith('/potential/mobility') && {
            hasDrawingTools: this.mobilityDrawingActive,
            drawingOptions: {
              mode: this.mobilityDrawingMode,
              source: this.mobilityDrawingSource,
              type: 'Point',
              style: this.mobilityDrawPointStyle
            },
            disableFeatureSelection: this.mobilityDrawingActive
          })
        };
      }

      return {
        highlightedFeatureIds: this.highlightedFeatureIds,
        disableAdminLayers: !this.isAdminLayerOfBalacedScorecardType()
      };
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setMobilityLocations'
    ]),
    isAdminLayerOfBalacedScorecardType(): boolean {
      return Boolean(
        this.adminLayerType &&
          Object.values(BalancedScorecardAdminLayerType).includes(
            this.adminLayerType
          )
      );
    },
    addMobilityLocationsToMap() {
      this.mobilityLocations.forEach(mobilityLocation => {
        const feature = new Feature({
          name: mobilityLocation.id,
          geometry: new Point([mobilityLocation.x, mobilityLocation.y])
        });
        this.mobilityDrawingSource.addFeature(feature);
      });
    },
    removeMobilityLocationsFromMap() {
      this.mobilityDrawingSource.clear();
    },
    updateMobilityLocationsStore() {
      const features = this.mobilityDrawingSource.getFeatures();
      const newMobilityLocations: Array<MobilityLocation> = [];

      features.forEach((feature, index) => {
        const locationId = String(index + 1);

        // Add name property to mobility location feature
        feature.set('name', locationId);

        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const [x, y] = geometry.getCoordinates();
          newMobilityLocations.push({id: locationId, x, y});
        }
      });

      this.setMobilityLocations(newMobilityLocations);
    }
  },
  created() {
    if (this.$route.path.startsWith('/potential/mobility')) {
      this.addMobilityLocationsToMap();
    }
  },
  destroyed() {
    this.removeMobilityLocationsFromMap();
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  grid-template-areas: 'left right';
  gap: 1rem;
  height: 100%;
  min-height: 0;
  padding: 1rem;
}

.wrapper > * {
  position: relative;
  display: grid;
}
</style>
