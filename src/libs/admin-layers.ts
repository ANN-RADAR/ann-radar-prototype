import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';

import {adminLayers} from '@/constants/admin-layers';
import {AdminLayerFeatureData, AdminLayerType} from '@/types/admin-layers';

export const getAdminLayerStyle =
  (textAttr: string): StyleFunction =>
  feature => {
    const isSelected = feature.get('selected');
    const isHighlighted = feature.get('highlighted');

    const strokeColor = isSelected ? '#f00' : '#0078ff';
    const strokeWidth = isSelected ? 3 : 2;
    const fillColor = isSelected
      ? 'rgba(255, 0, 0, 0.1)'
      : isHighlighted
      ? 'rgba(0, 120, 255, 0.3)'
      : 'rgba(0, 0, 0, 0)';
    const zIndex = isSelected ? 2 : isHighlighted ? 1 : undefined;

    return new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth
      }),
      fill: new Fill({
        color: fillColor
      }),
      text: new Text({
        font: '16px Arial',
        text: feature.get(textAttr),
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({color: '#fff', width: 4})
      }),
      zIndex
    });
  };

export const calculateAggregateValues = (
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

  const weightedSums = featuresData.reduce(
    (aggr, area) => {
      return {
        Shape_Area: aggr.Shape_Area + area.Shape_Area,
        AnzFlur: aggr.AnzFlur + area.AnzFlur,
        mittlFlur: aggr.mittlFlur + area.mittlFlur * area.AnzFlur,
        BGF: aggr.BGF + area.BGF,
        tatNu_WB_P: aggr.tatNu_WB_P + area.tatNu_WB_P * area.Shape_Area,
        Wohnfl_WK: aggr.Wohnfl_WK + (area.Wohnfl_WK || 0),
        Haush: aggr.Haush + area.Haush,
        Bev_311220: aggr.Bev_311220 + area.Bev_311220,
        SP_GebWB15: aggr.SP_GebWB15 + (area.SP_GebWB15 || 0),
        NW_absdiff: aggr.NW_absdiff + (area.NW_absdiff || 0),
        spezWBd_dP: aggr.spezWBd_dP + area.spezWBd_dP * area.Shape_Area
      };
    },
    {
      Shape_Area: 0,
      AnzFlur: 0,
      mittlFlur: 0,
      BGF: 0,
      tatNu_WB_P: 0,
      Wohnfl_WK: 0,
      Haush: 0,
      Bev_311220: 0,
      SP_GebWB15: 0,
      NW_absdiff: 0,
      spezWBd_dP: 0
    }
  );

  return {
    AnzFlur: weightedSums.AnzFlur,
    mittlFlur: weightedSums.mittlFlur / weightedSums.AnzFlur,
    BGF: weightedSums.BGF,
    tatNu_WB_P: weightedSums.tatNu_WB_P / weightedSums.Shape_Area,
    Wohnfl_WK: weightedSums.Wohnfl_WK,
    Haush: weightedSums.Haush,
    Bev_311220: weightedSums.Bev_311220,
    SP_GebWB15: weightedSums.SP_GebWB15,
    NW_absdiff: weightedSums.NW_absdiff,
    spezWBd_dP: weightedSums.spezWBd_dP / weightedSums.Shape_Area
  };
};
