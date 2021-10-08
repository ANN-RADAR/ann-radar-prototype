import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class Baublock implements AdminLevelUnit {
  static featureIdProp = "baublockbezeichnung";
  static featureNameProp = "baublockbezeichnung";

  BBZ: string;        // Baublocknummer
  Shape_Area: number; // Fläche in QM
  Anz_Fl: number;     // Anzahl der Flurstücke im Baublock
  Bev_Ges: number;    // Mittlere Flurstücksgröße im Baublock
  tatNu_GesP: number; // Prozentualer Gesamtanteil am BB der unten stehendend genannten 4 Kategorien (aus Tatsächliche Nutzung Attribut BEZEICH)
  tatNu_WB_P: number; // Prozentualer Anteil Wohnbauflächen auf Baublockfläche
  p_st_mwh_a: number; // gesamte mögliche Solarernte in MWh/a

  constructor(data: any) {
    this.BBZ = data.BBZ.toString();
    this.Shape_Area = data.Shape_Area;
    this.Anz_Fl = data.Anz_Fl;
    this.Bev_Ges = data.Bev_Ges;
    this.tatNu_GesP = data.tatNu_GesP;
    this.tatNu_WB_P = data.tatNu_WB_P;
    this.p_st_mwh_a = data.p_st_mwh_a;
  }

  getId(): string {
    return this.BBZ;
  }

  getName(): string {
    return this.BBZ;
  }

  getFeatureId(feature: Feature): string {
    return feature.get(Baublock.featureIdProp);
  }

  getFeatureName(feature: Feature): string {
    return feature.get(Baublock.featureNameProp);
  }
}
