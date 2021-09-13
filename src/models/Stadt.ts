import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class Stadt implements AdminLevelUnit {
  static featureIdProp = "fhh";
  static featureNameProp = "fhh";

  name: string;

  constructor(data: any) {
    this.name = data.name;
  }

  getId(): string {
    return this.name;
  }

  getName(): string {
    return this.name;
  }

  getFeatureId(feature: Feature): string {
    return feature.get(Stadt.featureIdProp);
  }

  getFeatureName(feature: Feature): string {
    return feature.get(Stadt.featureNameProp);
  }
}
