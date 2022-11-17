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
            />
          </template>
        </Map>
      </keep-alive>
      <v-card><router-view name="content" /></v-card>
    </div>
    <router-view v-else name="content" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState} from 'vuex';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Style, {StyleFunction} from 'ol/style/Style';

import i18n from '../plugins/i18n';

import {BalancedScorecardAdminLayerType} from '@/types/admin-layers';
import {LayerOptions} from '@/types/layers';
import {MapStateToComputed} from '@/types/store';

import {
  energyPotentialLayersOptions,
  solarPotentialLayersOptions
} from '@/constants/layers';
import {mobilityDrawPointStyle} from '@/constants/map-layer-styles';

import Map from '../components/map-component.vue';
import MapMobilityDrawingPanel from '../components/map-mobility-drawing-panel.vue';

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
}

export default Vue.extend({
  components: {
    Map,
    MapMobilityDrawingPanel
  },
  data(): Data {
    return {
      potentialLayers: getPotentialLayers(this.$route.path),
      mobilityDrawingSource,
      mobilityDrawPointStyle,
      mobilityDrawingActive: false
    };
  },
  watch: {
    $route(to) {
      this.potentialLayers = getPotentialLayers(to.path);
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'highlightedFeatureIds',
      'adminLayerType'
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
              source: this.mobilityDrawingSource,
              type: 'Point',
              style: this.mobilityDrawPointStyle
            }
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
    isAdminLayerOfBalacedScorecardType(): boolean {
      return Boolean(
        this.adminLayerType &&
          Object.values(BalancedScorecardAdminLayerType).includes(
            this.adminLayerType
          )
      );
    }
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
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
