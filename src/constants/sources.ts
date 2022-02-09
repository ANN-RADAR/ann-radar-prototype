import {GeoJSON} from 'ol/format';
import Geometry from 'ol/geom/Geometry';
import GML3 from 'ol/format/GML3';
import {TileWMS, Vector as VectorSource} from 'ol/source';

export const tileSources: {[key: string]: TileWMS} = {
  HH_WMS_Geobasiskarten: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten',
    params: {
      LAYERS: 'Geobasiskarten_farbig'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Geobasiskarten_GB: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB',
    params: {
      LAYERS: 'HH_WMS_Geobasiskarten_GB'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Geobasiskarten_SG: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_SG',
    params: {
      LAYERS: 'HH_WMS_Geobasiskarten_SG'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Solaratlas: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Solaratlas',
    params: {
      LAYERS: 'ek_pv'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Schulen: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Schulen',
    params: {
      LAYERS: 'hh_schulen_dwh'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Oeffentliche_Bibliotheken: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Oeffentliche_Bibliotheken',
    params: {
      LAYERS: 'oeffentliche_bibs'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Freiwilliges_Engagement: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Freiwilliges_Engagement',
    params: {
      LAYERS: 'mehrgenerationenhaeuser'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Familien_Angebote: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Familien_Angebote',
    params: {
      LAYERS: 'eltern_kind_zentrum,kinder_familienzentrum'
    },
    projection: 'EPSG:25832'
  }),
  'HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe': new TileWMS(
    {
      url: 'https://geodienste.hamburg.de/HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe',
      params: {
        LAYERS: 'begleitung_kinder,schulbezogene_angebote'
      },
      projection: 'EPSG:25832'
    }
  ),
  HH_WMS_Jugend_Aktiv_Plus: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Jugend_Aktiv_Plus',
    params: {
      LAYERS: 'jugend_aktiv_plus'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_KitaEinrichtung: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_KitaEinrichtung',
    params: {
      LAYERS: 'KitaEinrichtungen'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Wohnungsbauprojekte: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Wohnungsbauprojekte',
    params: {
      LAYERS: 'projekte'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_Wohnbauflaechenpotenziale: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_Wohnbauflaechenpotenziale',
    params: {
      LAYERS: 'hh_wohnbauflaechenpotentiale'
    },
    projection: 'EPSG:25832'
  }),
  HH_WMS_RISE_FG: new TileWMS({
    url: 'https://geodienste.hamburg.de/HH_WMS_RISE_FG',
    params: {
      LAYERS: 'rise_fg'
    },
    projection: 'EPSG:25832'
  })
};

export const vectorSources: {[key: string]: VectorSource<Geometry>} = {
  Stadt: new VectorSource({
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=landesgrenze'
  }),
  Bezirk: new VectorSource({
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=bezirke'
  }),
  Stadtteil: new VectorSource({
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=stadtteile'
  }),
  StatGebiet: new VectorSource({
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Statistische_Gebiete?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=statistische_gebiete'
  }),
  Baublock: new VectorSource({
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=baubloecke'
  }),
  Sozialmonitoring: new VectorSource({
    format: new GeoJSON(),
    url: 'data/Sozialmonitoring2020.json'
  })
};
