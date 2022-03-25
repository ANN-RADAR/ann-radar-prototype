import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

import {adminLayers} from '@/constants/admin-layers';
import {
  AdminLayerFeatureData,
  AdminLayerType,
  FeaturesDataKeys
} from '@/types/admin-layers';

export const getAdminLayerStyle =
  (textAttr: string): StyleFunction =>
  feature =>
    feature.get('selected')
      ? new Style({
          stroke: new Stroke({
            color: '#f00',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.1)'
          }),
          text: new Text({
            font: '16px Arial',
            text: feature.get(textAttr),
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({color: '#fee', width: 4})
          }),
          zIndex: 1
        })
      : new Style({
          stroke: new Stroke({
            color: 'rgba(0, 120, 255, 1.0)',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0)'
          }),
          text: new Text({
            font: '16px Arial',
            text: feature.get(textAttr),
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({color: '#eee', width: 4})
          })
        });

export const calculateAggregateValues = (
  adminLayerType: AdminLayerType,
  features: Array<FeaturesDataKeys>
): Record<string, number> => {
  const {featureName, data, dataId} = adminLayers[adminLayerType];

  if (!data || !dataId || !featureName) {
    return {};
  }

  const featureNames = features.map(({featureName}) => featureName);
  const featuresData = data.filter((featureData: AdminLayerFeatureData) =>
    featureNames.includes(String(featureData[dataId]))
  );

  if (!featuresData.length) {
    return {};
  }

  const weightedSums = featuresData.reduce(
    (aggr, area) => {
      return {
        Shape_Area: aggr.Shape_Area + area.Shape_Area,
        AnzFlur: aggr.AnzFlur + area.AnzFlur,
        mittlFlur: aggr.mittlFlur + area.mittlFlur * area.AnzFlur,
        BGF: aggr.BGF + area.BGF,
        tatNu_WB_P: aggr.tatNu_WB_P + area.tatNu_WB_P * area.Shape_Area,
        Bev_311220: aggr.Bev_311220 + area.Bev_311220,
        SP_GebWB15: aggr.SP_GebWB15 + (area.SP_GebWB15 || 0)
      };
    },
    {
      Shape_Area: 0,
      AnzFlur: 0,
      mittlFlur: 0,
      BGF: 0,
      tatNu_WB_P: 0,
      Bev_311220: 0,
      SP_GebWB15: 0
    }
  );

  return {
    AnzFlur: weightedSums.AnzFlur,
    mittlFlur: weightedSums.mittlFlur / weightedSums.AnzFlur,
    BGF: weightedSums.BGF,
    tatNu_WB_P: weightedSums.tatNu_WB_P / weightedSums.Shape_Area,
    Bev_311220: weightedSums.Bev_311220,
    SP_GebWB15: weightedSums.SP_GebWB15
  };
};
