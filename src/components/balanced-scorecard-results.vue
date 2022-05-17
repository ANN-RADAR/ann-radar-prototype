<template>
  <div class="charts" ref="chartsContainer" v-resize="onResize">
    <apexchart
      v-for="scorecard in scorecards"
      :key="scorecard.type"
      type="bar"
      :width="chartsWidth"
      :height="scorecardMeasureIds[scorecard.type].length * 12 + 150"
      :options="{
        ...chartOptions,
        chart: {
          // @ts-ignore: Spread types may only be created from object types
          ...chartOptions.chart,
          id: `balanced-scorecard-results-${scorecard.type}`
        },
        yaxis: {
          // @ts-ignore: Spread types may only be created from object types
          ...chartOptions.yaxis,
          max: scorecardMeasureIds[scorecard.type].length,
          tickAmount: scorecardMeasureIds[scorecard.type].length
        },
        title: {
          // @ts-ignore: Spread types may only be created from object types
          ...chartOptions.title,
          text: scorecard.translation
        }
      }"
      :series="seriesByScorecardType[scorecard.type]"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapGetters, mapState} from 'vuex';

import {MapGettersToComputed, MapStateToComputed} from '@/types/store';
import {ScorecardMeasureId, ScorecardType} from '@/types/scorecards';

interface Data {
  chartsWidth: number;
  scorecards: Array<{type: ScorecardType; translation: string}>;
}

export default Vue.extend({
  data(): Data {
    return {
      chartsWidth: 0,
      scorecards: Object.values(ScorecardType).map(scorecardType => {
        const scorecardKey = scorecardType
          .split('-')
          .map((string, index) =>
            index > 0
              ? string.charAt(0).toUpperCase() + string.slice(1)
              : string
          )
          .join('');
        return {
          type: scorecardType,
          translation: this.$t(`navigation.${scorecardKey}`)
        };
      })
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'balancedScorecards',
      'balancedScorecardRatings'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ]),
    chartOptions(): Record<string, unknown> {
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
          decimalsInFloat: 0,
          min: 0
        },
        tooltip: {
          y: {title: {formatter: () => ''}}
        }
      };
    },
    scorecardMeasureIds(): Record<ScorecardType, Array<ScorecardMeasureId>> {
      return Object.values(ScorecardType).reduce(
        (allScorecardMeasures, scorecardType) => {
          const scorecardMeasures = this.balancedScorecards[
            scorecardType
          ].reduce(
            (measures, objective) => [
              ...measures,
              ...objective.measures.map(({id}) => id)
            ],
            [] as Array<ScorecardMeasureId>
          );

          return {...allScorecardMeasures, [scorecardType]: scorecardMeasures};
        },
        {} as Record<ScorecardType, Array<ScorecardMeasureId>>
      );
    },
    seriesByScorecardType(): Record<
      ScorecardType,
      Array<{data: Array<number>}>
    > {
      return Object.values(ScorecardType).reduce((series, scorecardType) => {
        const measureIds = this.scorecardMeasureIds[scorecardType];
        const ratings =
          (this.adminLayerType &&
            this.balancedScorecardRatings[scorecardType] &&
            this.balancedScorecardRatings[scorecardType][
              this.adminLayerType
            ]) ||
          {};
        const scorecardSeries = this.currentLayerSelectedFeatureIds.map(
          featureId =>
            measureIds.reduce(
              (data, measureId) =>
                ratings[featureId] && ratings[featureId][measureId]
                  ? data + 1
                  : data,
              0
            )
        );

        return {...series, [scorecardType]: [{data: scorecardSeries}]};
      }, {} as Record<ScorecardType, Array<{name: string; data: Array<number>}>>);
    }
  },
  methods: {
    onResize() {
      const container = this.$refs.chartsContainer as Element;
      const panelElement = container?.closest('.v-expansion-panel');
      const containerWidth =
        (panelElement?.getBoundingClientRect().width || 48) - 48;
      this.chartsWidth = Math.max(200, containerWidth);
    }
  }
});
</script>

<style scoped>
.charts {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
}
</style>
