export interface AdminLevelUnit {
  getId(): string;
  getName(): string;
  getFeatureId(feature: Feature): string;
  getFeatureName(feature: Feature): string;
}

type AdminLevelKey = "Stadt" | "Bezirk" | "Stadtteil" | "StatGebiet" | "Baublock";

export interface Selection {
  type: string;
  areas: AdminLevelUnit[];
  note: string;
}
