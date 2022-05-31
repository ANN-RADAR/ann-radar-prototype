<template>
  <tr v-if="aggregation">
    <td v-if="showSelect" />
    <template v-for="(header, index) in tableHeaders">
      <td v-if="index === 0" :key="header.value">{{ $t('total') }}</td>
      <td v-else-if="header.value === 'AnzFlur'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.AnzFlur)) }}
      </td>
      <td v-else-if="header.value === 'mittlFlur'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.mittlFlur)) }}&nbsp;m²
      </td>
      <td v-else-if="header.value === 'BGF'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.BGF)) }}&nbsp;m²
      </td>
      <td v-else-if="header.value === 'tatNu_WB_P'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.tatNu_WB_P)) }}&nbsp;%
      </td>
      <td v-else-if="header.value === 'Wohnfl_WK'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.Wohnfl_WK)) }}&nbsp;m²
      </td>
      <td v-else-if="header.value === 'Haush'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.Haush)) }}
      </td>
      <td v-else-if="header.value === 'Bev_311220'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.Bev_311220)) }}
      </td>
      <td v-else-if="header.value === 'SP_GebWB15'" :key="header.value">
        <span v-if="isNaN(aggregation.SP_GebWB15)">?</span>
        <span v-else>
          {{ formatNumber(Math.round(aggregation.SP_GebWB15)) }}&nbsp;MWh/a
        </span>
      </td>
      <td v-else-if="header.value === 'NW_absdiff'" :key="header.value">
        <span v-if="isNaN(aggregation.NW_absdiff)">?</span>
        <span v-else>
          {{ formatNumber(Math.round(aggregation.NW_absdiff)) }}&nbsp;MWh/a
        </span>
      </td>
      <td v-else-if="header.value === 'spezWBd_dP'" :key="header.value">
        <span v-if="isNaN(aggregation.spezWBd_dP)">?</span>
        <span v-else>
          {{ formatNumber(Math.round(aggregation.spezWBd_dP)) }}&nbsp;%
        </span>
      </td>
      <td v-else :key="header.value" />
    </template>
  </tr>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapGetters, mapState} from 'vuex';

import {MapGettersToComputed, MapStateToComputed} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';
import {calculateAggregateValues} from '@/libs/admin-layers';
import {formatNumber} from '@/libs/format';
import {DataTableHeader} from 'vuetify';

export default Vue.extend({
  props: {
    tableHeaders: {
      type: Array as PropType<Array<DataTableHeader>>,
      required: true
    },
    showSelect: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'selectedFeatureIds'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ]),
    aggregation(): Record<string, number> | null {
      if (
        !this.adminLayerType ||
        this.adminLayerType === AdminLayerType.CITY ||
        !this.currentLayerSelectedFeatureIds.length
      ) {
        return null;
      }

      return calculateAggregateValues(
        this.adminLayerType,
        this.currentLayerSelectedFeatureIds
      );
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
