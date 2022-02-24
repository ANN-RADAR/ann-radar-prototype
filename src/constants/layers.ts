import {getAdminLayerStyle} from '@/libs/admin-layers';
import {LayerOptions} from '@/types/layers';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import RenderFeature from 'ol/render/Feature';
import {TileWMS} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import {tileSourcesOptions, vectorSourcesOptions} from './sources';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {Options as VectorSourceOptions} from 'ol/source/Vector';
import {MapStyle} from '@/types/map-styles';
import {adminLayers} from './admin-layers';
import {AdminLayerType} from '@/types/admin-layers';
import {socialMonitoringColors, solarCoverageRateColors} from './colors';

export const solarPotentialLayersOptions: Array<LayerOptions> = [
  {
    properties: {name: 'solarMap'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Solaratlas,
    zIndex: 5
  },
  {
    properties: {name: 'solarCoverageRate'},
    visible: false,
    source: vectorSourcesOptions.SolarCoverageRate,
    style: (feature: Feature<Geometry> | RenderFeature) => {
      return new Style({
        fill: new Fill({
          color:
            solarCoverageRateColors[feature.get('PVersQt10')] ||
            'rgba(0, 0, 0, 0)'
        })
      });
    },
    zIndex: 4
  }
];

export const energyPotentialLayersOptions: Array<
  LayerOptions<TileSourceOptions>
> = [
  {
    properties: {name: 'heatDemand'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Waermekataster_Waermebedarf,
    zIndex: 5
  }
];

export const baseLayersOptions: Array<LayerOptions> = [
  {
    properties: {name: 'schools'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Schulen
  },
  {
    properties: {name: 'quarterCulture'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Oeffentliche_Bibliotheken
  },
  {
    properties: {name: 'socialInfrastructure'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_GB
  },
  {
    properties: {name: 'buildingAndLiving'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
  },
  {
    properties: {name: 'riseFundingAreas'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_RISE_FG
  },
  {
    properties: {name: 'socialMonitoring2020'},
    visible: false,
    source: vectorSourcesOptions.Sozialmonitoring,
    style: (feature: Feature<Geometry> | RenderFeature) => {
      return new Style({
        stroke: new Stroke({
          color: '#fff',
          width: 1
        }),
        fill: new Fill({
          color:
            socialMonitoringColors[feature.get('STATUSINDE')] ||
            'rgba(0, 0, 0, 0)'
        })
      });
    },
    zIndex: 6
  }
];

export const mapStyleLayersOptions: Array<LayerOptions<TileSourceOptions>> = [
  {
    properties: {
      name: MapStyle.COLORED
    },
    visible: true,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
  },
  {
    properties: {
      name: MapStyle.GRAY_BLUE
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_GB
  },
  {
    properties: {
      name: MapStyle.BLACK_GRAY
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_SG
  }
];

const adminAreaLayersOptions: Array<LayerOptions<VectorSourceOptions>> = [
  {
    source: vectorSourcesOptions.CITY,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.CITY].featureName),
    properties: {
      name: AdminLayerType.CITY
    }
  },
  {
    source: vectorSourcesOptions.BOROUGH,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.BOROUGH].featureName),
    properties: {
      name: AdminLayerType.BOROUGH
    }
  },
  {
    source: vectorSourcesOptions.QUARTER,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.QUARTER].featureName),
    properties: {
      name: AdminLayerType.QUARTER
    }
  },
  {
    source: vectorSourcesOptions.STATISTICAL_AREA,
    visible: false,
    style: getAdminLayerStyle(
      adminLayers[AdminLayerType.STATISTICAL_AREA].featureName
    ),
    properties: {
      name: AdminLayerType.STATISTICAL_AREA
    }
  },
  {
    source: vectorSourcesOptions.BUILDING_BLOCK,
    visible: false,
    style: getAdminLayerStyle(
      adminLayers[AdminLayerType.BUILDING_BLOCK].featureName
    ),
    properties: {
      name: AdminLayerType.BUILDING_BLOCK
    },
    minZoom: 13
  }
];

export const getBaseLayers = (): LayerGroup =>
  new LayerGroup({
    layers: [
      ...[
        ...baseLayersOptions,
        ...solarPotentialLayersOptions,
        ...energyPotentialLayersOptions
      ].map(layer =>
        layer.style
          ? new VectorLayer({
              ...layer,
              source: new VectorSource(layer.source)
            })
          : new TileLayer({
              ...layer,
              source: new TileWMS(layer.source as TileSourceOptions)
            })
      )
    ]
  });

export const getMapStyleLayers = (): LayerGroup =>
  new LayerGroup({
    layers: mapStyleLayersOptions.map(
      layer => new TileLayer({...layer, source: new TileWMS(layer.source)})
    )
  });

export const getAdminAreaLayers = (): LayerGroup =>
  new LayerGroup({
    layers: adminAreaLayersOptions.map(
      layer =>
        new VectorLayer({
          ...layer,
          source: new VectorSource(layer.source)
        })
    )
  });
