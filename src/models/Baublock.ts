import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";
import { AdminLevelProperties } from "./AdminLevelProperties";

export class Baublock extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = "baublockbezeichnung";
  static featureNameProp = "baublockbezeichnung";

  static nameProp = "BBZ";

  BBZ: string;        // Baublocknummer
  BB_Netto_A: number; // Nettobaublockfläche

  constructor(data: Baublock) {
    super(data);

    this.BBZ = data.BBZ?.toString();
    this.BB_Netto_A = data.BB_Netto_A;
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
