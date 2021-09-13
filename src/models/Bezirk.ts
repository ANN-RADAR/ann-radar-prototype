import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class Bezirk implements AdminLevelUnit {
  static featureIdProp = "bezirk";
  static featureNameProp = "bezirk_name";

  bezirk: string;
  bezirk_name: string;
  MWh_a: number;

  constructor(data: any) {
    this.bezirk = data.bezirk;
    this.bezirk_name = data.bezirk_name;
    this.MWh_a = data.MWh_a;
  }

  getId(): string {
    return this.bezirk;
  }

  getName(): string {
    return this.bezirk_name;
  }

  getFeatureId(feature: Feature): string {
    return feature.get(Bezirk.featureIdProp);
  }

  getFeatureName(feature: Feature): string {
    return feature.get(Bezirk.featureNameProp);
  }
}
