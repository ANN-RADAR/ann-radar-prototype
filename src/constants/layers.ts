import {Baublock} from '@/models/Baublock';
import {Bezirk} from '@/models/Bezirk';
import {Stadt} from '@/models/Stadt';
import {Stadtteil} from '@/models/Stadtteil';
import {StatGebiet} from '@/models/StatGebiet';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, {StyleFunction} from 'ol/style/Style';
import Text from 'ol/style/Text';
import {tileSources, vectorSources} from './sources';

export const thematicLayers = [
  {
    name: 'Solaratlas',
    visible: false
  },
  {
    name: 'Schulen',
    visible: false
  },
  {
    name: 'Stadtteilkultur',
    visible: false
  },
  {
    name: 'Soziale Infrastruktur',
    visible: false
  },
  {
    name: 'Bauen und Wohnen',
    visible: false
  },
  {
    name: 'RISE-Fördergebiete',
    visible: false
  },
  {
    name: 'Sozialmonitoring 2020',
    visible: false
  }
];

export const mapStyleLayers = [
  {
    properties: {
      name: 'farbig'
    },
    visible: true,
    source: tileSources.HH_WMS_Geobasiskarten
  },
  {
    properties: {
      name: 'grau-blau'
    },
    visible: false,
    source: tileSources.HH_WMS_Geobasiskarten_GB
  },
  {
    properties: {
      name: 'schwarz-grau'
    },
    visible: false,
    source: tileSources.HH_WMS_Geobasiskarten_SG
  }
];

const getAdminAreaStyle =
  (layerName: string, textAttr: string): StyleFunction =>
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
          text: new Text({
            font: '16px Arial',
            text: feature.get(textAttr),
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({color: '#eee', width: 4})
          })
        });

const adminAreaLayers = [
  {
    source: vectorSources.Stadt,
    visible: false,
    style: getAdminAreaStyle('Stadt', Stadt.featureNameProp),
    properties: {
      name: 'Stadt'
    }
  },
  {
    source: vectorSources.Bezirk,
    visible: false,
    style: getAdminAreaStyle('Bezirk', Bezirk.featureNameProp),
    properties: {
      name: 'Bezirk'
    }
  },
  {
    source: vectorSources.Stadtteil,
    visible: false,
    style: getAdminAreaStyle('Stadtteil', Stadtteil.featureNameProp),
    properties: {
      name: 'Stadtteil'
    }
  },
  {
    source: vectorSources.StatGebiet,
    visible: false,
    style: getAdminAreaStyle('StatGebiet', StatGebiet.featureNameProp),
    properties: {
      name: 'StatGebiet'
    }
  },
  {
    source: vectorSources.Baublock,
    visible: false,
    style: getAdminAreaStyle('Baublock', Baublock.featureNameProp),
    properties: {
      name: 'Baublock'
    },
    minZoom: 13
  }
];

export const getMapStyleLayers = (): LayerGroup =>
  new LayerGroup({
    layers: mapStyleLayers.map(layer => new TileLayer(layer))
  });

export const getAdminAreaLayers = (): LayerGroup =>
  new LayerGroup({
    layers: adminAreaLayers.map(
      layer =>
        new VectorLayer({
          ...layer
        })
    )
  });
