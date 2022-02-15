import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

import {AdminLevels} from '@/types/admin-levels';

export const adminLevelClassMap: AdminLevels = {
  Stadt: Stadt,
  Bezirk: Bezirk,
  Stadtteil: Stadtteil,
  StatGebiet: StatGebiet,
  Baublock: Baublock
};

export const adminAreaTypes = Object.keys(adminLevelClassMap);
