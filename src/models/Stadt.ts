import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";
import { AdminLevelProperties } from "./AdminLevelProperties";

export class Stadt extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = "fhh";
  static featureNameProp = "fhh";

  name: string;

  constructor(data: Stadt) {
    super(data);

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
