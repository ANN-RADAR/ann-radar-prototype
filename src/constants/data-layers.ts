import {AdminLayerType} from '@/types/admin-layers';
import {DataLayerOptions} from '@/types/layers';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import RenderFeature from 'ol/render/Feature';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import {vectorSourcesOptions} from './sources';

export const dataLayers: Record<string, DataLayerOptions> = {
  solarCoverageRate: {
    sources: {
      [AdminLayerType.CITY]: vectorSourcesOptions.CITY,
      [AdminLayerType.BOROUGH]: vectorSourcesOptions.BOROUGH,
      [AdminLayerType.QUARTER]: vectorSourcesOptions.QUARTER,
      [AdminLayerType.STATISTICAL_AREA]: vectorSourcesOptions.STATISTICAL_AREA,
      [AdminLayerType.BUILDING_BLOCK]: vectorSourcesOptions.BUILDING_BLOCK_NETTO
    },
    style:
      ({layerConfig, adminLayerDataById, dataId}) =>
      (feature: Feature<Geometry> | RenderFeature) => {
        const adminLayerData = adminLayerDataById[String(feature.get(dataId))];
        const value =
          adminLayerData && adminLayerData[layerConfig.attributeName];
        const color = layerConfig.classification.find(
          category => category.from <= value && category.to >= value
        )?.color;

        return new Style({
          fill: new Fill({
            color: color || 'rgba(0, 0, 0, 0)'
          })
        });
      }
  }
};
