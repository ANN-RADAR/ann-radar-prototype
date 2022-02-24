<template>
  <v-app-bar app>
    <div class="d-flex align-center">
      <v-btn to="/solar">{{ $t('navigation.solar') }}</v-btn>
      <v-btn to="/energy-efficiency">
        {{ $t('navigation.energyEfficiency') }}
      </v-btn>
      <v-btn to="/mobility">{{ $t('navigation.mobility') }}</v-btn>
    </div>
    <v-spacer></v-spacer>
    <div class="d-flex align-center heading">{{ $t('annRadar') }}</div>
    <v-btn @click="logOut">{{ $t('logout') }}</v-btn>
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
