<template>
  <v-container class="table-container" ref="tableContainer">
    <v-data-table
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
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.AnzFl="{item}">
        <span v-if="item.AnzFl !== undefined">
          {{ formatNumber(Math.round(item.AnzFl)) }}
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.mittlFl="{item}">
        <span v-if="item.mittlFl !== undefined">
          {{ formatNumber(Math.round(item.mittlFl)) }}&nbsp;m²
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.BGF="{item}">
        <span v-if="item.BGF !== undefined">
          {{ formatNumber(Math.round(item.BGF)) }}&nbsp;m²
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.tatNu_WB_P="{item}">
        <span v-if="item.tatNu_WB_P !== undefined">
          {{ formatNumber(item.tatNu_WB_P) }}&nbsp;%
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.Bev_311219="{item}">
        <span v-if="item.Bev_311219 !== undefined">
          {{ formatNumber(Math.round(item.Bev_311219)) }}
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.p_st_mwh_a="{item}">
        <span v-if="item.p_st_mwh_a !== undefined">
          {{ formatNumber(item.p_st_mwh_a) }}&nbsp;MWh/a
        </span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.Soz_Status="{item}">
        <span v-if="item.Soz_Status !== undefined">{{ item.Soz_Status }}</span>
        <span v-else>{{ $t('notAvailable') }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapState, mapMutations} from 'vuex';

import {AdminLayerFeatureData, FeaturesDataKeys} from '@/types/admin-layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {formatNumber} from '@/libs/format';
import {adminLayers} from '@/constants/admin-layers';
import {DataTableHeader} from 'vuetify';

interface Data {
  adminLayers: typeof adminLayers;
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
      adminLayers
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'selectedFeatureDataKeys'
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
          value: 'AnzFl'
        },
        {
          text: this.$t('meanParcelSize'),
          sortable: true,
          value: 'mittlFl'
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
          value: 'Bev_311219'
        },
        {
          text: this.$t('solarPotential'),
          sortable: true,
          value: 'p_st_mwh_a'
        }
      ].concat(
        this.adminLayerType === 'StatGebiet'
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
        const selectedFeatureDataKeys =
          (this.adminLayerType &&
            this.selectedFeatureDataKeys[this.adminLayerType]) ||
          [];

        return selectedFeatureDataKeys.some(
          (keys: {featureId: string; featureName: string}) =>
            keys.featureName === String(featureData[dataId])
        );
      });
    },
    tableHeight(): number {
      const container = this.$refs.tableContainer as Element;

      if (!container) {
        return 0;
      }

      return window.innerHeight - container.getBoundingClientRect().y;
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setSelectedFeatureDataKeys'
    ]),
    formatNumber(
      ...args: Parameters<typeof formatNumber>
    ): ReturnType<typeof formatNumber> {
      return formatNumber(...args);
    },
    onSelectedFeaturesDataChange(
      newSelectedFeaturesData: Array<AdminLayerFeatureData>
    ) {
      if (!this.adminLayerType) {
        return;
      }

      const {dataId} = adminLayers[this.adminLayerType];
      const keys = this.selectedFeatureDataKeys[this.adminLayerType] || [];

      this.setSelectedFeatureDataKeys({
        layerType: this.adminLayerType,
        keys: keys.filter((featureDataKeys: FeaturesDataKeys) =>
          newSelectedFeaturesData
            .map(data => String(data[dataId]))
            .includes(featureDataKeys.featureName)
        )
      });
    }
  }
});
</script>
