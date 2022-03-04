import {RootState} from '@/types/store';
import {MapStyle} from '@/types/map-styles';
import {AdminLayerType, AdminLayerData} from '@/types/admin-layers';

const state: RootState = {
  mapStyle: MapStyle.COLORED,
  baseLayerTypes: [],
  adminLayerType: null,
  adminLayerData: {} as Record<AdminLayerType, AdminLayerData>
};

export default state;
