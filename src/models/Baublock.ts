import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class Baublock implements AdminLevelUnit {
  static featureIdProp = "baublockbezeichnung";
  static featureNameProp = "baublockbezeichnung";

  BBZ: string;
  Anz_Fl: number;
  Bev_Ges: number;
  tatNu_WB_P: number;
  p_st_mwh_a: number;

  constructor(data: any) {
    this.BBZ = data.BBZ.toString();
    this.Anz_Fl = data.Anz_Fl;
    this.Bev_Ges = data.Bev_Ges;
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
