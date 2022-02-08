import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

export const adminLevelClassMap: Record<
  string,
  | typeof Stadt
  | typeof Bezirk
  | typeof Stadtteil
  | typeof StatGebiet
  | typeof Baublock
> = {
  Stadt: Stadt,
  Bezirk: Bezirk,
  Stadtteil: Stadtteil,
  StatGebiet: StatGebiet,
  Baublock: Baublock
};

export const adminLevels = Object.keys(adminLevelClassMap);
