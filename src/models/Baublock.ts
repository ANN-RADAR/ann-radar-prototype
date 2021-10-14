import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";
import { AdminLevelProperties } from "./AdminLevelProperties";

export class Baublock extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = "baublockbezeichnung";
  static featureNameProp = "baublockbezeichnung";

  BBZ: string;        // Baublocknummer
  BB_Netto_A: number; // Nettobaublockfläche
  p_st_mwh_a: number; // gesamte mögliche Solarernte in MWh/a

  constructor(data: Baublock) {
    super(data);

    this.BBZ = data.BBZ?.toString();
    this.BB_Netto_A = data.BB_Netto_A;
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
