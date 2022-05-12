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
        <Map hasMultipleFeatureSelection />
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
      <v-card>Hello results!</v-card>
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
import {mapState} from 'vuex';
import {MapStateToComputed} from '@/types/store';

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
    ...(mapState as MapStateToComputed)('root', ['baseLayerTypes'])
  },
  methods: {
    toggleResults(open: boolean) {
      if (!open) {
        this.$router.push(this.returnTo);
      }
    }
  },
  created() {
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
</style>
