import {AdminLayerFeatureData, AdminLayerType} from '@/types/admin-layers';
import {DataLayerOptions, LayerConfig} from '@/types/layers';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import RenderFeature from 'ol/render/Feature';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import {vectorSourcesOptions} from './sources';

export const dataLayerIds = ['solarCoverageRate', 'heatDemand'];

export const dataLayerOptions: DataLayerOptions = {
  sources: {
    [AdminLayerType.CITY]: vectorSourcesOptions.CITY,
    [AdminLayerType.DISTRICT]: vectorSourcesOptions.DISTRICT,
    [AdminLayerType.QUARTER]: vectorSourcesOptions.QUARTER,
    [AdminLayerType.STATISTICAL_AREA]: vectorSourcesOptions.STATISTICAL_AREA,
    [AdminLayerType.BUILDING_BLOCK]: vectorSourcesOptions.BUILDING_BLOCK_NETTO
  },
  style:
    (options: {
      layerConfig: LayerConfig;
      selectedClassificationIndex: number | undefined;
      adminLayerDataById: Record<string, AdminLayerFeatureData>;
      featureId: string;
    }) =>
    (feature: Feature<Geometry> | RenderFeature) => {
      const {
        layerConfig,
        selectedClassificationIndex,
        adminLayerDataById,
        featureId
      } = options;
      const adminLayerData = adminLayerDataById[String(feature.get(featureId))];
      const value = adminLayerData && adminLayerData[layerConfig.attributeName];
      const classification =
        selectedClassificationIndex != null
          ? layerConfig.classification[selectedClassificationIndex]
              ?.classification
          : layerConfig.classification;
      const color =
        value != null &&
        classification?.find(
          category => category.from <= value && category.to >= value
        )?.color;

      return new Style({
        fill: new Fill({
          color: color || 'rgba(0, 0, 0, 0)'
        })
      });
    }
};
