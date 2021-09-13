import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class Stadtteil implements AdminLevelUnit {
  static featureIdProp = "stadtteil_nummer";
  static featureNameProp = "stadtteil_name";

  stadtteil_name: string;
  stadtteil_nummer: string;
  MWh_a: number;

  constructor(data: any) {
    this.stadtteil_name = data.stadtteil_name;
    this.stadtteil_nummer = data.stadtteil_nummer;
    this.MWh_a = data.MWh_a;
  }

  getId(): string {
    return this.stadtteil_nummer;
  }

  getName(): string {
    return this.stadtteil_name;
  }

  getFeatureId(feature: Feature): string {
    return feature.get(Stadtteil.featureIdProp);
  }

  getFeatureName(feature: Feature): string {
    return feature.get(Stadtteil.featureNameProp);
  }
}
