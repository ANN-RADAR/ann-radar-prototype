import {RootState} from '@/types/store';
import {FeaturesDataKeys} from '@/types/admin-layers';

const getters = {
  currentLayerSelectedFeatureDataKeys: (
    state: RootState
  ): Array<FeaturesDataKeys> =>
    (state.adminLayerType &&
      state.selectedFeatureDataKeys[state.adminLayerType]) ||
    []
};

export default getters;
