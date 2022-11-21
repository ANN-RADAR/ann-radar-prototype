import {getAdminLayerStyle} from '@/libs/admin-layers';
import {
  LayerOptions,
  TileLayerOptions,
  VectorLayerOptions
} from '@/types/layers';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {Options as VectorSourceOptions} from 'ol/source/Vector';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import {Options as VectorTileSourceOptions} from 'ol/source/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import RenderFeature from 'ol/render/Feature';
import {TileWMS} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import {MVT} from 'ol/format';
import {tileSourcesOptions, vectorSourcesOptions} from './sources';
import {MapStyle} from '@/types/map-styles';
import {adminLayers} from './admin-layers';
import {AdminLayerType} from '@/types/admin-layers';
import {socialMonitoringColors} from './colors';
import {laboratoriesStyle, mobilityIsochronesStyle} from './map-layer-styles';

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
  },
  {
    type: 'vector',
    properties: {name: 'buildingSolarPotential'},
    visible: false,
    source: vectorSourcesOptions.HH_Gebaeude_Solarpotential,
    style: feature =>
      new Style({
        stroke: new Stroke({
          color: '#3399CC',
          width: 1.25
        }),
        text: new Text({
          font: '12px Avenir, Helvetica, Arial, sans-serif',
          text: String(feature.getProperties()['p_st_mwha']),
          fill: new Fill({
            color: '#000'
          })
        })
      }),
    zIndex: 6,
    minZoom: 13
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
  },
  {
    type: 'vector',
    properties: {name: 'buildingSpecificHeatDemand'},
    visible: false,
    source: vectorSourcesOptions.HH_Gebaeude_spezifischer_Nutzwaermebedarf,
    style: feature =>
      new Style({
        stroke: new Stroke({
          color: '#3399CC',
          width: 1.25
        }),
        text: new Text({
          font: '12px Calibri,sans-serif',
          text: String(feature.getProperties()['Diff_WBd_P']),
          fill: new Fill({
            color: '#000'
          })
        })
      }),
    zIndex: 6,
    minZoom: 13
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
    source: [
      tileSourcesOptions.HH_WMS_Freiwilliges_Engagement,
      tileSourcesOptions.HH_WMS_Familien_Angebote,
      tileSourcesOptions[
        'HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe'
      ],
      tileSourcesOptions.HH_WMS_Jugend_Aktiv_Plus,
      tileSourcesOptions.HH_WMS_KitaEinrichtung
    ]
  },
  {
    type: 'tile',
    properties: {name: 'buildingAndLiving'},
    visible: false,
    source: [
      tileSourcesOptions.HH_WMS_Wohnungsbauprojekte,
      tileSourcesOptions.HH_WMS_Wohnbauflaechenpotenziale
    ]
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
  },
  {
    type: 'tile',
    properties: {name: 'powerConsumption'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Waermekataster_Stromverbrauch
  }
];

export const laboratoriesLayersOptions: Array<VectorLayerOptions> = [
  {
    type: 'vector',
    properties: {name: 'urban-testbeds'},
    visible: false,
    source: {wrapX: false},
    style: laboratoriesStyle,
    zIndex: 4
  },
  {
    type: 'vector',
    properties: {name: 'model-quarters'},
    visible: false,
    source: {wrapX: false},
    style: laboratoriesStyle,
    zIndex: 4
  }
];

export const mobilityIsochronesLayerOptions: VectorLayerOptions = {
  type: 'vector',
  properties: {name: 'mobility-isochrones'},
  visible: true,
  source: {wrapX: false},
  style: mobilityIsochronesStyle,
  zIndex: 4
};

export const mapStyleLayersOptions: Array<TileLayerOptions> = [
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
      name: MapStyle.COLORED
    },
    visible: true,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
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
    source: vectorSourcesOptions.DISTRICT,
    visible: false,
    style: getAdminLayerStyle(adminLayers[AdminLayerType.DISTRICT].featureId),
    properties: {
      name: AdminLayerType.DISTRICT
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

const isVectorTileSource = (source: VectorSourceOptions) =>
  'format' in source && source?.format instanceof MVT;

const getLayerWithSource = (
  type: 'vector' | 'tile',
  {
    source,
    ...layerOptions
  }: Omit<LayerOptions, 'type' | 'source'> & {
    source?: TileSourceOptions | VectorSourceOptions;
  }
) => {
  if (type === 'vector') {
    return source && isVectorTileSource(source)
      ? new VectorTileLayer({
          ...layerOptions,
          source: new VectorTileSource(source as VectorTileSourceOptions)
        })
      : new VectorLayer({
          ...layerOptions,
          source: new VectorSource(source)
        });
  } else {
    return new TileLayer({
      ...layerOptions,
      source: new TileWMS(source as TileSourceOptions)
    });
  }
};

const getLayerWithOptions = ({type, ...layerOptions}: LayerOptions) => {
  const sources = Array.isArray(layerOptions.source)
    ? layerOptions.source
    : [layerOptions.source];

  // Return layer group if multiple sources were configured
  if (sources.length > 1) {
    const {properties, visible, ...options} = layerOptions;

    return new LayerGroup({
      layers: sources.map(source =>
        getLayerWithSource(type, {
          ...options,
          properties,
          source,
          visible: true
        })
      ),
      properties,
      visible
    });
  }

  // Return single layer if only one source was configured
  return getLayerWithSource(type, {...layerOptions, source: sources[0]});
};

export const getBaseLayers = (): LayerGroup =>
  new LayerGroup({
    layers: [
      ...baseLayersOptions,
      ...solarPotentialLayersOptions,
      ...energyPotentialLayersOptions
    ].map(getLayerWithOptions)
  });

export const getLabortoriesLayers = (): LayerGroup =>
  new LayerGroup({layers: laboratoriesLayersOptions.map(getLayerWithOptions)});

export const getMobilityIsochronesLayer = (): VectorLayer<
  VectorSource<Geometry>
> =>
  getLayerWithOptions(mobilityIsochronesLayerOptions) as VectorLayer<
    VectorSource<Geometry>
  >;

export const getMapStyleLayers = (): LayerGroup =>
  new LayerGroup({
    layers: mapStyleLayersOptions.map(getLayerWithOptions)
  });

export const getAdminAreaLayers = (): LayerGroup =>
  new LayerGroup({
    layers: adminAreaLayersOptions.map(getLayerWithOptions)
  });
