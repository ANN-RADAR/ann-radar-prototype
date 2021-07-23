<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Feature, Map, MapBrowserEvent, View } from "ol";
import GML3 from "ol/format/GML3";
import { Layer, Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import "ol/ol.css";
import { TileWMS, Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style, Text } from "ol/style";
import { StyleFunction } from "ol/style/Style";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

interface MyVectorSource extends VectorSource {
  setLoaderForWFSWithFlippedCoordinates: () => void;
}

(VectorSource.prototype as MyVectorSource).setLoaderForWFSWithFlippedCoordinates = function () {
  this.setLoader(extent => {
    fetch(this.getUrl() as string)
      .then(response => response.text())
      .then(text => {
        this.addFeatures((this.getFormat() as GML3).readFeatures(text).map(f => {
          const geom = f.getGeometry() as unknown as {flatCoordinates: number[]};
          if (geom) {
            // flip XY
            let coords = geom.flatCoordinates;
            coords = coords.map((_, i) => [coords[(i / 3) * 3 + 1], coords[(i / 3) * 3 - 1], _][i % 3]);
            geom.flatCoordinates = coords;
          }
          return f;
        }));
      })
      .catch(() => {
        this.removeLoadedExtent(extent);
      });
  });
};

@Component
export default class MapComponent extends Vue {
  @Prop() layerVisibility!: {[name: string]: boolean};
  @Prop() adminLayerVisibility!: {[name: string]: boolean};

  sources: { [key: string]: MyVectorSource };
  layers: { [key: string]: Layer };
  map!: Map;

  getAdminAreaStyleFn(layerName: string, textAttr: string): StyleFunction {
    return feature => this.adminLayerVisibility[layerName]
      ? feature.get("selected")
        ? new Style({
            stroke: new Stroke({
              color: "#f00",
              width: 2
            }),
            fill: new Fill({
              color: "rgba(255, 0, 0, 0.1)"
            }),
            text: new Text({
              font: "16px Arial",
              text: feature.get(textAttr),
              fill: new Fill({ color: "white" })
            }),
            zIndex: 1
          })
        : new Style({
            stroke: new Stroke({
              color: "rgba(0, 120, 255, 1.0)",
              width: 2
            }),
            text: new Text({
              font: "16px Arial",
              text: feature.get(textAttr),
              fill: new Fill({ color: "white" })
            })
          })
      : new Style();
  }

  constructor() {
    super();

    this.sources = {
      Bezirke: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:4326&typename=app:bezirke"
      }) as MyVectorSource,
      Stadtteile: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:4326&typename=app:stadtteile"
      }) as MyVectorSource,
      StatGebiete: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Statistische_Gebiete?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:4326&typename=app:statistische_gebiete"
      }) as MyVectorSource
    };
    this.sources.Bezirke.setLoaderForWFSWithFlippedCoordinates();
    this.sources.Stadtteile.setLoaderForWFSWithFlippedCoordinates();
    this.sources.StatGebiete.setLoaderForWFSWithFlippedCoordinates();

    this.layers = {
      Geobasiskarten: new TileLayer({
        source: new TileWMS({
          url: "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_SG",
          params: {
            LAYERS: "M2500_schwarzgrau,M5000_schwarzgrau,M10000_schwarzgrau,M20000_schwarzgrau,M40000_schwarzgrau,M60000_schwarzgrau,M100000_schwarzgrau,M125000_schwarzgrau"
          },
          projection: "EPSG:25832"
        })
      }),
      Solaratlas: new TileLayer({
        source: new TileWMS({
          url: "https://geodienste.hamburg.de/HH_WMS_Solaratlas",
          params: {
            LAYERS: "ek_pv"
          },
          projection: "EPSG:25832"
        })
      }),
      Bezirke: new VectorLayer({
        source: this.sources.Bezirke,
        style: this.getAdminAreaStyleFn("Bezirke", "bezirk_name")
      }),
      Stadtteile: new VectorLayer({
        source: this.sources.Stadtteile,
        style: this.getAdminAreaStyleFn("Stadtteile", "stadtteil_name")
      }),
      StatGebiete: new VectorLayer({
        source: this.sources.StatGebiete,
        style: this.getAdminAreaStyleFn("StatGebiete", "statgebiet")
      })
    };
  }

  @Watch("layerVisibility", { deep: true })
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
  @Watch("adminLayerVisibility", { deep: true })
  onAdminLayerSwitch(map: {[name: string]: boolean}): void {
    for (const layerName of Object.keys(map)) {
      // Trigger redrawing so the style function is reevaluated
      (this.layers[layerName] as VectorLayer).getSource().changed();
    }
  }

  mounted(): void {
    this.map = new Map({
      target: "map",
      layers: Object.values(this.layers),
      view: new View({
        projection: "EPSG:4326",
        zoom: 12,
        minZoom: 9,
        maxZoom: 18,
        center: [10.0, 53.55],
      })
    });

    // Select map features
    this.map.on("click", (evt: MapBrowserEvent) => {
      const coord = this.map.getCoordinateFromPixel(evt.pixel);
      const event: { [key: string]: Feature[] } = {};

      for (const adminLevel of ["Bezirke", "Stadtteile", "StatGebiete"]) {
        if (this.adminLayerVisibility[adminLevel]) {
          this.sources[adminLevel].getFeaturesAtCoordinate(coord).forEach(feature => {
            feature.set("selected", !feature.get("selected"));

            if (adminLevel === "Bezirke") {
              // alle Stadtteile des ausgewählten Bezirks werden ausgewählt
              (this.layers.Stadtteile.getSource() as VectorSource)
                .getFeatures()
                .filter(stadtteil => feature.get("bezirk") == stadtteil.get("bezirk"))
                .forEach(stadtteil => {
                  stadtteil.set("selected", feature.get("selected"));
                });
            }
          });
        }

        event[adminLevel] = this.sources[adminLevel]
          .getFeatures()
          .filter(feature => feature.get("selected"));
      }

      this.$emit("adminAreasSelected", event);
    });
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
