export enum AdminLayerType {
  CITY = 'city',
  BOROUGH = 'borough',
  QUARTER = 'quarter',
  STATISTICAL_AREA = 'statisticalArea',
  BUILDING_BLOCK = 'buildingBlock'
}

export interface AdminLayerFeatureData
  extends Record<string, string | number | undefined> {
  Shape_Area: number; // Fläche in Quadratmeter
  AnzFlur: number; // Anzahl der Flurstücke
  mittlFlur: number; // Mittlere Flurstücksgröße
  BGF: number; // Summe Bruttogeschoßfläche aller Gebäude
  tatNu_WB_P: number; // Prozentualer Anteil Wohnbauflächen
  Bev_311220: number; // Gesamtbevölkerung, Stand 31.12.2020
  SP_GebWB15: number; // Summiertes Solarpotential in mwh_a
  Soz_Status?: string; // only for statistical areas – Wert Statusindex aus Sozialmonitoring 2020
}

export interface AdminLayerData {
  selectedFeatureIds: Array<string>;
  note: string;
}
