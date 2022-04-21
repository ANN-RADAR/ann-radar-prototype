<template>
  <div>
    <v-tabs>
      <v-tab to="rate">{{ $t('navigation.rate') }}</v-tab>
      <v-tab to="compare"> {{ $t('navigation.compare') }}</v-tab>
    </v-tabs>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>
