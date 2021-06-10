<template>
  <div id="map">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Map from 'ol/Map';
import View from 'ol/View';
import { Coordinate } from 'ol/coordinate';
import GML3 from 'ol/format/GML3';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import 'ol/ol.css';

interface MyVectorSource extends VectorSource {
  setLoaderForWFSWithFlippedCoordinates: () => void;
}

(VectorSource.prototype as MyVectorSource).setLoaderForWFSWithFlippedCoordinates = function () {
  this.setLoader((extent) => {
    fetch(this.getUrl() as string)
      .then(response => response.text())
      .then(text => {
        this.addFeatures((this.getFormat() as GML3).readFeatures(text).map(f => {
          const geom = f.getGeometry()
          if (geom) {
            // flip XY
            let coords = (geom as any).flatCoordinates as Coordinate;
            coords = coords.map((_, i) => [coords[i/3*3+1], coords[i/3*3-1], _][i%3]);
            (geom as any).flatCoordinates = coords;
          }
          return f;
        }));
      })
      .catch(() => {
        this.removeLoadedExtent(extent);
      });
  });
}

@Component
export default class MapComponent extends Vue {
  @Prop() bezirkeVisible = false;
  @Prop() stadtteileVisible = false;
  @Prop() statGebieteVisible = false;

  sources: {[key: string]: MyVectorSource};
  layers: {[key: string]: Layer};
  map!: Map;

  constructor() {
    super();

    this.sources = {
      "Bezirke": new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:4326&typename=app:bezirke"
      }) as MyVectorSource,
      "Stadtteile": new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:4326&typename=app:stadtteile"
      }) as MyVectorSource,
      "StatGebiete": new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Statistische_Gebiete?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:4326&typename=app:statistische_gebiete"
      }) as MyVectorSource
    };
    this.sources.Bezirke.setLoaderForWFSWithFlippedCoordinates();
    this.sources.Stadtteile.setLoaderForWFSWithFlippedCoordinates();
    this.sources.StatGebiete.setLoaderForWFSWithFlippedCoordinates();

    this.layers = {
      "Geobasiskarten": new TileLayer({
        source: new TileWMS({
          url: "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_SG",
          params: {
            LAYERS: "M2500_schwarzgrau,M5000_schwarzgrau,M10000_schwarzgrau,M20000_schwarzgrau,M40000_schwarzgrau,M60000_schwarzgrau,M100000_schwarzgrau,M125000_schwarzgrau"
          },
          projection: "EPSG:25832"
        })
      }),
      "Solaratlas": new TileLayer({
        source: new TileWMS({
          url: "https://geodienste.hamburg.de/HH_WMS_Solaratlas",
          params: {
            LAYERS: "ek_pv"
          },
          projection: "EPSG:25832"
        })
      }),
      "Bezirke": new VectorLayer({
        source: this.sources.Bezirke,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0, 120, 255, 1.0)',
            width: 2,
          })
        }),
        visible: false
      }),
      "Stadtteile": new VectorLayer({
        source: this.sources.Stadtteile,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0, 120, 255, 1.0)',
            width: 2,
          })
        }),
        visible: false
      }),
      "StatGebiete": new VectorLayer({
        source: this.sources.StatGebiete,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0, 120, 255, 1.0)',
            width: 2,
          })
        }),
        visible: false
      })
    };
  }

  @Watch('bezirkeVisible')
  onToggleBezirke(value: boolean): void {
    this.layers.Bezirke.setVisible(value);
  }

  @Watch('stadtteileVisible')
  onToggleStadtteile(value: boolean): void {
    this.layers.Stadtteile.setVisible(value);
  }

  @Watch('statGebieteVisible')
  onToggleStatGebiete(value: boolean): void {
    this.layers.StatGebiete.setVisible(value);
  }

  mounted(): void {
    this.map = new Map({
      target: 'map',
      layers: Object.values(this.layers),
      view: new View({
        projection: 'EPSG:4326',
        zoom: 12,
        center: [10.0, 53.55]
      })
    })
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
