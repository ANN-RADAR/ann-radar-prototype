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
import Vue from 'vue';
import {AdminLayerType} from '@/types/admin-layers';

interface Data {
  adminAreaTypes: AdminLayerType[];
  selectedAdminAreaType: AdminLayerType | null;
}

export default Vue.extend({
  data(): Data {
    return {
      adminAreaTypes: Object.values(AdminLayerType),
      selectedAdminAreaType: null
    };
  },
  methods: {
    onAreaTypeChanged(adminAreaType: AdminLayerType) {
      this.selectedAdminAreaType =
        adminAreaType === this.selectedAdminAreaType ? null : adminAreaType;
      this.$emit('onAdminAreaTypeSelected', this.selectedAdminAreaType);
    }
  }
});
</script>
