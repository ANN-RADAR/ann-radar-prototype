<template>
  <v-tabs>
    <v-tab to="rate">{{ $t('navigation.rate') }}</v-tab>
    <v-tab to="compare"> {{ $t('navigation.compare') }}</v-tab>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions} from 'vuex';

import {MapActionsToMethods} from '@/types/store';

import {ScorecardType} from '@/types/scorecards';

export default Vue.extend({
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchBalancedScorecard'])
  },
  created() {
    this.fetchBalancedScorecard(ScorecardType.PLANS);
  }
});
</script>