import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";

export class StatGebiet implements AdminLevelUnit {
  static featureIdProp = "statgebiet";
  static featureNameProp = "statgebiet";

  STATGEB: string;
  AnzFl: number;
  mittlFl: number;
  tatNu_WB_P: number;
  BGF: number;
  Soz_Status: string;

  constructor(data: any) {
    this.STATGEB = data.STATGEB.toString();
    this.AnzFl = data.AnzFl;
    this.mittlFl = data.mittlFl;
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
