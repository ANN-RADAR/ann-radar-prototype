<template>
  <div id="map"></div>
</template>

<script lang="ts">
import {Feature, Map, MapBrowserEvent, View} from 'ol';
import {GeoJSON} from 'ol/format';
import GML3 from 'ol/format/GML3';
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

import {AdminLevelUnit} from '@/typings';
import {adminLevelClassMap} from '../views/category-solar.vue';
import {Baublock} from '../models/Baublock';
import {Bezirk} from '../models/Bezirk';
import {Stadt} from '../models/Stadt';
import {Stadtteil} from '../models/Stadtteil';
import {StatGebiet} from '../models/StatGebiet';

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

  tileSources: {[key: string]: TileWMS};
  vectorSources: {[key: string]: VectorSource<Geometry>};
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

    this.tileSources = {
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
      'HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe':
        new TileWMS({
          url: 'https://geodienste.hamburg.de/HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe',
          params: {
            LAYERS: 'begleitung_kinder,schulbezogene_angebote'
          },
          projection: 'EPSG:25832'
        }),
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

    this.vectorSources = {
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

    this.layers = {
      farbig: new TileLayer({
        source: this.tileSources.HH_WMS_Geobasiskarten
      }),
      'grau-blau': new TileLayer({
        source: this.tileSources.HH_WMS_Geobasiskarten_GB
      }),
      'schwarz-grau': new TileLayer({
        source: this.tileSources.HH_WMS_Geobasiskarten_SG
      }),
      Solaratlas: new TileLayer({
        source: this.tileSources.HH_WMS_Solaratlas,
        zIndex: 5
      }),
      Schulen: new TileLayer({
        source: this.tileSources.HH_WMS_Schulen,
        zIndex: 9
      }),
      Stadtteilkultur: new LayerGroup({
        layers: [
          new TileLayer({
            source: this.tileSources.HH_WMS_Oeffentliche_Bibliotheken,
            zIndex: 9
          })
        ]
      }),
      'Soziale Infrastruktur': new LayerGroup({
        layers: [
          new TileLayer({
            source: this.tileSources.HH_WMS_Freiwilliges_Engagement,
            zIndex: 9
          }),
          new TileLayer({
            source: this.tileSources.HH_WMS_Familien_Angebote,
            zIndex: 9
          }),
          new TileLayer({
            source:
              this.tileSources[
                'HH_WMS_Sozialraeumliche_Angebote_der_Jugend-_und_Familienhilfe'
              ],
            zIndex: 9
          }),
          new TileLayer({
            source: this.tileSources.HH_WMS_Jugend_Aktiv_Plus,
            zIndex: 9
          }),
          new TileLayer({
            source: this.tileSources.HH_WMS_KitaEinrichtung,
            zIndex: 9
          })
        ]
      }),
      'Bauen und Wohnen': new LayerGroup({
        layers: [
          new TileLayer({
            source: this.tileSources.HH_WMS_Wohnungsbauprojekte,
            zIndex: 9
          }),
          new TileLayer({
            source: this.tileSources.HH_WMS_Wohnbauflaechenpotenziale,
            zIndex: 9
          })
        ]
      }),
      'RISE-Fördergebiete': new TileLayer({
        source: this.tileSources.HH_WMS_RISE_FG,
        zIndex: 7
      }),
      'Sozialmonitoring 2020': new VectorLayer({
        source: this.vectorSources.Sozialmonitoring,
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
        source: this.vectorSources.Stadt,
        style: this.getAdminAreaStyleFn('Stadt', Stadt.featureNameProp)
      }),
      Bezirk: new VectorLayer({
        source: this.vectorSources.Bezirk,
        style: this.getAdminAreaStyleFn('Bezirk', Bezirk.featureNameProp)
      }),
      Stadtteil: new VectorLayer({
        source: this.vectorSources.Stadtteil,
        style: this.getAdminAreaStyleFn('Stadtteil', Stadtteil.featureNameProp)
      }),
      StatGebiet: new VectorLayer({
        source: this.vectorSources.StatGebiet,
        style: this.getAdminAreaStyleFn(
          'StatGebiet',
          StatGebiet.featureNameProp
        )
      }),
      Baublock: new VectorLayer({
        source: this.vectorSources.Baublock,
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

    for (const feature of this.vectorSources[adminLevel].getFeatures()) {
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

      for (const feature of this.vectorSources[
        adminLevel
      ].getFeaturesAtCoordinate(coord)) {
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
        obj[key] = this.vectorSources[key]
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
