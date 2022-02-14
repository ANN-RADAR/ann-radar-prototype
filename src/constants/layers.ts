import {getAdminAreaStyle} from '@/libs/admin-area';
import {Baublock} from '@/models/Baublock';
import {Bezirk} from '@/models/Bezirk';
import {Stadt} from '@/models/Stadt';
import {Stadtteil} from '@/models/Stadtteil';
import {StatGebiet} from '@/models/StatGebiet';
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

export const solarAtlasLayerOptions = {
  properties: {name: 'Solaratlas'},
  visible: false,
  source: tileSourcesOptions.HH_WMS_Solaratlas,
  zIndex: 5
};

export const heatingLayerOptions = {
  properties: {name: 'Wärmebedarf'},
  visible: false,
  source: tileSourcesOptions.HH_WMS_Waermekataster_Waermebedarf,
  zIndex: 5
};

export const baseLayersOptions = [
  {
    properties: {name: 'Schulen'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Schulen
  },
  {
    properties: {name: 'Stadtteilkultur'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Oeffentliche_Bibliotheken
  },
  {
    properties: {name: 'Soziale Infrastruktur'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_GB
  },
  {
    properties: {name: 'Bauen und Wohnen'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
  },
  {
    properties: {name: 'RISE-Fördergebiete'},
    visible: false,
    source: tileSourcesOptions.HH_WMS_RISE_FG
  },
  {
    properties: {name: 'Sozialmonitoring 2020'},
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
            (
              {
                hoch: 'rgba(112, 168, 0, 0.6)',
                mittel: 'rgba(115, 178, 255, 0.6)',
                niedrig: 'rgba(255, 170, 1, 0.6)',
                'sehr niedrig': 'rgba(229, 83, 122, 0.6)'
              } as {[key: string]: string}
            )[feature.get('STATUSINDE')] || 'rgba(0, 0, 0, 0)'
        })
      });
    },
    zIndex: 6
  }
];

export const mapStyleLayersOptions = [
  {
    properties: {
      name: 'farbig'
    },
    visible: true,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten
  },
  {
    properties: {
      name: 'grau-blau'
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_GB
  },
  {
    properties: {
      name: 'schwarz-grau'
    },
    visible: false,
    source: tileSourcesOptions.HH_WMS_Geobasiskarten_SG
  }
];

const adminAreaLayersOptions = [
  {
    source: vectorSourcesOptions.Stadt,
    visible: false,
    style: getAdminAreaStyle(Stadt.featureNameProp),
    properties: {
      name: 'Stadt'
    }
  },
  {
    source: vectorSourcesOptions.Bezirk,
    visible: false,
    style: getAdminAreaStyle(Bezirk.featureNameProp),
    properties: {
      name: 'Bezirk'
    }
  },
  {
    source: vectorSourcesOptions.Stadtteil,
    visible: false,
    style: getAdminAreaStyle(Stadtteil.featureNameProp),
    properties: {
      name: 'Stadtteil'
    }
  },
  {
    source: vectorSourcesOptions.StatGebiet,
    visible: false,
    style: getAdminAreaStyle(StatGebiet.featureNameProp),
    properties: {
      name: 'StatGebiet'
    }
  },
  {
    source: vectorSourcesOptions.Baublock,
    visible: false,
    style: getAdminAreaStyle(Baublock.featureNameProp),
    properties: {
      name: 'Baublock'
    },
    minZoom: 13
  }
];

export const getBaseLayers = (): LayerGroup =>
  new LayerGroup({
    layers: [
      ...baseLayersOptions.map(layer =>
        layer.style
          ? new VectorLayer({...layer, source: new VectorSource(layer.source)})
          : new TileLayer({...layer, source: new TileWMS(layer.source)})
      ),
      new TileLayer({
        ...heatingLayerOptions,
        source: new TileWMS(heatingLayerOptions.source)
      })
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
