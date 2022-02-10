import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';

import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

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
