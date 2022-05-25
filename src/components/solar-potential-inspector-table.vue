<template>
  <div class="wrapper" v-if="adminLayerType">
    <v-select
      class="inspector-column-select"
      v-model="selectedTableHeaders"
      :items="tableHeaders.slice(1)"
      :label="$t('selectColumns')"
      multiple
      return-object
      hide-details
    >
      <template v-slot:selection="{item, index}">
        <v-chip v-if="index === 0">
          <span>{{ item.text }}</span>
        </v-chip>
        <span
          v-if="index === 1 && selectedTableHeaders.length > 1"
          class="grey--text caption"
          >{{ $t('others', {count: selectedTableHeaders.length - 1}) }}</span
        >
      </template>
    </v-select>

    <div
      class="potential-table-container"
      ref="tableContainer"
      v-resize="onResize"
    >
      <v-data-table
        class="potential-table"
        :class="{
          selectable: showAggregationOnly ? false : showSelected
        }"
        :value="selectedFeaturesData"
        @input="onSelectedFeaturesDataChange"
        :headers="shownTableHeaders"
        :items="selectedFeaturesData"
        :item-key="adminLayers[adminLayerType].dataId"
        :show-select="showAggregationOnly ? false : showSelected"
        :height="tableHeight"
        :fixed-header="true"
        hide-default-footer
      >
        <template
          v-for="(header, index) in shownTableHeaders"
          v-slot:[`item.${header.value}`]="{item}"
        >
          <slot v-if="index === 0" :name="[`item.Bezirk`]" :item="item">
            {{ item.Bezirk }}
          </slot>
          <slot v-else :name="[`item.${header.value}`]" :item="item">
            <span
              v-if="item[header.value] !== undefined"
              v-bind:key="header.value"
            >
              <span v-if="header.value === 'mittlFlur'">
                {{ formatNumber(Math.round(item[header.value])) }}&nbsp;m²</span
              >
              <span v-else-if="header.value === 'BGF'">
                {{ formatNumber(Math.round(item[header.value])) }}&nbsp;m²</span
              >
              <span v-else-if="header.value === 'tatNu_WB_P'">
                {{ formatNumber(item[header.value]) }}&nbsp;%</span
              >
              <span v-else-if="header.value === 'SP_GebWB15'">
                {{ formatNumber(item[header.value]) }}&nbsp;MWh/a</span
              >
              <span v-else-if="isNaN(item[header.value])">
                {{ item[header.value] }}</span
              >
              <span v-else>
                {{ formatNumber(Math.round(item[header.value])) }}</span
              >
            </span>
            <span v-else v-bind:key="header.value">{{
              $t('notAvailable')
            }}</span>
          </slot>
        </template>

        <template v-slot:[`body.append`] v-if="!showAggregationOnly">
          <AggregatedValues
            :tableHeaders="shownTableHeaders"
            :showSelect="showSelected"
          />
        </template>

        <template v-slot:[`body`] v-else>
          <tbody>
            <AggregatedValues
              :tableHeaders="shownTableHeaders"
              :showSelect="false"
            />
          </tbody>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapMutations, mapGetters} from 'vuex';

import {AdminLayerFeatureData} from '@/types/admin-layers';
import {
  MapGettersToComputed,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';
import {formatNumber} from '@/libs/format';
import {adminLayers} from '@/constants/admin-layers';
import {DataTableHeader} from 'vuetify';

import AggregatedValues from './solar-potential-aggregated-values.vue';

interface Data {
  adminLayers: typeof adminLayers;
  tableHeight: number;
  selectedTableHeaders: Array<DataTableHeader>;
}

export default Vue.extend({
  components: {
    AggregatedValues
  },
  props: {
    showAggregationOnly: {
      type: Boolean,
      required: false
    },
    showSelected: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data(): Data {
    return {
      adminLayers,
      tableHeight: 0,
      selectedTableHeaders: []
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'potentialConfig'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
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
        ...Object.keys(this.potentialConfig?.table.columns || {}).map(key => {
          return {
            // TODO: choose translation by language setting
            text:
              this.potentialConfig?.table.columns[key].translations?.en || key,
            sortable: true,
            value: key
          };
        })
      ];
    },
    shownTableHeaders(): Array<DataTableHeader> {
      return [this.tableHeaders[0], ...this.selectedTableHeaders];
    },
    selectedFeaturesData(): Array<AdminLayerFeatureData> {
      if (!this.adminLayerType) {
        return [];
      }

      const {data, dataId} = adminLayers[this.adminLayerType];

      if (!data || !dataId) {
        return [];
      }

      const selectedFeatures = data.filter(
        (featureData: AdminLayerFeatureData) => {
          return this.currentLayerSelectedFeatureIds.some(
            (featureId: string) => featureId === String(featureData[dataId])
          );
        }
      );

      return selectedFeatures;
    }
  },
  watch: {
    tableHeaders(newTableHeaders: Array<DataTableHeader>) {
      this.selectedTableHeaders = newTableHeaders
        .slice(1)
        .filter(
          header =>
            this.potentialConfig?.table.columns[header.value].selected === true
        );
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setSelectedFeatureIdsOfAdminLayer'
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

      this.setSelectedFeatureIdsOfAdminLayer({
        adminLayerType: this.adminLayerType,
        featureIds: this.currentLayerSelectedFeatureIds.filter(
          (featureId: string) =>
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
.wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  overflow-x: auto;
}

.potential-table-container {
  overflow-x: auto;
}

.inspector-column-select {
  width: 18.75rem;
  margin-bottom: 1rem;
}
</style>
