<template>
  <v-app-bar app elevation="2" class="header">
    <nav class="navigation">
      <v-btn active-class="primary" to="/solar">
        {{ $t('navigation.solar') }}
      </v-btn>
      <v-btn active-class="primary" to="/energy-efficiency">
        {{ $t('navigation.energyEfficiency') }}
      </v-btn>
      <v-btn active-class="primary" to="/mobility">
        {{ $t('navigation.mobility') }}
      </v-btn>
    </nav>

    <h1 class="headline">{{ $t('annRadar') }}</h1>

    <v-btn @click="logOut">{{ $t('auth.logout') }}</v-btn>
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
.header >>> div {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: 16px;
}

.navigation {
  display: flex;
  align-items: center;
  grid-gap: 8px;
}
</style>
