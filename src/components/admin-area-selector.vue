<template>
  <v-select
    solo
    dense
    hide-details
    :value="adminLayerType"
    :items="adminLayerOptions"
    :label="$t('adminArea')"
    @change="onLayerTypeChanged"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

interface Data {
  allAdminLayerTypes: Array<AdminLayerType>;
  balancedScorecardAdminLayerTypes: Array<AdminLayerType>;
}

export default Vue.extend({
  data(): Data {
    return {
      allAdminLayerTypes: Object.values(AdminLayerType),
      balancedScorecardAdminLayerTypes: [
        AdminLayerType.DISTRICT,
        AdminLayerType.QUARTER,
        AdminLayerType.STATISTICAL_AREA
      ]
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['adminLayerType']),
    adminLayerOptions(): Array<{
      text: string;
      value: string;
      disabled?: boolean;
    }> {
      return this.allAdminLayerTypes.map(adminArea => {
        const isBalancedScorecardView =
          !this.$route.path.startsWith('/potential');
        const adminAreaIsAvailable =
          !isBalancedScorecardView ||
          this.balancedScorecardAdminLayerTypes.includes(adminArea);

        return {
          text: this.$t(`adminLayer.${adminArea}`),
          value: adminArea,
          disabled: !adminAreaIsAvailable
        };
      });
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setAdminLayerType']),
    onLayerTypeChanged(adminLayerType: AdminLayerType) {
      const selectedAdminLayerType =
        adminLayerType === this.adminLayerType ? null : adminLayerType;
      this.setAdminLayerType(selectedAdminLayerType);
    }
  }
});
</script>
