<template>
  <BalancedScorecardRate :scorecardType="scorecardType" />
</template>

<script lang="ts">
import Vue from 'vue';

import {ScorecardType} from '@/types/scorecards';

import BalancedScorecardRate from './balanced-scorecard-rate.vue';

interface Data {
  scorecardType: ScorecardType;
}

export default Vue.extend({
  components: {
    BalancedScorecardRate
  },
  data(): Data {
    return {
      scorecardType: ScorecardType.STAKEHOLDERS
    };
  }
});
</script>
