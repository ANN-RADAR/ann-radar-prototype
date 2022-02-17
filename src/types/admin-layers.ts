import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';

import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

export enum AdminLayerType {
  Stadt = 'Stadt',
  Bezirk = 'Bezirk',
  Stadtteil = 'Stadtteil',
  StatGebiet = 'StatGebiet',
  Baublock = 'Baublock'
}

export interface AdminLayerFeatureData extends Record<string, string | number> {
  Shape_Area: number;
  AnzFl: number;
  mittlFl: number;
  BGF: number;
  tatNu_WB_P: number;
  Bev_311219: number;
  p_st_mwh_a: number;
}

// @depricated
export interface AdminLevelUnit {
  getId(): string;
  getName(): string;
  getFeatureId(feature: Feature<Geometry>): string;
  getFeatureName(feature: Feature<Geometry>): string;
}

export interface AdminLevels {
  Stadt: typeof Stadt;
  Bezirk: typeof Bezirk;
  Stadtteil: typeof Stadtteil;
  StatGebiet: typeof StatGebiet;
  Baublock: typeof Baublock;
}
