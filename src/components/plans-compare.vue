<template>
  <div class="wrapper">
    <v-card class="area-selection"></v-card>
    <v-card class="compare"></v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: min(25rem, 30vw) 1fr;
  grid-template-rows: 100%;
  gap: 1rem;
  padding: 1rem;
  height: calc(100vh - 48px - 48px);
}
</style>
