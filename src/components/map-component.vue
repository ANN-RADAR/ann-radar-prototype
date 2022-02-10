<template>
  <div id="map"></div>
</template>

<script lang="ts">
import {Feature, Map, MapBrowserEvent, View} from 'ol';
import Geometry from 'ol/geom/Geometry';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

import LayerGroup from 'ol/layer/Group';
import 'ol/ol.css';
import {register} from 'ol/proj/proj4';
import {TileWMS, Vector as VectorSource} from 'ol/source';
import {Fill, Stroke, Style, Text} from 'ol/style';
import {StyleFunction} from 'ol/style/Style';
import proj4 from 'proj4';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

import {AdminLevelUnit} from '@/types/admin-levels';
import {adminLevelClassMap} from '../views/category-solar.vue';
import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

import {tileSources, vectorSources} from '../constants/sources';

// projection for UTM zone 32N
proj4.defs(
  'EPSG:25832',
  '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
register(proj4);

@Component
export default class MapComponent extends Vue {
  @Prop() layerVisibility!: {[name: string]: boolean};
  @Prop() adminLayerVisibility!: {[name: string]: boolean};
  @Prop() selectedAdminAreas!: {[name: string]: AdminLevelUnit[]};

  layers: {
    [key: string]:
      | TileLayer<TileWMS>
      | VectorLayer<VectorSource<Geometry>>
      | LayerGroup;
  };
  map!: Map;

  getAdminAreaStyleFn(layerName: string, textAttr: string): StyleFunction {
    return feature =>
      this.adminLayerVisibility[layerName]
        ? feature.get('selected')
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
            })
        : new Style();
  }

  constructor() {
    super();

    this.layers = {
      farbig: new TileLayer({
        visible: this.layerVisibility['farbig'],
        source: tileSources.HH_WMS_Geobasiskarten
      }),
      'grau-blau': new TileLayer({
        visible: this.layerVisibility['grau-blau'],
        source: tileSources.HH_WMS_Geobasiskarten_GB
      }),
      'schwarz-grau': new TileLayer({
        visible: this.layerVisibility['schwarz-grau'],
        source: tileSources.HH_WMS_Geobasiskarten_SG
      }),
      Solaratlas: new TileLayer({
        visible: false,
        source: tileSources.HH_WMS_Solaratlas,
        zIndex: 5
      }),
      Schulen: new TileLayer({
        visible: false,
        source: tileSources.HH_WMS_Schulen,
        zIndex: 9
      }),
      Stadtteilkultur: new LayerGroup({
        layers: [
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_Oeffentliche_Bibliotheken,
            zIndex: 9
          })
        ]
      }),
      'Soziale Infrastruktur': new LayerGroup({
        layers: [
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_Freiwilliges_Engagement,
            zIndex: 9
          }),
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_Familien_Angebote,
            zIndex: 9
          }),
          new TileLayer({
            visible: false,
            source:
              tileSources[
                'HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe'
              ],
            zIndex: 9
          }),
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_Jugend_Aktiv_Plus,
            zIndex: 9
          }),
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_KitaEinrichtung,
            zIndex: 9
          })
        ]
      }),
      'Bauen und Wohnen': new LayerGroup({
        layers: [
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_Wohnungsbauprojekte,
            zIndex: 9
          }),
          new TileLayer({
            visible: false,
            source: tileSources.HH_WMS_Wohnbauflaechenpotenziale,
            zIndex: 9
          })
        ]
      }),
      'RISE-Fördergebiete': new TileLayer({
        visible: false,
        source: tileSources.HH_WMS_RISE_FG,
        zIndex: 7
      }),
      'Sozialmonitoring 2020': new VectorLayer({
        visible: false,
        source: vectorSources.Sozialmonitoring,
        style: feature => {
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
      }),
      Stadt: new VectorLayer({
        source: vectorSources.Stadt,
        style: this.getAdminAreaStyleFn('Stadt', Stadt.featureNameProp)
      }),
      Bezirk: new VectorLayer({
        source: vectorSources.Bezirk,
        style: this.getAdminAreaStyleFn('Bezirk', Bezirk.featureNameProp)
      }),
      Stadtteil: new VectorLayer({
        source: vectorSources.Stadtteil,
        style: this.getAdminAreaStyleFn('Stadtteil', Stadtteil.featureNameProp)
      }),
      StatGebiet: new VectorLayer({
        source: vectorSources.StatGebiet,
        style: this.getAdminAreaStyleFn(
          'StatGebiet',
          StatGebiet.featureNameProp
        )
      }),
      Baublock: new VectorLayer({
        source: vectorSources.Baublock,
        style: this.getAdminAreaStyleFn('Baublock', Baublock.featureNameProp),
        minZoom: 13
      })
    };
  }

  @Watch('layerVisibility', {deep: true})
  onLayerSwitch(map: {[name: string]: boolean}): void {
    for (const [layerName, visible] of Object.entries(map)) {
      this.layers[layerName].setVisible(visible);
    }
  }

  /**
   * Admin layers take a different approach towards visibility (as opposed to using
   * the "visible" property) because we want them to load eagerly, which requires
   * to set visible=true.
   * Instead, the style function checks whether the features should get an invisible
   * style or not.
   */
  @Watch('adminLayerVisibility', {deep: true})
  onAdminLayerSwitch(map: {[name: string]: boolean}): void {
    for (const layerName of Object.keys(map)) {
      // Trigger redrawing so the style function is reevaluated
      (this.layers[layerName] as VectorLayer<VectorSource<Geometry>>)
        .getSource()
        .changed();
    }
  }

  @Watch('selectedAdminAreas', {deep: true})
  onSelectAreas(list: AdminLevelUnit[]): void {
    const adminLevel = this.getVisibleAdminLevel();
    if (!adminLevel) {
      return;
    }

    for (const feature of vectorSources[adminLevel].getFeatures()) {
      const found = !!list.find(
        area => area.getFeatureId(feature) === area.getId()
      );
      this.setFeatureSelected(feature, found);
    }
  }

  mounted(): void {
    this.map = new Map({
      target: 'map',
      layers: Object.values(this.layers),
      view: new View({
        projection: 'EPSG:25832',
        zoom: 12,
        minZoom: 9,
        maxZoom: 18,
        center: [565811, 5933977]
      })
    });

    // Select map features
    this.map.on('click', (evt: MapBrowserEvent<UIEvent>) => {
      const coord = this.map.getCoordinateFromPixel(evt.pixel);
      const adminLevel = this.getVisibleAdminLevel();
      if (!adminLevel) {
        return;
      }

      for (const feature of vectorSources[adminLevel].getFeaturesAtCoordinate(
        coord
      )) {
        this.setFeatureSelected(feature, !feature.get('selected'));
      }

      this.emitSelected();
    });

    // Update the legend
    this.map.on('postcompose', () => {
      const legendUrls = Object.entries(this.layers).reduce(
        (obj, [key, layer]) => {
          const sources =
            layer instanceof LayerGroup
              ? layer.getLayersArray().map(l => l.getSource())
              : [layer.getSource()];
          obj[key] = sources
            .filter(source => source instanceof TileWMS)
            .map(source => (source as TileWMS).getLegendUrl() as string);
          return obj;
        },
        {} as {[key: string]: string[]}
      );

      this.$emit('legendUrls', legendUrls);
    });
  }

  getVisibleAdminLevel(): string | undefined {
    return Object.entries(this.adminLayerVisibility).find(
      entry => entry[1]
    )?.[0];
  }

  setFeatureSelected(feature: Feature<Geometry>, selected: boolean): void {
    feature.set('selected', selected);
  }

  emitSelected(): void {
    const event = Object.entries(adminLevelClassMap).reduce(
      (obj, [key, type]) => {
        obj[key] = vectorSources[key]
          .getFeatures()
          .filter(feature => feature.get('selected'))
          .map(feature => feature.get(type.featureIdProp));
        return obj;
      },
      {} as {[key: string]: string[]}
    );

    this.$emit('selectedAdminAreas', event);
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
