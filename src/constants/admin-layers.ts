import {AdminLayerType, AdminLayerFeatureData} from '@/types/admin-layers';

import buildingBlockData from '../../public/data/baublöcke.json';
import boroughData from '../../public/data/bezirke.json';
import statisticalAreaData from '../../public/data/statistische_gebiete.json';
import quarterData from '../../public/data/stadtteile.json';

export const adminLayers: {
  [key in AdminLayerType]: {
    featureId: string;
    featureName: string;
    data?: AdminLayerFeatureData[];
    dataId: string;
  };
} = {
  [AdminLayerType.CITY]: {
    featureId: 'fhh',
    featureName: 'fhh',
    dataId: 'name'
  },
  [AdminLayerType.BOROUGH]: {
    featureId: 'bezirk',
    featureName: 'bezirk_name',
    data: boroughData as unknown as AdminLayerFeatureData[],
    dataId: 'bezirk_name'
  },
  [AdminLayerType.QUARTER]: {
    featureId: 'stadtteil_nummer',
    featureName: 'stadtteil_name',
    data: quarterData as unknown as AdminLayerFeatureData[],
    dataId: 'stadtteil_name'
  },
  [AdminLayerType.STATISTICAL_AREA]: {
    featureId: 'statgebiet',
    featureName: 'statgebiet',
    data: statisticalAreaData as unknown as AdminLayerFeatureData[],
    dataId: 'STATGEB'
  },
  [AdminLayerType.BUILDING_BLOCK]: {
    featureId: 'baublockbezeichnung',
    featureName: 'baublockbezeichnung',
    data: buildingBlockData as unknown as AdminLayerFeatureData[],
    dataId: 'BBZ'
  }
};
