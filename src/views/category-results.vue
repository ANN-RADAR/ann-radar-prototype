<template>
  <v-navigation-drawer
    class="results"
    :value="true"
    @input="toggleResults"
    fixed
    temporary
    width="100%"
  >
    Hello results!
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
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
  padding: 1rem;
}
</style>
