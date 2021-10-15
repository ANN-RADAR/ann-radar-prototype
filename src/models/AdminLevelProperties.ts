export class AdminLevelProperties {
  Shape_Area: number; // Fläche in m²
  AnzFl: number;      // Anzahl der Flurstücke
  mittlFl: number;    // mittlere Flurstücksgröße
  tatNu_gesP: number; // prozentualer Gesamtanteil der unten stehenden genannten 4 Kategorien (aus tatsächliche Nutzung Attribut BEZEICH)
  tatNu_WB_P: number; // prozentualer Anteil Wohnbauflächen
  tatNu_IG_P: number; // prozentualer Anteil Industrie- und Gewerbeflächen
  tatNu_FP_P: number; // prozentualer Anteil Flächen funkt. Prägung
  tatNu_GM_P: number; // prozentualer Anteil gemischte Flächen
  Geb_GRF_A: number;  // Gebäudegrundfläche
  Geb_GRF_P: number;  // prozentualer Anteil Gebäudegrundfläche
  Geb_Anz: number;    // Anzahl Gebäude/Gebäudeteile
  BGF: number;        // Summe Bruttogeschoßfläche aller Gebäude
  BGF_WB: number;     // Summe Bruttogeschoßfläche aller Gebäude mit Wohnen (Attribut BEZGFK), bei gemischter Nutzung anteilig berechnet
  GFZ: number;        // Geschoßflächenzahl (Bruttogeschoßflächen aller Gebäude, geteilt durch Fläche)
  LGB_Fl_A: number;   // Landesgrundbesitz, summierte Fläche m² Flurstücke/Flurstücksteile
  LGB_P: number;      // Landesgrundbesitz, prozentualer Anteil
  LGB_Anz_Fl: number; // Landesgrundbesitz, Anzahl der Flurstücke
  LGB_Geb_A: number;  // Gebäudegrundfläche in m² auf Landesgrundbesitz
  LGB_Geb_P: number;  // prozentualer Anteil der Gebäudegrundfläche auf Landesgrundbesitz
  LGB_Anz_Ge: number; // Anzahl der Gebäude/Gebäudeteile auf Landesgrundbesitz
  Bev_311219: number; // Gesamtbevölkerung, Stand 31.12.2019
  U18: number;        // Personen im Alter bis unter 18 Jahre
  U18_P: number;      // prozentualer Anteil an der Gesamtbevölkerung
  Ü65: number;        // Personen im Alter über 65 Jahre
  Ü65_P: number;      // prozentualer Anteil an der Gesamtbevölkerung
  Ausl: number;       // Anzahl Ausländer
  Ausl_P: number;     // prozentualer Anteil an der Gesamtbevölkerung
  Bev_Mig: number;    // Anzahl Personen mit Migrationshintergrund
  Bev_Mig_P: number;  // prozentualer Anteil an der Gesamtbevölkerung
  SGBII_III: number;  // Anzahl Bezieher von SGBII- und SGBIII-Leistungen (Arbeitslose)
  SGB_1565_P: number; // prozentualer Anteil der Arbeitslosen an der Bevölkerung zwischen 15 und 65 Jahren
  Haush: number;      // Gesamtzahl der Haushalte
  Haush_K: number;    // Zahl der Haushalte mit Kindern
  Haush_K_P: number;  // prozentualer Anteil der Haushalte mit Kindern an der Gesamtzahl der Haushalte
  Haushgr: number;    // durchschnittliche Haushaltsgröße (Personenzahl)
  Wohnungen: number;  // Gesamtzahl der Wohnungen in Wohn- und Nichtwohngebäuden
  SozialWh: number;   // Zahl der Sozialwohnungen
  SozialWh_P: number; // prozentualer Anteil der Sozialwohnungen an der Gesamtzahl der Wohnungen
  p_st_mwh_a: number; // gesamte mögliche Solarernte in MWh/a

  constructor(data: AdminLevelProperties) {
    this.Shape_Area = data.Shape_Area;
    this.AnzFl = data.AnzFl;
    this.mittlFl = data.mittlFl;
    this.tatNu_gesP = data.tatNu_gesP;
    this.tatNu_WB_P = data.tatNu_WB_P;
    this.tatNu_IG_P = data.tatNu_IG_P;
    this.tatNu_FP_P = data.tatNu_FP_P;
    this.tatNu_GM_P = data.tatNu_GM_P;
    this.Geb_GRF_A = data.Geb_GRF_A;
    this.Geb_GRF_P = data.Geb_GRF_P;
    this.Geb_Anz = data.Geb_Anz;
    this.BGF = data.BGF;
    this.BGF_WB = data.BGF_WB;
    this.GFZ = data.GFZ;
    this.LGB_Fl_A = data.LGB_Fl_A;
    this.LGB_P = data.LGB_P;
    this.LGB_Anz_Fl = data.LGB_Anz_Fl;
    this.LGB_Geb_A = data.LGB_Geb_A;
    this.LGB_Geb_P = data.LGB_Geb_P;
    this.LGB_Anz_Ge = data.LGB_Anz_Ge;
    this.Bev_311219 = data.Bev_311219;
    this.U18 = data.U18;
    this.U18_P = data.U18_P;
    this.Ü65 = data.Ü65;
    this.Ü65_P = data.Ü65_P;
    this.Ausl = data.Ausl;
    this.Ausl_P = data.Ausl_P;
    this.Bev_Mig = data.Bev_Mig;
    this.Bev_Mig_P = data.Bev_Mig_P;
    this.SGBII_III = data.SGBII_III;
    this.SGB_1565_P = data.SGB_1565_P;
    this.Haush = data.Haush;
    this.Haush_K = data.Haush_K;
    this.Haush_K_P = data.Haush_K_P;
    this.Haushgr = data.Haushgr;
    this.Wohnungen = data.Wohnungen;
    this.SozialWh = data.SozialWh;
    this.SozialWh_P = data.SozialWh_P;
    this.p_st_mwh_a = data.p_st_mwh_a;
  }
}
