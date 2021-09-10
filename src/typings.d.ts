export interface Stadt {
  name: string;
}

export interface Bezirk {
  bezirk: string;
  bezirk_name: string;
  MWh_a: number;
}

export interface Stadtteil {
  stadtteil_name: string;
  stadtteil_nummer: string;
  MWh_a: number;
}

export interface StatGebiet {
  STATGEB: number;
  Shape_Leng: number;
  Shape_Area: number;
  STATGEB_AL: number;
  AnzFlur: number;
  mttlFlur: number;
}

export interface Baublock {
  BBZ: number;
  Shape_Leng: number;
  Shape_Area: number;
  Anz_Fl: number;
  mittl_Fl: number;
  Bev_Ges: number;
  tatNu_GesP: number;
  tatNu_WB_P: number;
  tatNu_IG_P: number;
  tatNu_FP_P: number;
  tatNu_GM_P: number;
  area_pv_m2: number;
  area_ek1_p: number;
  area_ek2_p: number;
  area_ek3_p: number;
  area_ek4_p: number;
  p_pv_15: number;
  powerp_15: number;
  co2_pv_15: number;
  area_st_1a: number;
  area_st_2a: number;
  p_st_mwh_a: number;
}

type AdminArea = Stadt | Bezirk | Stadtteil | StatGebiet | Baublock;

export interface Selection {
  type: string;
  areas: AdminArea[];
  note: string;
}
