<template>
  <tr v-if="aggregation" class="aggregation">
    <td />
    <template v-for="header in tableHeaders">
      <td v-if="header.value === 'AnzFlur'" :key="header.value">
        {{ formatNumber(aggregation.AnzFlur) }}
      </td>
      <td v-else-if="header.value === 'mittlFlur'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.mittlFlur)) }}&nbsp;m²
      </td>
      <td v-else-if="header.value === 'BGF'" :key="header.value">
        {{ formatNumber(Math.round(aggregation.BGF)) }}&nbsp;m²
      </td>
      <td v-else-if="header.value === 'tatNu_WB_P'" :key="header.value">
        {{
          formatNumber(Math.round(aggregation.tatNu_WB_P * 100) / 100)
        }}&nbsp;%
      </td>
      <td v-else-if="header.value === 'Bev_311220'" :key="header.value">
        {{ formatNumber(aggregation.Bev_311220) }}
      </td>
      <td v-else-if="header.value === 'SP_GebWB15'" :key="header.value">
        <span v-if="isNaN(aggregation.SP_GebWB15)">?</span>
        <span v-else>
          {{ formatNumber(Math.round(aggregation.SP_GebWB15)) }}&nbsp;MWh/a
        </span>
      </td>
      <td v-else :key="header.value" />
    </template>
  </tr>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapState} from 'vuex';

import {MapStateToComputed} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';
import {calculateAggregateValues} from '@/libs/admin-layers';
import {formatNumber} from '@/libs/format';
import {DataTableHeader} from 'vuetify';

export default Vue.extend({
  props: {
    tableHeaders: {
      type: Array as PropType<Array<DataTableHeader>>,
      required: true
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'adminLayerData'
    ]),
    aggregation(): Record<string, number> | null {
      if (
        !this.adminLayerType ||
        this.adminLayerType === AdminLayerType.CITY ||
        !this.adminLayerData[this.adminLayerType]?.selectedFeatureDataKeys
          ?.length
      ) {
        return null;
      }

      return calculateAggregateValues(
        this.adminLayerType,
        this.adminLayerData[this.adminLayerType]?.selectedFeatureDataKeys
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

<style scoped>
.aggregation {
  position: sticky;
  bottom: 0;
  z-index: 2;
  background: #fff;
  box-shadow: 0 -1px 0 rgb(0, 0, 0, 0.12);
  font-weight: 500;
}
</style>
