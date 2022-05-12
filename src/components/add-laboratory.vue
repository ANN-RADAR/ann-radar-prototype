<template>
  <div class="laboratory">
    <div class="map">
      <Map
        hasMultipleFeatureSelection
        :drawingSource="source"
        :showDrawingTools="true"
      />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card> Formular </v-card>

    <router-view />
  </div>
</template>

<script lang="ts">
import Geometry from 'ol/geom/Geometry';
import VectorSource, {VectorSourceEvent} from 'ol/source/Vector';
import Vue from 'vue';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';

interface Data {
  source: VectorSource<Geometry>;
}

const source = new VectorSource({wrapX: false});

source.on('addfeature', (event: VectorSourceEvent<Geometry>) =>
  // save drawn feature
  console.log(event.feature)
);

export default Vue.extend({
  components: {
    Map,
    MapStyleSwitcher
  },
  data(): Data {
    return {source};
  }
});
</script>

<style scoped>
.laboratory {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  height: 100%;
  padding: 1rem;
}

.laboratory > * {
  position: relative;
  display: grid;
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
