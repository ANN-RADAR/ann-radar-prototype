<template>
  <v-card>
    <v-card-title>Gebiete inspizieren</v-card-title>
    <v-card-text>
      <v-sheet>
        <v-btn
          v-for="layerType in adminLayerTypes"
          :key="layerType"
          :color="layerType === adminLayerType ? 'primary' : ''"
          @click="onLayerTypeChanged(layerType)"
        >
          {{ layerType }}
        </v-btn>
      </v-sheet>
    </v-card-text>

    <EnergyPotentialInspectorTable />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {AdminLayerType} from '@/types/admin-layers';
import {MapStateToComputed} from '@/types/store';
import EnergyPotentialInspectorTable from './energy-potential-inspector-table.vue';

interface Data {
  adminLayerTypes: AdminLayerType[];
}

export default Vue.extend({
  components: {
    EnergyPotentialInspectorTable
  },
  data(): Data {
    return {
      adminLayerTypes: Object.values(AdminLayerType)
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)(['adminLayerType'])
  },
  methods: {
    ...mapMutations(['setAdminLayerType']),
    onLayerTypeChanged(adminLayerType: AdminLayerType) {
      const selectedAdminLayerType =
        adminLayerType === this.adminLayerType ? null : adminLayerType;
      this.setAdminLayerType(selectedAdminLayerType);
    }
  }
});
</script>
