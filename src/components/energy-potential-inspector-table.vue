<template>
  <v-container class="table-container" ref="tableContainer">
    <v-data-table
      v-if="adminLayerType"
      :headers="tableHeaders"
      :items="selectedFeaturesData"
      :item-key="adminLayers[adminLayerType].dataId"
      :show-select="true"
      :height="100"
      :fixed-header="true"
      hide-default-footer
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.AnzFl="{item}">
        <span v-if="item.AnzFl !== undefined">{{
          formatNumber(Math.round(item.AnzFl))
        }}</span>
        <span v-else>k. A.</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.mittlFl="{item}">
        <span v-if="item.mittlFl !== undefined"
          >{{ formatNumber(Math.round(item.mittlFl)) }}&nbsp;m²</span
        >
        <span v-else>k. A.</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.BGF="{item}">
        <span v-if="item.BGF !== undefined"
          >{{ formatNumber(Math.round(item.BGF)) }}&nbsp;m²</span
        >
        <span v-else>k. A.</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.tatNu_WB_P="{item}">
        <span v-if="item.tatNu_WB_P !== undefined"
          >{{ formatNumber(item.tatNu_WB_P) }}&nbsp;%</span
        >
        <span v-else>k. A.</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.Bev_311219="{item}">
        <span v-if="item.Bev_311219 !== undefined">{{
          formatNumber(Math.round(item.Bev_311219))
        }}</span>
        <span v-else>k. A.</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.p_st_mwh_a="{item}">
        <span v-if="item.p_st_mwh_a !== undefined"
          >{{ formatNumber(item.p_st_mwh_a) }}&nbsp;MWh/a</span
        >
        <span v-else>k. A.</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.Soz_Status="{item}">
        <span v-if="item.Soz_Status !== undefined">{{ item.Soz_Status }}</span>
        <span v-else>k. A.</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

import {AdminLayerType} from '@/types/admin-layers';
import {formatNumber} from '@/libs/format';
import {adminLayers} from '@/constants/admin-layers';
import {DataTableHeader} from 'vuetify';

interface Data {
  adminLayers: typeof adminLayers;
  tableHeaders: Array<DataTableHeader>;
}

export default Vue.extend({
  props: {
    selectedFeaturesNames: {
      type: Array as PropType<Array<string> | undefined>,
      required: false
    }
  },
  data(): Data {
    return {
      adminLayers,
      tableHeaders: [
        {
          text: this.$store.state.adminLayerType || '',
          sortable: true,
          value: this.$store.state.adminLayerType
            ? adminLayers[this.$store.state.adminLayerType].dataId
            : ''
        },
        {
          text: 'Flurstücke',
          sortable: true,
          value: 'AnzFl'
        },
        {
          text: 'mittl. Flurstückgröße',
          sortable: true,
          value: 'mittlFl'
        },
        {text: 'BGF', sortable: true, value: 'BGF'},
        {
          text: 'Wohnbaufläche',
          sortable: true,
          value: 'tatNu_WB_P'
        },
        {
          text: 'Bevölkerung',
          sortable: true,
          value: 'Bev_311219'
        },
        {
          text: 'Solarpotenzial',
          sortable: true,
          value: 'p_st_mwh_a'
        }
      ].concat(
        this.$store.state.adminLayerType === 'StatGebiet'
          ? [
              {
                text: 'Soz. Status',
                sortable: true,
                value: 'Soz_Status'
              }
            ]
          : []
      )
    };
  },
  computed: {
    adminLayerType(): AdminLayerType {
      return this.$store.state.adminLayerType;
    }
  },
  methods: {
    formatNumber(
      ...args: Parameters<typeof formatNumber>
    ): ReturnType<typeof formatNumber> {
      return formatNumber(...args);
    }
  }
});
</script>
