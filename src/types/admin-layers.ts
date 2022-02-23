export enum AdminLayerType {
  Stadt = 'Stadt',
  Bezirk = 'Bezirk',
  Stadtteil = 'Stadtteil',
  StatGebiet = 'StatGebiet',
  Baublock = 'Baublock'
}

export interface AdminLayerFeatureData extends Record<string, string | number> {
  Shape_Area: number;
  AnzFl: number;
  mittlFl: number;
  BGF: number;
  tatNu_WB_P: number;
  Bev_311219: number;
  p_st_mwh_a: number;
}

export interface FeaturesDataKeys {
  featureId: string;
  featureName: string;
}

export type AreasFeaturesDataKeys = Record<
  AdminLayerType,
  Array<FeaturesDataKeys>
>;
