<template>
  <div>
    <router-view name="navigation" />
    <div class="wrapper">
      <keep-alive>
        <Map
          v-if="!this.$route.path.endsWith('/compare')"
          showStyleSwitcher
          v-bind="
            this.$route.path.startsWith('/potential')
              ? {
                  showLegends: true,
                  hasMultipleFeatureSelection: true,
                  thematicLayerOptions: this.potentialLayers.layerOptions,
                  showLayerSwitcher: true,
                  layerSwitcherProps: {
                    thematicLayersTitle: this.potentialLayers.title
                  }
                }
              : {highlightedFeatureIds: this.highlightedFeatureIds}
          "
      /></keep-alive>
      <router-view name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import i18n from '../plugins/i18n';

import {LayerOptions} from '@/types/layers';

import Map from '../components/map-component.vue';
import {mapState} from 'vuex';
import {MapStateToComputed} from '@/types/store';
import {
  energyPotentialLayersOptions,
  solarPotentialLayersOptions
} from '@/constants/layers';

function getPotentialLayers(path: string) {
  let layerOptions: Array<LayerOptions> = [];
  let title = '';
  if (path.startsWith('/potential/solar')) {
    title = i18n.t('layerOptions.solarLayers');
    layerOptions = solarPotentialLayersOptions;
  } else if (path.startsWith('/potential/energy-efficiency')) {
    title = i18n.t('layerOptions.energyLayers');
    layerOptions = energyPotentialLayersOptions;
  }
  return {title, layerOptions};
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
    ...(mapState as MapStateToComputed)('root', ['highlightedFeatureIds'])
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