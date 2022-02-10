export interface Session {
  title: string;
  selectedAreas: Record<string, AdminLevelProperties[]>;
  notes: string;
}
