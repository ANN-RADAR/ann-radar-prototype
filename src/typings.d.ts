export interface AdminLevelUnit {
  getId(): string;
  getName(): string;
  getFeatureId(feature: Feature): string;
  getFeatureName(feature: Feature): string;
}

export interface Selection {
  title: string;
  type: string;
  areas: AdminLevelUnit[];
  note: string;
}
