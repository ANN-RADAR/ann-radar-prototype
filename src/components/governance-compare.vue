<template>
  <BalancedScorecardCompare
    :adminLayerTypes="adminLayerTypes"
    :scorecardType="scorecardType"
  />
</template>

<script lang="ts">
import Vue from 'vue';

import {AdminLayerType} from '@/types/admin-layers';
import {ScorecardType} from '@/types/scorecards';

import BalancedScorecardCompare from './balanced-scorecard-compare.vue';

interface Data {
  adminLayerTypes: Array<AdminLayerType>;
  scorecardType: ScorecardType;
}

export default Vue.extend({
  components: {
    BalancedScorecardCompare
  },
  data(): Data {
    return {
      adminLayerTypes: [
        AdminLayerType.DISTRICT,
        AdminLayerType.QUARTER,
        AdminLayerType.STATISTICAL_AREA
      ],
      scorecardType: ScorecardType.GOVERNANCE
    };
  }
});
</script>
