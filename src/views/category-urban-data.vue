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
import {mapActions} from 'vuex';

import {MapActionsToMethods} from '@/types/store';
import {ScorecardType} from '@/types/scorecards';

export default Vue.extend({
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchBalancedScorecard',
      'fetchBalancedScorecardRatings'
    ])
  },
  created() {
    this.fetchBalancedScorecard(ScorecardType.URBAN_DATA);
    this.fetchBalancedScorecardRatings(ScorecardType.URBAN_DATA);
  }
});
</script>
