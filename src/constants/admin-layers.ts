import {AdminLayerType, AdminLayerFeatureId} from '@/types/admin-layers';

export const adminLayers: {
  [key in AdminLayerType]: {
    featureId: AdminLayerFeatureId; // the name of the property used as label for the geometry on the map and to match geometry and data
    dataId: string; // the name of the id property in the data json to match geometry and data
  };
} = {
  [AdminLayerType.CITY]: {
    featureId: 'fhh',
    dataId: 'Stadt'
  },
  [AdminLayerType.DISTRICT]: {
    featureId: 'bezirk_name',
    dataId: 'Bezirk'
  },
  [AdminLayerType.QUARTER]: {
    featureId: 'stadtteil_name',
    dataId: 'Stadtteil'
  },
  [AdminLayerType.STATISTICAL_AREA]: {
    featureId: 'statgebiet',
    dataId: 'StatGeb'
  },
  [AdminLayerType.BUILDING_BLOCK]: {
    featureId: 'baublockbezeichnung',
    dataId: 'BBZ'
  }
};
