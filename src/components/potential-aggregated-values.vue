<template>
  <tr v-if="aggregatedValues">
    <td v-if="showSelect" />
    <template v-for="(header, index) in tableHeaders">
      <td v-if="index === 0" :key="header.value">{{ $t('total') }}</td>

      <td
        v-else-if="potentialDataWithAggregationFunction.includes(header.value)"
        :key="header.value"
      >
        <span v-if="isNaN(aggregatedValues[header.value])">?</span>
        <span v-else
          >{{ formatNumber(Math.round(aggregatedValues[header.value]))
          }}<template v-if="potentialDataUnits[header.value]"
            >&nbsp;{{ potentialDataUnits[header.value] }}
          </template>
        </span>
      </td>

      <td v-else :key="header.value" />
    </template>
  </tr>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapGetters, mapState} from 'vuex';
import {DataTableHeader} from 'vuetify';

import {MapGettersToComputed, MapStateToComputed} from '@/types/store';
import {AdminLayerType} from '@/types/admin-layers';
import {
  potentialDataUnits,
  potentialDataWithAggregationFunction
} from '@/constants/potential-data';
import {aggregateValues} from '@/libs/potential-data-aggregation';
import {formatNumber} from '@/libs/format';

interface Data {
  potentialDataUnits: Record<string, string>;
  potentialDataWithAggregationFunction: Array<string>;
}

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
  data(): Data {
    return {
      potentialDataUnits,
      potentialDataWithAggregationFunction
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'selectedFeatureIds'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ]),
    aggregatedValues(): Record<string, number> | null {
      if (
        !this.adminLayerType ||
        this.adminLayerType === AdminLayerType.CITY ||
        !this.currentLayerSelectedFeatureIds.length
      ) {
        return null;
      }

      return aggregateValues(
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
