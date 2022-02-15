<template>
  <v-card>
    <v-card-title>Gebiete inspizieren</v-card-title>
    <v-card-text>
      <v-sheet>
        <v-btn
          v-for="adminAreaName in adminAreaNames"
          :key="adminAreaName"
          :color="selectedAdminAreaType === adminAreaName ? 'primary' : ''"
          @click="onAreaTypeChanged(adminAreaName)"
        >
          {{ adminAreaName }}
        </v-btn>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
type Data = {
  adminAreaNames: string[];
  selectedAdminAreaType: string | null;
};

import Vue from 'vue';
import {adminAreaNames} from '@/constants/admin-levels';

export default Vue.extend({
  data(): Data {
    return {
      adminAreaNames,
      selectedAdminAreaType: null
    };
  },
  methods: {
    onAreaTypeChanged(adminAreaName: string) {
      this.selectedAdminAreaType =
        adminAreaName === this.selectedAdminAreaType ? null : adminAreaName;
      this.$emit('adminAreasSelected', adminAreaName);
    }
  }
});
</script>
