import {getAdminLayerStyle} from '@/libs/admin-layers';
import {
  LayerOptions,
  TileLayerOptions,
  VectorLayerOptions
} from '@/types/layers';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
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
import {MapStyle} from '@/types/map-styles';
import {adminLayers} from './admin-layers';
import {AdminLayerType} from '@/types/admin-layers';
import {socialMonitoringColors} from './colors';

export const solarPotentialLayersOptions: Array<LayerOptions> = [
  {
    type: 'tile',
    properties: {name: 'solarMap'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Solaratlas,
    zIndex: 5
  },
  {
    type: 'vector',
    properties: {name: 'solarCoverageRate'},
    visible: false,
    zIndex: 4
  }
];

export const energyPotentialLayersOptions: Array<LayerOptions> = [
  {
    type: 'tile',
    properties: {name: 'heatAtlas'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Waermekataster_Waermebedarf,
    zIndex: 5
  },
  {
    type: 'vector',
    properties: {name: 'heatDemand'},
    visible: false,
    zIndex: 4
  }
];

export const mobilityPotentialLayersOptions: Array<LayerOptions> = [];

export const baseLayersOptions: Array<LayerOptions> = [
  {
    type: 'tile',
    properties: {name: 'schools'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Schulen
  },
  {
    type: 'tile',
    properties: {name: 'quarterCulture'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Oeffentliche_Bibliotheken
  },
  {
    type: 'tile',
    properties: {name: 'socialInfrastructure'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_GB
  },
  {
    type: 'tile',
    properties: {name: 'buildingAndLiving'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
  },
  {
    type: 'tile',
    properties: {name: 'riseFundingAreas'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_RISE_FG
  },
  {
    type: 'vector',
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

export const mapStyleLayersOptions: Array<TileLayerOptions> = [
  {
    type: 'tile',
    properties: {
      name: MapStyle.COLORED
    },
    visible: true,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
  },
  {
    type: 'tile',
    properties: {
      name: MapStyle.GRAY_BLUE
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_GB
  },
  {
    type: 'tile',
    properties: {
      name: MapStyle.BLACK_GRAY
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_SG
  },
  {
    type: 'tile',
    properties: {
      name: MapStyle.SATELLITE
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_DOP
  }
];

const adminAreaLayersOptions: Array<VectorLayerOptions> = [
  {
    type: 'vector',
    source: vectorSourcesOptions.CITY,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.CITY].featureId),
    properties: {
      name: AdminLayerType.CITY
    },
    zIndex: 6
  },
  {
    type: 'vector',
    source: vectorSourcesOptions.BOROUGH,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.BOROUGH].featureId),
    properties: {
      name: AdminLayerType.BOROUGH
    },
    zIndex: 6
  },
  {
    type: 'vector',
    source: vectorSourcesOptions.QUARTER,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.QUARTER].featureId),
    properties: {
      name: AdminLayerType.QUARTER
    },
    zIndex: 6
  },
  {
    type: 'vector',
    source: vectorSourcesOptions.STATISTICAL_AREA,
    visible: false,
    style: getAdminLayerStyle(
      adminLayers[AdminLayerType.STATISTICAL_AREA].featureId
    ),
    properties: {
      name: AdminLayerType.STATISTICAL_AREA
    },
    zIndex: 6
  },
  {
    type: 'vector',
    source: vectorSourcesOptions.BUILDING_BLOCK,
    visible: false,
    style: getAdminLayerStyle(
      adminLayers[AdminLayerType.BUILDING_BLOCK].featureId
    ),
    properties: {
      name: AdminLayerType.BUILDING_BLOCK
    },
    zIndex: 6,
    minZoom: 13
  }
];

export const getBaseLayers = (): LayerGroup =>
  new LayerGroup({
    layers: [
      ...baseLayersOptions,
      ...solarPotentialLayersOptions,
      ...energyPotentialLayersOptions
    ].map(({type, source, ...layerOptions}) =>
      type === 'vector'
        ? new VectorLayer({
            ...layerOptions,
            source: new VectorSource(source)
          })
        : new TileLayer({
            ...layerOptions,
            source: new TileWMS(source as TileSourceOptions)
          })
    )
  });

export const getMapStyleLayers = (): LayerGroup =>
  new LayerGroup({
    layers: mapStyleLayersOptions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({type, source, ...layerOptions}) =>
        new TileLayer({...layerOptions, source: new TileWMS(source)})
    )
  });

export const getAdminAreaLayers = (): LayerGroup =>
  new LayerGroup({
    layers: adminAreaLayersOptions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({type, source, ...layerOptions}) =>
        new VectorLayer({
          ...layerOptions,
          source: new VectorSource(source)
        })
    )
  });
