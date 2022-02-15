<template>
  <v-card>
    <v-card-title>Gebiete inspizieren</v-card-title>
    <v-card-text>
      <v-sheet>
        <v-btn
          v-for="adminAreaType in adminAreaTypes"
          :key="adminAreaType"
          :color="selectedAdminAreaType === adminAreaType ? 'primary' : ''"
          @click="onAreaTypeChanged(adminAreaType)"
        >
          {{ adminAreaType }}
        </v-btn>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
type Data = {
  adminAreaTypes: string[];
  selectedAdminAreaType: string | null;
};

import Vue from 'vue';
import {adminAreaTypes} from '@/constants/admin-levels';

export default Vue.extend({
  data(): Data {
    return {
      adminAreaTypes,
      selectedAdminAreaType: null
    };
  },
  methods: {
    onAreaTypeChanged(adminAreaType: string) {
      this.selectedAdminAreaType =
        adminAreaType === this.selectedAdminAreaType ? null : adminAreaType;
      this.$emit('onAdminAreaTypeSelected', this.selectedAdminAreaType);
    }
  }
});
</script>
