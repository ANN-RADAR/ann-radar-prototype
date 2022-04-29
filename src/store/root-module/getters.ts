import {RootState} from '@/types/store';

const getters = {
  currentLayerSelectedFeatureIds: (state: RootState): Array<string> =>
    (state.adminLayerType && state.selectedFeatureIds[state.adminLayerType]) ||
    []
};

export default getters;
