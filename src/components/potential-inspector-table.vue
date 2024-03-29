<template>
  <div class="potential-wrapper">
    <v-card-title>
      {{ $t(`navigation.${category}`) }}
    </v-card-title>
    <v-card-text>
      <div class="potential-wrapper" v-if="adminLayerType">
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
              >{{
                $t('others', {count: selectedTableHeaders.length - 1})
              }}</span
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
            :headers="shownTableHeaders"
            :items="selectedFeaturesData"
            :item-key="adminLayers[adminLayerType].dataId"
            :show-select="showAggregationOnly ? false : showSelected"
            :height="tableHeight"
            :fixed-header="true"
            @update:sort-by="onSortByChange"
            @update:sort-desc="onSortOrderChange"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`header.data-table-select`]>
              <v-btn
                text
                icon
                :disabled="!selectedFeaturesData.length"
                @click="onDeselectAllFeatures"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>

            <template
              v-for="(tableHeader, index) in shownTableHeaders"
              v-slot:[`header.${tableHeader.value}`]="{header}"
            >
              {{ header.text }}
              <v-btn
                v-if="index !== 0"
                :class="{
                  'chart-button': true,
                  active: $route.query.chartProperty === tableHeader.value
                }"
                text
                icon
                :disabled="barChartDisabled"
                :color="
                  $route.query.chartProperty === tableHeader.value
                    ? 'primary'
                    : undefined
                "
                @click.stop="openBarChart(tableHeader.value)"
                v-bind:key="`${tableHeader.value}-chart`"
              >
                <v-icon>mdi-chart-bar</v-icon>
              </v-btn>
            </template>

            <template v-slot:[`item.data-table-select`]="{item}">
              <v-btn
                text
                icon
                @click="
                  onDeselectFeature(String(item[shownTableHeaders[0].value]))
                "
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>

            <template
              v-for="header in shownTableHeaders"
              v-slot:[`item.${header.value}`]="{item}"
            >
              <slot :name="[`item.${header.value}`]" :item="item">
                <span v-bind:key="header.value">
                  {{
                    getFormattedPotentialValue(header.value, item[header.value])
                  }}
                </span>
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
    </v-card-text>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex';

import {AdminLayerFeatureData, AdminLayerType} from '@/types/admin-layers';
import {
  MapActionsToMethods,
  MapGettersToComputed,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';
import {formatPotentialValue} from '@/libs/format';
import {adminLayers} from '@/constants/admin-layers';
import {DataTableHeader} from 'vuetify';

import AggregatedValues from './potential-aggregated-values.vue';

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
    category: {
      type: String as PropType<'solar' | 'energyEfficiency' | 'mobility'>,
      required: true
    },
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
  created() {
    this.fetchPotentialConfig();
    this.setSelectedTableHeaders(this.tableHeaders);
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerData',
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
        ...Object.keys(
          this.potentialConfig?.table.columns.translations || {}
        ).map(key => {
          const locale = this.$i18n.locale;
          return {
            text:
              this.potentialConfig?.table.columns.translations[key][locale] ||
              key,
            sortable: true,
            value: key
          };
        })
      ];
    },
    shownTableHeaders(): Array<DataTableHeader> {
      const headers = [this.tableHeaders[0], ...this.selectedTableHeaders];

      // Show `Soz_Status` only if the admin layer is statistical area
      if (this.adminLayerType !== AdminLayerType.STATISTICAL_AREA) {
        return headers.filter(({value}) => value !== 'Soz_Status');
      }

      return headers;
    },
    selectedFeaturesData(): Array<AdminLayerFeatureData> {
      if (!this.adminLayerType) {
        return [];
      }

      const {dataId} = adminLayers[this.adminLayerType];
      const data = this.adminLayerData[this.adminLayerType];

      if (!data || !dataId) {
        return [];
      }

      return data.filter((featureData: AdminLayerFeatureData) => {
        return this.currentLayerSelectedFeatureIds.some(
          (featureId: string) => featureId === String(featureData[dataId])
        );
      });
    },
    barChartDisabled(): boolean {
      return !this.currentLayerSelectedFeatureIds.length;
    }
  },
  watch: {
    tableHeaders(newTableHeaders: Array<DataTableHeader>) {
      this.setSelectedTableHeaders(newTableHeaders);
    },
    category() {
      this.setSelectedTableHeaders(this.tableHeaders);
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchPotentialConfig']),
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setSelectedFeatureIdsOfAdminLayer',
      'setPotentialSorting'
    ]),
    onResize() {
      const container = this.$refs.tableContainer as Element;
      this.tableHeight = container?.getBoundingClientRect().height || 0;
    },
    onDeselectFeature(featureIdToRemove: string) {
      if (!this.adminLayerType) {
        return;
      }

      this.setSelectedFeatureIdsOfAdminLayer({
        adminLayerType: this.adminLayerType,
        featureIds: this.currentLayerSelectedFeatureIds.filter(
          (featureId: string) => featureId !== featureIdToRemove
        )
      });
    },
    onDeselectAllFeatures() {
      if (!this.adminLayerType) {
        return;
      }

      this.setSelectedFeatureIdsOfAdminLayer({
        adminLayerType: this.adminLayerType,
        featureIds: []
      });
    },
    setSelectedTableHeaders(tableHeaders: Array<DataTableHeader>) {
      this.selectedTableHeaders = tableHeaders
        .slice(1)
        .filter(header =>
          this.potentialConfig?.table.columns.selected[this.category].includes(
            header.value
          )
        );
    },
    getFormattedPotentialValue(
      key: string,
      value: string | number | undefined
    ) {
      const formattedValue = formatPotentialValue(key, value);
      return formattedValue !== undefined
        ? formattedValue
        : this.$t('notAvailable');
    },
    openBarChart(chartProperty: string) {
      this.$router.push({path: this.$route.path, query: {chartProperty}});
    },
    onSortByChange(sortBy: string | Array<string>) {
      const newSortBy = Array.isArray(sortBy) ? sortBy[0] : sortBy;
      this.setPotentialSorting({sortBy: newSortBy || null});
    },
    onSortOrderChange(sortDesc: boolean | Array<boolean>) {
      const newSortDesc = Array.isArray(sortDesc) ? sortDesc[0] : sortDesc;
      this.setPotentialSorting({sortDesc: newSortDesc ?? null});
    }
  }
});
</script>

<style scoped>
.potential-wrapper {
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

.potential-table-container
  >>> .v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  padding-right: 40px;
}

.chart-button {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  opacity: 0;
  color: rgba(0, 0, 0, 0.38);
}

.v-data-table-header th:hover .chart-button,
.chart-button.active {
  opacity: 1;
}
</style>
