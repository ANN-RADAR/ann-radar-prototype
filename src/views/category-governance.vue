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
import {AdminLayerData, AdminLayerType} from '@/types/admin-layers';
import {ScorecardType} from '@/types/scorecards';

export default Vue.extend({
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchScorecard',
      'fetchScorecardRatings'
    ]),
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setAdminLayerData'
    ])
  },
  created() {
    this.fetchScorecard(ScorecardType.GOVERNANCE);
    this.fetchScorecardRatings(ScorecardType.GOVERNANCE);
  },
  destroyed() {
    // Reset selections on destroy
    this.setAdminLayerType(null);
    this.setAdminLayerData({} as Record<AdminLayerType, AdminLayerData>);
  }
});
</script>
