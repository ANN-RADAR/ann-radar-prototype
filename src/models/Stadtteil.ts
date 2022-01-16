import { AdminLevelUnit } from "@/typings";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import { AdminLevelProperties } from "./AdminLevelProperties";

export class Stadtteil extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = "stadtteil_nummer";
  static featureNameProp = "stadtteil_name";

  static nameProp = "stadtteil_name";

  stadtteil_nummer: string;
  stadtteil_name: string;
  Anz_statGe: number;

  constructor(data: Stadtteil) {
    super(data);

    this.stadtteil_nummer = data.stadtteil_nummer?.toString();
    this.stadtteil_name = data.stadtteil_name;
    this.Anz_statGe = data.Anz_statGe;
  }

  getId(): string {
    return this.stadtteil_nummer;
  }

  getName(): string {
    return this.stadtteil_name;
  }

  getFeatureId(feature: Feature<Geometry>): string {
    return feature.get(Stadtteil.featureIdProp);
  }

  getFeatureName(feature: Feature<Geometry>): string {
    return feature.get(Stadtteil.featureNameProp);
  }
}
