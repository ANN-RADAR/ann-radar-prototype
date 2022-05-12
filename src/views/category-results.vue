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
      </div>
      <v-card>Hello results!</v-card>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import Map from '../components/map-component.vue';

export default Vue.extend({
  components: {
    Map
  },
  props: {
    returnTo: {
      type: String,
      required: true
    }
  },
  methods: {
    toggleResults(open: boolean) {
      if (!open) {
        this.$router.push(this.returnTo);
      }
    }
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
</style>
