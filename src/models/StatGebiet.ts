import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class StatGebiet implements AdminLevelUnit {
  static featureIdProp = "statgebiet";
  static featureNameProp = "statgebiet";

  STATGEB: string;    // Amtliche Gebietsnummer
  AnzFl: number;      // Anzahl der Flurstücke im stat. Gebiet
  mittlFl: number;    // Mittlere Flurstücksgröße im stat. Gebiet
  tatNu_gesP: number; // Prozentualer Gesamtanteil am SG der unten stehendend genannten 4 Kategorien (aus Tatsächliche Nutzung Attribut BEZEICH)
  tatNu_WB_P: number; // Prozentualer Anteil Wohnbauflächen auf SG
  BGF: number;        // Summe Bruttogeschoßfläche aller Gebäude auf SG
  Soz_Status: string; // Wert Statusindex aus Sozialmonitoring 2020

  constructor(data: any) {
    this.STATGEB = data.STATGEB.toString();
    this.AnzFl = data.AnzFl;
    this.mittlFl = data.mittlFl;
    this.tatNu_gesP = data.tatNu_gesP;
    this.tatNu_WB_P = data.tatNu_WB_P;
    this.BGF = data.BGF;
    this.Soz_Status = data.Soz_Status;
  }

  getId(): string {
    return this.STATGEB;
  }

  getName(): string {
    return this.STATGEB;
  }

  getFeatureId(feature: Feature): string {
    return feature.get(StatGebiet.featureIdProp);
  }

  getFeatureName(feature: Feature): string {
    return feature.get(StatGebiet.featureNameProp);
  }
}
