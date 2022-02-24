import {GeoJSON} from 'ol/format';
import GML3 from 'ol/format/GML3';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {Options as VectorSourceOptions} from 'ol/source/Vector';

export const tileSourcesOptions: Record<string, TileSourceOptions> = {
  HH_WMS_Waermekataster_Waermebedarf: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Waermekataster_Waermebedarf',
    params: {
      LAYERS: 'nw_spez_geb_unsaniert'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Geobasiskarten: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten',
    params: {
      LAYERS: 'Geobasiskarten_farbig'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Geobasiskarten_GB: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB',
    params: {
      LAYERS: 'HH_WMS_Geobasiskarten_GB'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Geobasiskarten_SG: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_SG',
    params: {
      LAYERS: 'HH_WMS_Geobasiskarten_SG'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Solaratlas: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Solaratlas',
    params: {
      LAYERS: 'ek_pv'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Schulen: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Schulen',
    params: {
      LAYERS: 'hh_schulen_dwh'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Oeffentliche_Bibliotheken: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Oeffentliche_Bibliotheken',
    params: {
      LAYERS: 'oeffentliche_bibs'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Freiwilliges_Engagement: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Freiwilliges_Engagement',
    params: {
      LAYERS: 'mehrgenerationenhaeuser'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Familien_Angebote: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Familien_Angebote',
    params: {
      LAYERS: 'eltern_kind_zentrum,kinder_familienzentrum'
    },
    projection: 'EPSG:25832'
  },
  'HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe': {
    url: 'https://geodienste.hamburg.de/HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe',
    params: {
      LAYERS: 'begleitung_kinder,schulbezogene_angebote'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Jugend_Aktiv_Plus: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Jugend_Aktiv_Plus',
    params: {
      LAYERS: 'jugend_aktiv_plus'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_KitaEinrichtung: {
    url: 'https://geodienste.hamburg.de/HH_WMS_KitaEinrichtung',
    params: {
      LAYERS: 'KitaEinrichtungen'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Wohnungsbauprojekte: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Wohnungsbauprojekte',
    params: {
      LAYERS: 'projekte'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_Wohnbauflaechenpotenziale: {
    url: 'https://geodienste.hamburg.de/HH_WMS_Wohnbauflaechenpotenziale',
    params: {
      LAYERS: 'hh_wohnbauflaechenpotentiale'
    },
    projection: 'EPSG:25832'
  },
  HH_WMS_RISE_FG: {
    url: 'https://geodienste.hamburg.de/HH_WMS_RISE_FG',
    params: {
      LAYERS: 'rise_fg'
    },
    projection: 'EPSG:25832'
  }
};

export const vectorSourcesOptions: Record<string, VectorSourceOptions> = {
  Stadt: {
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=landesgrenze'
  },
  Bezirk: {
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=bezirke'
  },
  Stadtteil: {
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=stadtteile'
  },
  StatGebiet: {
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Statistische_Gebiete?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=statistische_gebiete'
  },
  Baublock: {
    format: new GML3(),
    url: 'https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=baubloecke'
  },
  Sozialmonitoring: {
    format: new GeoJSON(),
    url: 'data/Sozialmonitoring2020.json'
  },
  SolarCoverageRate: {
    format: new GeoJSON(),
    url: 'https://storage.googleapis.com/ann-radar-data/solar_coverage_rate.json'
  }
};
