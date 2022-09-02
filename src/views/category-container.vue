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
                  thematicLayerOptions: this.thematicLayerOptions,
                  showLayerSwitcher: true,
                  layerSwitcherProps: {
                    thematicLayersTitle:
                      this.layerSwitcherProps.thematicLayersTitle
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
import Vue, {PropType} from 'vue';

import {LayerOptions} from '@/types/layers';

import Map from '../components/map-component.vue';
import {mapState} from 'vuex';
import {MapStateToComputed} from '@/types/store';

export default Vue.extend({
  components: {
    Map
  },
  props: {
    thematicLayerOptions: {
      type: Array as PropType<Array<LayerOptions>>,
      required: true
    },
    layerSwitcherProps: {
      type: Object as PropType<{thematicLayersTitle: string}>,
      required: true
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