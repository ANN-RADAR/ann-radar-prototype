<template>
  <v-select
    solo
    dense
    hide-details
    :value="adminLayerType"
    :items="adminLayerOptions"
    chips
    :label="$t('adminArea')"
    @change="onLayerTypeChanged"
  >
    <template #selection="{item}">
      <v-tooltip v-if="item.disabled" bottom>
        <template v-slot:activator="{on, attrs}">
          <v-icon class="info-icon" v-bind="attrs" v-on="on"
            >mdi-information</v-icon
          >
        </template>
        <span>{{ $t('adminAreaSelector.areaNotAvailable') }}</span>
      </v-tooltip>
      <v-list-item class="area-select-item" dense :disabled="item.disabled">{{
        item.text
      }}</v-list-item>
    </template></v-select
  >
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {
  AdminLayerType,
  BalancedScorecardAdminLayerType
} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

interface Data {
  allAdminLayerTypes: Array<AdminLayerType>;
  balancedScorecardAdminLayerTypes: Array<
    BalancedScorecardAdminLayerType | string
  >;
}

export default Vue.extend({
  data(): Data {
    return {
      allAdminLayerTypes: Object.values(AdminLayerType),
      balancedScorecardAdminLayerTypes: Object.values(
        BalancedScorecardAdminLayerType
      )
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

<style scoped>
.area-select-item {
  padding-left: 0;
}
.info-icon {
  padding-right: 12px;
}
</style>