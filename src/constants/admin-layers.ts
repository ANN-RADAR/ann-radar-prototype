import {AdminLayerType, AdminLayerFeatureData} from '@/types/admin-layers';

import buildingBlockData from '../../public/data/baublöcke.json';
import districtData from '../../public/data/bezirke.json';
import statisticalAreaData from '../../public/data/statistische_gebiete.json';
import quarterData from '../../public/data/stadtteile.json';
import cityData from '../../public/data/city.json';

export const adminLayers: {
  [key in AdminLayerType]: {
    featureId: string; // the name of the property used as label for the geometry on the map and to match geometry and data
    data?: AdminLayerFeatureData[];
    dataId: string; // the name of the id property in the data json to match geometry and data
  };
} = {
  [AdminLayerType.CITY]: {
    featureId: 'fhh',
    data: cityData as unknown as AdminLayerFeatureData[],
    dataId: 'Stadt'
  },
  [AdminLayerType.DISTRICT]: {
    featureId: 'bezirk_name',
    data: districtData as unknown as AdminLayerFeatureData[],
    dataId: 'Bezirk'
  },
  [AdminLayerType.QUARTER]: {
    featureId: 'stadtteil_name',
    data: quarterData as unknown as AdminLayerFeatureData[],
    dataId: 'Stadtteil'
  },
  [AdminLayerType.STATISTICAL_AREA]: {
    featureId: 'statgebiet',
    data: statisticalAreaData as unknown as AdminLayerFeatureData[],
    dataId: 'StatGeb'
  },
  [AdminLayerType.BUILDING_BLOCK]: {
    featureId: 'baublockbezeichnung',
    data: buildingBlockData as unknown as AdminLayerFeatureData[],
    dataId: 'BBZ'
  }
};
