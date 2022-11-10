import {AdminLayerFeatureData} from '@/types/admin-layers';

export const potentialDataUnits = {
  mittlFlur: 'm²',
  BGF: 'm²',
  tatNu_WB_P: '%',
  Wohnfl_WK: 'm²',
  SP_GebWB15: 'MWh/a',
  NW_absdiff: 'MWh/a',
  spezWBd_dP: '%'
};

// Aggregation functions
const sum =
  (key: string) =>
  (
    aggregation: Record<string, number>,
    currentValue: AdminLayerFeatureData
  ): number =>
    aggregation[key] + (Number(currentValue[key]) || 0);

const weightedSum =
  (key: string, weightKey: string) =>
  (
    aggregation: Record<string, number>,
    currentValue: AdminLayerFeatureData
  ): number =>
    aggregation[key] +
    Number(currentValue[key] || 0) * Number(currentValue[weightKey] || 0);

const weightedArithmeticMean =
  (key: string, weightKey: string) =>
  (aggregation: Record<string, number>): number =>
    aggregation[key] / aggregation[weightKey];

export const potentialDataAggregationSteps: Record<
  string,
  {
    iterable: (
      aggregation: Record<string, number>,
      currentValue: AdminLayerFeatureData
    ) => number;
    final?: (aggregation: Record<string, number>) => number;
  }
> = {
  Shape_Area: {iterable: sum('Shape_Area')},
  AnzFlur: {iterable: sum('AnzFlur')},
  mittlFlur: {
    iterable: weightedSum('mittlFlur', 'AnzFlur'),
    final: weightedArithmeticMean('mittlFlur', 'AnzFlur')
  },
  BGF: {iterable: sum('BGF')},
  tatNu_WB_P: {
    iterable: weightedSum('tatNu_WB_P', 'Shape_Area'),
    final: weightedArithmeticMean('tatNu_WB_P', 'Shape_Area')
  },
  Wohnfl_WK: {iterable: sum('Wohnfl_WK')},
  Haush: {iterable: sum('Haush')},
  Bev_311220: {iterable: sum('Bev_311220')},
  SP_GebWB15: {iterable: sum('SP_GebWB15')},
  NW_absdiff: {iterable: sum('NW_absdiff')},
  spezWBd_dP: {
    iterable: weightedSum('spezWBd_dP', 'Shape_Area'),
    final: weightedArithmeticMean('spezWBd_dP', 'Shape_Area')
  }
};

export const potentialDataWithAggregationFunction = Object.keys(
  potentialDataAggregationSteps
);
