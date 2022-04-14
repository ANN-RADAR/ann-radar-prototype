import {AdminLayerType, AdminLayerFeatureData} from '@/types/admin-layers';

import buildingBlockData from '../../public/data/baublöcke.json';
import boroughData from '../../public/data/bezirke.json';
import statisticalAreaData from '../../public/data/statistische_gebiete.json';
import quarterData from '../../public/data/stadtteile.json';

export const adminLayers: {
  [key in AdminLayerType]: {
    featureId: string;
    featureName: string; // the name used as label for the geometry on the map
    data?: AdminLayerFeatureData[];
    dataId: string; // to match geometry and data
  };
} = {
  [AdminLayerType.CITY]: {
    featureId: 'fhh',
    featureName: 'fhh',
    dataId: 'name'
  },
  [AdminLayerType.BOROUGH]: {
    featureId: 'Bezirk',
    featureName: 'Bezirk',
    data: boroughData as unknown as AdminLayerFeatureData[],
    dataId: 'Bezirk'
  },
  [AdminLayerType.QUARTER]: {
    featureId: 'Stadtteil',
    featureName: 'Stadtteil',
    data: quarterData as unknown as AdminLayerFeatureData[],
    dataId: 'Stadtteil'
  },
  [AdminLayerType.STATISTICAL_AREA]: {
    featureId: 'StatGeb',
    featureName: 'StatGeb',
    data: statisticalAreaData as unknown as AdminLayerFeatureData[],
    dataId: 'StatGeb'
  },
  [AdminLayerType.BUILDING_BLOCK]: {
    featureId: 'BBZ',
    featureName: 'BBZ',
    data: buildingBlockData as unknown as AdminLayerFeatureData[],
    dataId: 'BBZ'
  }
};
