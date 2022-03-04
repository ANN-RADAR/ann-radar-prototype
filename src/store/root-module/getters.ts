import {RootState} from '@/types/store';
import {FeaturesDataKeys} from '@/types/admin-layers';

const getters = {
  currentLayerSelectedFeatureDataKeys: (
    state: RootState
  ): Array<FeaturesDataKeys> =>
    (state.adminLayerType &&
      state.adminLayerData[state.adminLayerType]?.selectedFeatureDataKeys) ||
    []
};

export default getters;
