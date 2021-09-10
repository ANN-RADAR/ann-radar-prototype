<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { AdminArea, Baublock, Bezirk, Stadt, Stadtteil, StatGebiet } from "@/typings";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import { GeoJSON } from "ol/format";
import GML3 from "ol/format/GML3";
import { Layer, Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import "ol/ol.css";
import { register } from 'ol/proj/proj4';
import { TileWMS, Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style, Text } from "ol/style";
import { StyleFunction } from "ol/style/Style";
import proj4 from "proj4";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

// projection for UTM zone 32N
proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

@Component
export default class MapComponent extends Vue {
  @Prop() layerVisibility!: {[name: string]: boolean};
  @Prop() adminLayerVisibility!: {[name: string]: boolean};
  @Prop() selectedAdminAreas!: {[name: string]: AdminArea[]};

  sources: { [key: string]: VectorSource };
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
      Stadt: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=landesgrenze"
      }),
      Bezirke: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=bezirke"
      }),
      Stadtteile: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=stadtteile"
      }),
      StatGebiete: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Statistische_Gebiete?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=statistische_gebiete"
      }),
      Baublöcke: new VectorSource({
        format: new GML3(),
        url: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen?service=WFS&version=1.1.0&request=GetFeature&srsname=EPSG:25832&typename=baubloecke"
      })
    };

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
      Sozialmonitoring: new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "data/Sozialmonitoring2020.json"
        }),
        style: feature => {
          return new Style({
            stroke: new Stroke({
              color: "#fff",
              width: 1
            }),
            fill: new Fill({
              color: ({
                "hoch": "rgba(112, 168, 0, 0.6)",
                "mittel": "rgba(115, 178, 255, 0.6)",
                "niedrig": "rgba(255, 170, 1, 0.6)",
                "sehr niedrig": "rgba(229, 83, 122, 0.6)"
              } as {[key: string]: string})[feature.get("STATUSINDE")] || "rgba(0, 0, 0, 0)"
            })
          });
        }
      }),
      RISE: new TileLayer({
        source: new TileWMS({
          url: "https://geodienste.hamburg.de/HH_WMS_RISE_FG",
          params: {
            LAYERS: "rise_fg"
          },
          projection: "EPSG:25832"
        })
      }),
      Stadt: new VectorLayer({
        source: this.sources.Stadt,
        style: this.getAdminAreaStyleFn("Stadt", "fhh")
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
      }),
      Baublöcke: new VectorLayer({
        source: this.sources.Baublöcke,
        style: this.getAdminAreaStyleFn("Baublöcke", "baublockbezeichnung"),
        minZoom: 13
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

  @Watch("selectedAdminAreas", { deep: true })
  onSelectAreas(list: AdminArea[]): void {
    const adminLevel = this.getVisibleAdminLevel();
    if (!adminLevel) {
      throw new Error("No admin level layer is visible");
    }

    for (const feature of this.sources[adminLevel].getFeatures()) {
      const found = !!list.find(area => {
        const areaId = ({
          Stadt: (area as Stadt).name,
          Bezirke: (area as Bezirk).bezirk,
          Stadtteile: (area as Stadtteil).stadtteil_nummer,
          StatGebiete: (area as StatGebiet).STATGEB,
          Baublöcke: (area as Baublock).BBZ
        } as {[key: string]: string | number})[adminLevel],
        featureId = ({
          Stadt: feature.get("fhh"),
          Bezirke: feature.get("bezirk"),
          Stadtteile: feature.get("stadtteil_nummer"),
          StatGebiete: feature.get("statgebiet"),
          Baublöcke: feature.get("baublockbezeichnung")
        } as {[key: string]: string | number})[adminLevel];
        // no strict comparison, as in some cases we compare numbers to strings
        return featureId == areaId;
      });
      this.setFeatureSelected(adminLevel, feature, found);
    }
  }

  mounted(): void {
    this.map = new Map({
      target: "map",
      layers: Object.values(this.layers),
      view: new View({
        projection: "EPSG:25832",
        zoom: 12,
        minZoom: 9,
        maxZoom: 18,
        center: [565811, 5933977]
      })
    });

    // Select map features
    this.map.on("click", (evt: MapBrowserEvent) => {
      const coord = this.map.getCoordinateFromPixel(evt.pixel);
      const adminLevel = this.getVisibleAdminLevel();
      if (!adminLevel) {
        throw new Error("No admin level layer is visible");
      }

      for (const feature of this.sources[adminLevel].getFeaturesAtCoordinate(coord)) {
        this.setFeatureSelected(adminLevel, feature, !feature.get("selected"));
      }

      this.emitSelected();
    });
  }

  getVisibleAdminLevel(): string | undefined {
    for (const adminLevel of ["Stadt", "Bezirke", "Stadtteile", "StatGebiete", "Baublöcke"]) {
      if (this.adminLayerVisibility[adminLevel]) {
        return adminLevel;
      }
    }
  }

  setFeatureSelected(adminLevel: string, feature: Feature, selected: boolean): void {
    feature.set("selected", selected);
  }

  emitSelected(): void {
      const event = {
        Stadt: this.sources.Stadt
          .getFeatures()
          .filter(feature => feature.get("selected"))
          .map(feature => feature.get("fhh")),
        Bezirke: this.sources.Bezirke
          .getFeatures()
          .filter(feature => feature.get("selected"))
          .map(feature => feature.get("bezirk")),
        Stadtteile: this.sources.Stadtteile
          .getFeatures()
          .filter(feature => feature.get("selected"))
          .map(feature => feature.get("stadtteil_nummer")),
        StatGebiete: this.sources.StatGebiete
          .getFeatures()
          .filter(feature => feature.get("selected"))
          .map(feature => feature.get("statgebiet")),
        Baublöcke: this.sources.Baublöcke
          .getFeatures()
          .filter(feature => feature.get("selected"))
          .map(feature => feature.get("baublockbezeichnung"))
      };

      this.$emit("selectedAdminAreas", event);
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
