import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

import {
  AdminLayerType,
  AdminLevels,
  AdminLayerFeatureData
} from '@/types/admin-layers';

import baublockData from '../../public/data/baublöcke.json';
import bezirkData from '../../public/data/bezirke.json';
import statData from '../../public/data/statistische_gebiete.json';
import stadtTeilData from '../../public/data/stadtteile.json';

export const adminLayers: {
  [key in AdminLayerType]: {
    featureId: string;
    featureName: string;
    data?: AdminLayerFeatureData[];
    dataId: string;
  };
} = {
  [AdminLayerType.Stadt]: {
    featureId: 'fhh',
    featureName: 'fhh',
    dataId: 'name'
  },
  [AdminLayerType.Bezirk]: {
    featureId: 'bezirk',
    featureName: 'bezirk_name',
    data: bezirkData as unknown as AdminLayerFeatureData[],
    dataId: 'bezirk_name'
  },
  [AdminLayerType.Stadtteil]: {
    featureId: 'stadtteil_nummer',
    featureName: 'stadtteil_name',
    data: stadtTeilData as unknown as AdminLayerFeatureData[],
    dataId: 'stadtteil_name'
  },
  [AdminLayerType.StatGebiet]: {
    featureId: 'statgebiet',
    featureName: 'statgebiet',
    data: statData as unknown as AdminLayerFeatureData[],
    dataId: 'STATGEB'
  },
  [AdminLayerType.Baublock]: {
    featureId: 'baublockbezeichnung',
    featureName: 'baublockbezeichnung',
    data: baublockData as unknown as AdminLayerFeatureData[],
    dataId: 'BBZ'
  }
};

// @deprecated

export const adminLevelClassMap: AdminLevels = {
  Stadt: Stadt,
  Bezirk: Bezirk,
  Stadtteil: Stadtteil,
  StatGebiet: StatGebiet,
  Baublock: Baublock
};

export const adminAreaTypes = Object.keys(adminLevelClassMap);
