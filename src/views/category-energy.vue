<template>
  <v-main>
    <Header />
    <v-container
      fluid
      style="display: flex; flex-direction: column; height: 100%; padding: 0"
    >
      <v-tabs v-model="tab">
        <v-tab>{{ $t('navigation.potential') }}</v-tab>
        <v-tab>{{ $t('navigation.plans') }}</v-tab>
        <v-tab>{{ $t('navigation.stakeholders') }}</v-tab>
        <v-tab>{{ $t('navigation.urbanData') }}</v-tab>
        <v-tab>{{ $t('navigation.governance') }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="height: 100%">
        <v-tab-item style="flex-grow: 1">
          <Potential />
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue';

import Potential from '../components/energy-potential.vue';
import Header from '../components/app-header.vue';

export default Vue.extend({
  components: {
    Potential,
    Header
  },

  data() {
    return {
      tab: 0
    };
  }
});
</script>
