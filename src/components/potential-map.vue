<template>
  <Map
    hasMultipleFeatureSelection
    :thematicLayerOptions="potentialLayers.layerOptions"
    showLayerSwitcher
    :layerSwitcherProps="{
      thematicLayersTitle: $t(potentialLayers.titleKey)
    }"
    showStyleSwitcher
    showLegends
  />
</template>

<script lang="ts">
import Vue from 'vue';

import {LayerOptions} from '@/types/layers';
import {
  solarPotentialLayersOptions,
  energyPotentialLayersOptions
} from '../constants/layers';

import Map from './map-component.vue';

function getPotentialLayers(path: string) {
  let layerOptions: Array<LayerOptions> = [];
  let titleKey = '';
  if (path.startsWith('/potential/solar')) {
    titleKey = 'layerOptions.solarLayers';
    layerOptions = solarPotentialLayersOptions;
  } else if (path.startsWith('/potential/energy-efficiency')) {
    titleKey = 'layerOptions.energyLayers';
    layerOptions = energyPotentialLayersOptions;
  }
  return {titleKey, layerOptions};
}

interface Data {
  potentialLayers: {titleKey: string; layerOptions: Array<LayerOptions>};
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
  }
});
</script>