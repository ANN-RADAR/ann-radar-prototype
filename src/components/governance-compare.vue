<template>
  <BalancedScorecardCompare :scorecardType="scorecardType" />
</template>

<script lang="ts">
import Vue from 'vue';

import {ScorecardType} from '@/types/scorecards';

import BalancedScorecardCompare from './balanced-scorecard-compare.vue';

interface Data {
  scorecardType: ScorecardType;
}

export default Vue.extend({
  components: {
    BalancedScorecardCompare
  },
  data(): Data {
    return {
      scorecardType: ScorecardType.GOVERNANCE
    };
  }
});
</script>
