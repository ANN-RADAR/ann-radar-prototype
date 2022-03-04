export enum AdminLayerType {
  CITY = 'city',
  BOROUGH = 'borough',
  QUARTER = 'quarter',
  STATISTICAL_AREA = 'statisticalArea',
  BUILDING_BLOCK = 'buildingBlock'
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

export interface AdminLayerData {
  selectedFeatureDataKeys: Array<FeaturesDataKeys>;
  note: string;
}
