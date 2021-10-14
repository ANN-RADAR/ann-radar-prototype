import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";
import { AdminLevelProperties } from "./AdminLevelProperties";

export class StatGebiet extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = "statgebiet";
  static featureNameProp = "statgebiet";

  STATGEB: string;    // amtliche Gebietsnummer
  Soz_Status: string; // Wert Statusindex aus Sozialmonitoring 2020

  constructor(data: StatGebiet) {
    super(data);

    this.STATGEB = data.STATGEB?.toString();
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
