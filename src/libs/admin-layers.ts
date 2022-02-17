import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

import {adminLayers} from '@/constants/admin-layers';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import {AdminLayerFeatureData, AdminLayerType} from '@/types/admin-layers';

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
  features: Array<Feature<Geometry>>
): Record<string, number> => {
  const {featureName, data, dataId} = adminLayers[adminLayerType];

  if (!data || !dataId || !featureName) {
    return {};
  }

  const featureNames = features.map(feature => feature.get(featureName));
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
        AnzFl: aggr.AnzFl + area.AnzFl,
        mittlFl: aggr.mittlFl + area.mittlFl * area.AnzFl,
        BGF: aggr.BGF + area.BGF,
        tatNu_WB_P: aggr.tatNu_WB_P + area.tatNu_WB_P * area.Shape_Area,
        Bev_311219: aggr.Bev_311219 + area.Bev_311219,
        p_st_mwh_a: aggr.p_st_mwh_a + (area.p_st_mwh_a || 0)
      };
    },
    {
      Shape_Area: 0,
      AnzFl: 0,
      mittlFl: 0,
      BGF: 0,
      tatNu_WB_P: 0,
      Bev_311219: 0,
      p_st_mwh_a: 0
    }
  );

  return {
    AnzFl: weightedSums.AnzFl,
    mittlFl: weightedSums.mittlFl / weightedSums.AnzFl,
    BGF: weightedSums.BGF,
    tatNu_WB_P: weightedSums.tatNu_WB_P / weightedSums.Shape_Area,
    Bev_311219: weightedSums.Bev_311219,
    p_st_mwh_a: weightedSums.p_st_mwh_a
  };
};
