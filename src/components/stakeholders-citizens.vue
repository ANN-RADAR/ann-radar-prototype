<template>
  <div>
    <div class="wrapper">
      <Map showStyleSwitcher />
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

export default Vue.extend({
  components: {
    Map
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

.content {
  overflow: auto;
  height: 100%;
}

.content > img {
  max-width: 100%;
}
</style>
