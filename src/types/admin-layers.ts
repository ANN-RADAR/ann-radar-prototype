export enum AdminLayerType {
  CITY = 'city',
  DISTRICT = 'district',
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
  Wohnfl_WK: number; // Wohnfläche Wärmekataster
  Haush: number; // Zahl der Haushalte
  Bev_311220: number; // Gesamtbevölkerung, Stand 31.12.2020
  SP_GebWB15: number; // Summiertes Solarpotential in mwh_a
  NW_absdiff: number; // Differenz Nutzwärmebedarf absolut Wohnflächen in kwh_a unsaniert/saniert
  spezWBd_dP: number; // Sanierungspotential Wärmebedarf der Wohngebäude in Prozent
}
