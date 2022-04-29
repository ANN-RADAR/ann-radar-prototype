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
import {mapActions, mapMutations} from 'vuex';

import {MapActionsToMethods, MapMutationsToMethods} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';
import {ScorecardType} from '@/types/scorecards';

export default Vue.extend({
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchBalancedScorecard',
      'fetchBalancedScorecardRatings'
    ]),
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setSelectedFeatureIds'
    ])
  },
  created() {
    this.fetchBalancedScorecard(ScorecardType.STAKEHOLDERS);
    this.fetchBalancedScorecardRatings();
  },
  destroyed() {
    // Reset selections on destroy
    this.setAdminLayerType(null);
    this.setSelectedFeatureIds({} as Record<AdminLayerType, Array<string>>);
  }
});
</script>
