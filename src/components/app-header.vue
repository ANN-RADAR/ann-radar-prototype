<template>
  <v-app-bar app elevation="2" dense class="header">
    <v-tabs v-model="tab">
      <v-tab to="/potential">{{ $t('navigation.potential') }}</v-tab>
      <v-tab to="/plans">{{ $t('navigation.plans') }}</v-tab>
      <v-tab to="/stakeholders">{{ $t('navigation.stakeholders') }}</v-tab>
      <v-tab to="/urban-data">{{ $t('navigation.urbanData') }}</v-tab>
      <v-tab to="/governance">{{ $t('navigation.governance') }}</v-tab>
    </v-tabs>

    <h1 class="headline">{{ $t('annRadar') }}</h1>

    <v-btn @click="logOut">{{ $t('auth.logout') }}</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import {logOut} from '@/libs/auth';

export default Vue.extend({
  data() {
    return {
      tab: 0
    };
  },
  methods: {
    logOut() {
      logOut();
    }
  }
});
</script>

<style scoped>
.header::v-deep > div {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: 16px;
}
</style>
