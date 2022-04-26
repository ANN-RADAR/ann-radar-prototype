<template>
  <div
    class="inspector-table-container"
    ref="tableContainer"
    v-resize="onResize"
  >
    <v-data-table
      class="inspector-table"
      v-if="adminLayerType"
      :value="selectedFeaturesData"
      @input="onSelectedFeaturesDataChange"
      :headers="tableHeaders"
      :items="selectedFeaturesData"
      :item-key="adminLayers[adminLayerType].dataId"
      :show-select="true"
      :height="tableHeight"
      :fixed-header="true"
      hide-default-footer
    >
      <template v-slot:[`item.AnzFlur`]="{item}">
        <span v-if="item.AnzFlur !== undefined">
          {{ formatNumber(Math.round(item.AnzFlur)) }}
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <template v-slot:[`item.mittlFlur`]="{item}">
        <span v-if="item.mittlFlur !== undefined">
          {{ formatNumber(Math.round(item.mittlFlur)) }}&nbsp;m²
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <template v-slot:[`item.BGF`]="{item}">
        <span v-if="item.BGF !== undefined">
          {{ formatNumber(Math.round(item.BGF)) }}&nbsp;m²
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <template v-slot:[`item.tatNu_WB_P`]="{item}">
        <span v-if="item.tatNu_WB_P !== undefined">
          {{ formatNumber(item.tatNu_WB_P) }}&nbsp;%
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <template v-slot:[`item.Bev_311220`]="{item}">
        <span v-if="item.Bev_311220 !== undefined">
          {{ formatNumber(Math.round(item.Bev_311220)) }}
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <template v-slot:[`item.SP_GebWB15`]="{item}">
        <span v-if="item.SP_GebWB15 !== undefined">
          {{ formatNumber(item.SP_GebWB15) }}&nbsp;MWh/a
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <template v-slot:[`item.Soz_Status`]="{item}">
        <span v-if="item.Soz_Status !== undefined">{{ item.Soz_Status }}</span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>

      <template v-slot:[`body.append`]>
        <AggregatedValues :tableHeaders="tableHeaders" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapMutations} from 'vuex';

import {AdminLayerFeatureData, AdminLayerType} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {formatNumber} from '@/libs/format';
import {adminLayers} from '@/constants/admin-layers';
import {DataTableHeader} from 'vuetify';

import AggregatedValues from './energy-potential-aggregated-values.vue';

interface Data {
  adminLayers: typeof adminLayers;
  tableHeight: number;
}

export default Vue.extend({
  components: {
    AggregatedValues
  },
  data(): Data {
    return {
      adminLayers,
      tableHeight: 0
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'adminLayerData'
    ]),
    tableHeaders(): Array<DataTableHeader> {
      return [
        {
          text: this.adminLayerType
            ? this.$t(`adminLayer.${this.adminLayerType}`)
            : '',
          sortable: true,
          value: this.adminLayerType
            ? adminLayers[this.adminLayerType].dataId
            : ''
        },
        {
          text: this.$t('parcels'),
          sortable: true,
          value: 'AnzFlur'
        },
        {
          text: this.$t('meanParcelSize'),
          sortable: true,
          value: 'mittlFlur'
        },
        {text: this.$t('grossFloorArea'), sortable: true, value: 'BGF'},
        {
          text: this.$t('residentialBuildingArea'),
          sortable: true,
          value: 'tatNu_WB_P'
        },
        {
          text: this.$t('population'),
          sortable: true,
          value: 'Bev_311220'
        },
        {
          text: this.$t('solarPotential'),
          sortable: true,
          value: 'SP_GebWB15'
        }
      ].concat(
        this.adminLayerType === AdminLayerType.STATISTICAL_AREA
          ? [
              {
                text: this.$t('socialStatus'),
                sortable: true,
                value: 'Soz_Status'
              }
            ]
          : []
      );
    },
    selectedFeaturesData(): Array<AdminLayerFeatureData> {
      if (!this.adminLayerType) {
        return [];
      }

      const {data, dataId} = adminLayers[this.adminLayerType];

      if (!data || !dataId) {
        return [];
      }

      return data.filter((featureData: AdminLayerFeatureData) => {
        const selectedFeatureIds =
          (this.adminLayerType &&
            this.adminLayerData[this.adminLayerType]?.selectedFeatureIds) ||
          [];

        return selectedFeatureIds.some(
          (featureId: string) => featureId === String(featureData[dataId])
        );
      });
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setSelectedFeatureIds'
    ]),
    formatNumber(
      ...args: Parameters<typeof formatNumber>
    ): ReturnType<typeof formatNumber> {
      return formatNumber(...args);
    },
    onResize() {
      const container = this.$refs.tableContainer as Element;
      this.tableHeight = container?.getBoundingClientRect().height || 0;
    },
    onSelectedFeaturesDataChange(
      newSelectedFeaturesData: Array<AdminLayerFeatureData>
    ) {
      if (!this.adminLayerType) {
        return;
      }

      const {dataId} = adminLayers[this.adminLayerType];
      const featureIds =
        this.adminLayerData[this.adminLayerType]?.selectedFeatureIds || [];

      this.setSelectedFeatureIds({
        adminLayerType: this.adminLayerType,
        featureIds: featureIds.filter((featureId: string) =>
          newSelectedFeaturesData
            .map(data => String(data[dataId]))
            .includes(featureId)
        )
      });
    }
  }
});
</script>

<style scoped>
.inspector-table-container {
  height: 100%;
  overflow-x: auto;
}
</style>
