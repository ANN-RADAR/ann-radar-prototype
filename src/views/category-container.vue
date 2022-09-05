<template>
  <div>
    <router-view name="navigation" />
    <div :class="{wrapper: !$route.path.endsWith('/compare')}">
      <keep-alive>
        <Map
          v-if="!$route.path.endsWith('/compare')"
          showStyleSwitcher
          v-bind="
            $route.path.startsWith('/potential')
              ? {
                  showLegends: true,
                  hasMultipleFeatureSelection: true,
                  thematicLayerOptions: potentialLayers.layerOptions,
                  showLayerSwitcher: true,
                  layerSwitcherProps: {
                    thematicLayersTitle: potentialLayers.title
                  }
                }
              : {
                  highlightedFeatureIds,
                  disableAdminLayers: !isAdminLayerOfBalacedScorecardType()
                }
          "
      /></keep-alive>
      <router-view
        name="content"
        v-if="
          $route.path.startsWith('/potential') ||
          $route.path.startsWith('/stakeholders/organizations') ||
          $route.path.startsWith('/stakeholders/citizens') ||
          isAdminLayerOfBalacedScorecardType()
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import i18n from '../plugins/i18n';

import {BalancedScorecardAdminLayerType} from '@/types/admin-layers';
import {LayerOptions} from '@/types/layers';

import Map from '../components/map-component.vue';
import {mapState} from 'vuex';
import {MapStateToComputed} from '@/types/store';
import {
  energyPotentialLayersOptions,
  solarPotentialLayersOptions
} from '@/constants/layers';

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

interface Data {
  potentialLayers: {title: string; layerOptions: Array<LayerOptions>};
}

export default Vue.extend({
  components: {
    Map
  },
  data(): Data {
    return {potentialLayers: getPotentialLayers(this.$route.path)};
  },
  watch: {
    $route(to, _) {
      this.potentialLayers = getPotentialLayers(to.path);
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'highlightedFeatureIds',
      'adminLayerType'
    ])
  },
  methods: {
    isAdminLayerOfBalacedScorecardType: function () {
      return (
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
  padding: 1rem;
}

.wrapper > * {
  position: relative;
  display: grid;
}
</style>