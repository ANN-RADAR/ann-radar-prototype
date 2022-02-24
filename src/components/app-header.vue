<template>
  <v-app-bar app>
    <div class="d-flex align-center">
      <v-btn to="/solar">Solar</v-btn>
      <v-btn to="/energy-efficency">Energieeffizienz</v-btn>
      <v-btn to="/mobility">Mobilität</v-btn>
    </div>
    <v-spacer></v-spacer>
    <div class="d-flex align-center heading">ANN RADAR</div>
    <v-btn @click="logOut">Logout</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import {logOut} from '@/libs/auth';

export default Vue.extend({
  methods: {
    logOut() {
      logOut();
    }
  }
});
</script>

<style scoped>
.heading {
  font-size: 1.5rem;
}
</style>
