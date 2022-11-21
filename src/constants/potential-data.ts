import {AdminLayerFeatureData} from '@/types/admin-layers';

export const potentialDataUnits = {
  Ausl_P: '%',
  BB_Netto_A: 'm²',
  Bev_Mig_P: '%',
  BGF_WB: 'm²',
  BGF: 'm²',
  Geb_GRF_A: 'm²',
  Geb_GRF_P: '%',
  Geb_GRFWB: 'm²',
  Haush_K_P: '%',
  kwh_alleHh: 'kWh',
  kwh_perHh: 'kWh',
  LGB_Fl_A: 'm²',
  LGB_Geb_A: 'm²',
  LGB_Geb_P: '%',
  LGB_P: '%',
  mittlFlur: 'm²',
  mwh_alleHh: 'MWh',
  Nutzfl_WK: 'm²',
  Nutzfl_WK1: 'm²',
  NW_abs_dif: 'kWh/a',
  NW_abs_san: 'kWh/a',
  NW_abs_un: 'kWh/a',
  NW_absdiff: 'kWh/a',
  NW_diff_P: '%',
  PV_Geb_all: '%',
  PVersWBP15: '%',
  SGB_1565_P: '%',
  Shape_Area: 'm²',
  Shape_Leng: 'm',
  SozialWh_P: '%',
  SP_Geb_all: 'MWh/a',
  SP_GebWB15: 'MWh/a',
  SP_perEW15: 'MWh/a',
  SP_perHh15: 'MWh/a',
  spezWBd_di: 'kWh/m²',
  spezWBd_dP: '%',
  spezWBd_sa: 'kWh/m²',
  spezWBd_un: 'kWh/m²',
  Strom_WB: 'MWh',
  tatNu_FP_P: '%',
  tatNu_GesP: '%',
  tatNu_GM_P: '%',
  tatNu_IG_P: '%',
  tatNu_WB_P: '%',
  U18_P: '%',
  Ü65_P: '%',
  WBd_Wfl_di: 'kWh',
  WBd_Wfl_sa: 'kWh/a',
  WBd_Wfl_un: 'kWh/a',
  Wfl_aggr: 'm²',
  Wohnfl_WK: 'm²'
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
