import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import { AdminLevelProperties } from "./AdminLevelProperties";

export class Bezirk extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = "bezirk";
  static featureNameProp = "bezirk_name";

  static nameProp = "bezirk_name";

  bezirk: string;
  bezirk_name: string;
  Anz_Stadtt: number;
  Anz_statGe: number;

  constructor(data: Bezirk) {
    super(data);

    this.bezirk = data.bezirk?.toString();
    this.bezirk_name = data.bezirk_name;
    this.Anz_Stadtt = data.Anz_Stadtt;
    this.Anz_statGe = data.Anz_statGe;
  }

  getId(): string {
    return this.bezirk;
  }

  getName(): string {
    return this.bezirk_name;
  }

  getFeatureId(feature: Feature<Geometry>): string {
    return feature.get(Bezirk.featureIdProp);
  }

  getFeatureName(feature: Feature<Geometry>): string {
    return feature.get(Bezirk.featureNameProp);
  }
}
