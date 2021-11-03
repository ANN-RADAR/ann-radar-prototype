export interface AdminLevelUnit {
  getId(): string;
  getName(): string;
  getFeatureId(feature: Feature): string;
  getFeatureName(feature: Feature): string;
}

export interface Session {
  title: string;
  selectedAreas: Record<string, AdminLevelProperties[]>;
  notes: string;
}
