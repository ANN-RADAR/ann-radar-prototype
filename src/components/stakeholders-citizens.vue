<template>
  <div>
    <div class="wrapper">
      <div class="map">
        <Map />
        <div class="map-overlays top-right">
          <MapStyleSwitcher />
        </div>
      </div>
      <v-card>
        <v-card-text class="content">
          <img src="assets/citizens_engagement.png" />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';

export default Vue.extend({
  components: {
    Map,
    MapStyleSwitcher
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  min-height: 0;
  padding: 1rem;
}

.wrapper > * {
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

.content {
  overflow: auto;
  height: 100%;
}

.content > img {
  max-width: 100%;
}
</style>
