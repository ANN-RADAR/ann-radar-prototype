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

const mean =
  (key: string) =>
  (
    aggregation: Record<string, number>,
    numberOfAggregatedValues: number
  ): number =>
    aggregation[key] / numberOfAggregatedValues;

const weightedSum =
  (key: string, weightKey: string, aggregationKey?: string) =>
  (
    aggregation: Record<string, number>,
    currentValue: AdminLayerFeatureData
  ): number =>
    aggregation[aggregationKey || key] +
    Number(currentValue[key] || 0) * Number(currentValue[weightKey] || 0);

const division =
  (dividendKey: string, divisorKey: string) =>
  (aggregation: Record<string, number>): number =>
    aggregation[dividendKey] / aggregation[divisorKey];

const percentage =
  (partKey: string, baseKey: string) =>
  (aggregation: Record<string, number>): number =>
    (aggregation[partKey] * 100) / aggregation[baseKey];

export const potentialDataAggregationSteps: Record<
  string,
  {
    iterable?: (
      aggregation: Record<string, number>,
      currentValue: AdminLayerFeatureData
    ) => number;
    final?: (
      aggregation: Record<string, number>,
      numberOfAggregatedValues: number
    ) => number;
  }
> = {
  Shape_Area: {iterable: sum('Shape_Area')},
  BB_Netto_A: {iterable: sum('BB_Netto_A')},
  AnzFlur: {iterable: sum('AnzFlur')},
  mittlFlur: {
    iterable: (
      aggregation: Record<string, number>,
      currentValue: AdminLayerFeatureData
    ): number =>
      aggregation['mittlFlur'] + (Number(currentValue['Shape_Area']) || 0),
    final: division('mittlFlur', 'AnzFlur')
  },
  Bev_311220: {iterable: sum('Bev_311220')},
  HaushGr: {iterable: sum('HaushGr'), final: mean('HaushGr')},
  Haush: {iterable: sum('Haush')},
  Haush_K: {iterable: sum('Haush_K')},
  Haush_K_P: {final: percentage('Haush_K', 'Haush')},
  tatNu_GesP: {
    iterable: weightedSum('tatNu_GesP', 'Shape_Area'),
    final: division('tatNu_GesP', 'Shape_Area')
  },
  tatNu_WB_P: {
    iterable: weightedSum('tatNu_WB_P', 'Shape_Area'),
    final: division('tatNu_WB_P', 'Shape_Area')
  },
  tatNu_IG_P: {
    iterable: weightedSum('tatNu_IG_P', 'Shape_Area'),
    final: division('tatNu_IG_P', 'Shape_Area')
  },
  tatNu_FP_P: {
    iterable: weightedSum('tatNu_FP_P', 'Shape_Area'),
    final: division('tatNu_FP_P', 'Shape_Area')
  },
  tatNu_GM_P: {
    iterable: weightedSum('tatNu_GM_P', 'Shape_Area'),
    final: division('tatNu_GM_P', 'Shape_Area')
  },
  Geb_GRF_A: {iterable: sum('Geb_GRF_A')},
  Geb_GRF_P: {final: percentage('Geb_GRF_A', 'Shape_Area')},
  Geb_Anz: {iterable: sum('Geb_Anz')},
  BGF: {iterable: sum('BGF')},
  BGF_WB: {iterable: sum('BGF_WB')},
  Nutzfl_WK1: {iterable: sum('Nutzfl_WK1')},
  Wohnfl_WK: {iterable: sum('Wohnfl_WK')},
  GFZ: {final: division('BGF', 'Shape_Area')},
  LGB_Fl_A: {iterable: sum('LGB_Fl_A')},
  LGB_P: {final: percentage('LGB_Fl_A', 'Shape_Area')},
  LGB_Anz_Fl: {iterable: sum('LGB_Anz_Fl')},
  LGB_Geb_A: {iterable: sum('LGB_Geb_A')},
  LGB_Geb_P: {final: percentage('LGB_Geb_A', 'LGB_Fl_A')},
  LGB_Anz_Ge: {iterable: sum('LGB_Anz_Ge')},
  kwh_perHh: {iterable: sum('kwh_perHh'), final: mean('kwh_perHh')},
  kwh_alleHh: {iterable: sum('kwh_alleHh')},
  mwh_alleHh: {iterable: sum('mwh_alleHh')},
  SP_GebWB15: {iterable: sum('SP_GebWB15')},
  SP_perHh15: {iterable: sum('SP_perHh15'), final: mean('SP_perHh15')},
  SP_perEW15: {iterable: sum('SP_perEW15'), final: mean('SP_perEW15')},
  PVersWBP15: {final: percentage('SP_GebWB15', 'mwh_alleHh')},
  Strom_WB: {iterable: sum('Strom_WB')},
  spezWBd_un: {iterable: sum('spezWBd_un')},
  spezWBd_sa: {iterable: sum('spezWBd_sa')},
  spezWBd_di: {iterable: sum('spezWBd_di'), final: mean('spezWBd_di')},
  NW_absdiff: {iterable: sum('NW_absdiff')},
  spezWBd_un_weighted: {
    iterable: weightedSum('spezWBd_un', 'Wohnfl_WK', 'spezWBd_un_weighted')
  },
  spezWBd_sa_weighted: {
    iterable: weightedSum('spezWBd_sa', 'Wohnfl_WK', 'spezWBd_sa_weighted')
  },
  spezWBd_dP: {
    final: (aggregation: Record<string, number>): number =>
      100 -
      percentage('spezWBd_sa_weighted', 'spezWBd_un_weighted')(aggregation)
  },
  U18: {iterable: sum('U18')},
  U18_P: {final: percentage('U18', 'Bev_311220')},
  Ü65: {iterable: sum('Ü65')},
  Ü65_P: {final: percentage('Ü65', 'Bev_311220')},
  Ausl: {iterable: sum('Ausl')},
  Ausl_P: {final: percentage('Ausl', 'Bev_311220')},
  Bev_Mig: {iterable: sum('Bev_Mig')},
  Bev_Mig_P: {final: percentage('Bev_Mig', 'Bev_311220')},
  SGBII_III: {iterable: sum('SGBII_III')},
  SGB_1565_P: {final: percentage('SGBII_III', 'Bev_311220')},
  Wohnungen: {iterable: sum('Wohnungen')},
  SozialWh: {iterable: sum('SozialWh')},
  SozialWh_P: {final: percentage('SozialWh', 'Wohnungen')}
};

export const potentialDataWithAggregationFunction = Object.keys(
  potentialDataAggregationSteps
);
