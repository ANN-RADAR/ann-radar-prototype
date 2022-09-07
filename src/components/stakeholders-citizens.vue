<template>
  <v-card>
    <v-card-text class="content">
      <img src="assets/citizens_engagement.png" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend();
</script>

<style scoped>
.content {
  overflow: auto;
  height: 100%;
}

.content > img {
  max-width: 100%;
}
</style>
