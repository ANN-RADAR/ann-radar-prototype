import {RootState} from '@/types/store';

const getters = {
  currentLayerSelectedFeatureIds: (state: RootState): Array<string> =>
    (state.adminLayerType &&
      state.adminLayerData[state.adminLayerType]?.selectedFeatureIds) ||
    []
};

export default getters;
