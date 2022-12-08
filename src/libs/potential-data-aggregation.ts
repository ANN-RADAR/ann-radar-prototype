import {AdminLayerFeatureData, AdminLayerType} from '@/types/admin-layers';
import {adminLayers} from '@/constants/admin-layers';
import {
  potentialDataAggregationSteps,
  potentialDataWithAggregationFunction
} from '@/constants/potential-data';

export const aggregateValues = (
  adminLayerType: AdminLayerType,
  featureIds: Array<string>
): Record<string, number> => {
  const {featureId, data, dataId} = adminLayers[adminLayerType];

  if (!data || !dataId || !featureId) {
    return {};
  }

  const featuresData = data.filter((featureData: AdminLayerFeatureData) =>
    featureIds.includes(String(featureData[dataId]))
  );

  if (!featuresData.length) {
    return {};
  }

  // Run iterable aggregation step for all aggregatable values
  const summedValues = featuresData.reduce(
    (aggregation, currentValue) =>
      Object.fromEntries(
        potentialDataWithAggregationFunction.map(key => {
          const {iterable = aggregation => aggregation[key]} =
            potentialDataAggregationSteps[key];
          return [key, iterable(aggregation, currentValue)];
        })
      ),
    Object.fromEntries(
      potentialDataWithAggregationFunction.map(key => [key, 0])
    )
  );

  // Run the final aggregation step for all aggregatable values
  // (needed to calculate averages, means or similar)
  return Object.fromEntries(
    potentialDataWithAggregationFunction.map(key => {
      const {final = aggregation => aggregation[key]} =
        potentialDataAggregationSteps[key];
      return [key, final(summedValues, featuresData.length)];
    })
  );
};
