<template>
  <div class="potential-chart-wrapper">
    <v-card class="potential-chart-card">
      <v-card-title class="potential-chart-title">
        {{ chartTitle }}

        <v-btn text icon @click="closeChart">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text ref="chartContainer" v-resize="onResize">
        <apexchart
          type="bar"
          :width="chartsWidth"
          :height="300"
          :options="chartOptions"
          :series="[{data: chartData}]"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapGetters, mapState} from 'vuex';

import {AdminLayerFeatureData} from '@/types/admin-layers';
import {MapGettersToComputed, MapStateToComputed} from '@/types/store';

import {formatPotentialValue} from '@/libs/format';

import {adminLayers} from '@/constants/admin-layers';

interface Data {
  chartsWidth: number;
}

export default Vue.extend({
  data(): Data {
    return {
      chartsWidth: 0
    };
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
    chartTitle() {
      const chartProperty = this.$route.query.chartProperty as string;
      const chartPropertyTranslations =
        this.potentialConfig?.table.columns.translations[chartProperty];
      const locale = this.$i18n.locale;
      const translatedChartProperty =
        chartPropertyTranslations && chartPropertyTranslations[locale];

      return translatedChartProperty || chartProperty;
    },
    chartOptions(): Record<string, unknown> {
      const chartProperty = this.$route.query.chartProperty as string;

      return {
        chart: {
          type: 'bar',
          toolbar: {show: false}
        },
        plotOptions: {
          bar: {
            distributed: true,
            dataLabels: {position: 'bottom'}
          }
        },
        dataLabels: {enabled: false},
        legend: {show: false},
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          show: true,
          categories: this.currentLayerSelectedFeatureIds
        },
        yaxis: {
          show: true,
          decimalsInFloat: 0
        },
        tooltip: {
          y: {
            formatter: (value: string | number | undefined) => {
              const formattedValue = formatPotentialValue(chartProperty, value);
              return formattedValue !== undefined
                ? formattedValue
                : this.$t('notAvailable');
            },
            title: {formatter: () => ''}
          }
        }
      };
    },
    chartData(): Array<{x: string; y: string | number | undefined}> {
      if (!this.adminLayerType || !this.$route.query.chartProperty) {
        return [];
      }

      const {dataId: adminLayerDataId} = adminLayers[this.adminLayerType];
      const data = this.adminLayerData[this.adminLayerType];

      if (!data || !adminLayerDataId) {
        return [];
      }

      const chartProperty = this.$route.query.chartProperty as string;

      return data
        .filter((featureData: AdminLayerFeatureData) =>
          this.currentLayerSelectedFeatureIds.some(
            (featureId: string) =>
              featureId === String(featureData[adminLayerDataId])
          )
        )
        .map((featureData: AdminLayerFeatureData) => ({
          x: String(featureData[adminLayerDataId]),
          y: featureData[chartProperty]
        }));
    }
  },
  watch: {
    chartData: {
      handler: function (
        newChartData: Array<{x: string; y: string | number | undefined}>
      ) {
        // Close chart if no data is available for the selected chart property
        if (!newChartData.map(({y}) => y).filter(Boolean).length) {
          this.closeChart();
        }
      },
      immediate: true
    }
  },
  methods: {
    onResize() {
      const container = this.$refs.chartContainer as Element;
      const panelElement = container?.closest('.v-card__text');
      const containerWidth =
        (panelElement?.getBoundingClientRect().width || 32) - 32;
      this.chartsWidth = Math.max(200, containerWidth);
    },
    closeChart() {
      this.$router.push({path: this.$route.path, query: {}});
    }
  }
});
</script>

<style scoped>
.potential-chart-wrapper {
  display: grid;
  grid-area: left;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.3);
}

.potential-chart-card {
  grid-template-rows: auto 1fr;
  width: calc(100% - 1rem);
  height: calc(100% - 1rem);
  margin: 0.5rem;
  overflow-x: auto;
}

.potential-chart-title {
  display: grid;
  grid-template-columns: 1fr auto;
}
</style>
