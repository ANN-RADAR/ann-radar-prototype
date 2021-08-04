<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">Solar</div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center heading">ANN RADAR</div>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        style="display: flex; flex-direction: column; height: 100%; padding: 0"
      >
        <v-tabs v-model="tab">
          <v-tab>Potenzial</v-tab>
          <v-tab>Strategie</v-tab>
          <v-tab>Stakeholder</v-tab>
          <v-tab>Urban Data</v-tab>
          <v-tab>Governance</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="height: 100%">
          <v-tab-item style="flex-grow: 1">
            <v-container
              fluid
              style="display: flex; flex-direction: column; height: 100%"
            >
              <v-row style="flex-grow: 1">
                <v-col cols="8">
                  <MapComponent
                    :layerVisibility="mapLayers.reduce((obj, layer) => {
                      obj[layer.name] = layer.visible;
                      return obj;
                    }, {})"
                    :adminLayerVisibility="{
                      'Bezirke': areaUnit === 'Bezirk',
                      'Stadtteile': areaUnit === 'Stadtteil',
                      'StatGebiete': areaUnit === 'StatGebiet',
                      'Baublöcke': areaUnit === 'Baublock'
                    }"
                    @adminAreasSelected="onAdminAreasSelected($event)"
                  />
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-title>Layer</v-card-title>
                    <v-card-text>
                      <v-checkbox
                        v-for="layer in mapLayers"
                        :key="layer.name"
                        v-model="layer.visible"
                        :label="layer.title"
                        style="margin-top: 0"
                      ></v-checkbox>
                    </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-title>Gebiete inspizieren</v-card-title>
                    <v-card-text>
                      <v-sheet>
                        <v-btn
                          :color="areaUnit === 'Bezirk' ? 'primary' : ''"
                          @click="areaUnit = areaUnit != 'Bezirk' ? 'Bezirk' : ''"
                        >
                          Bezirke
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'Stadtteil' ? 'primary' : ''"
                          @click="areaUnit = areaUnit != 'Stadtteil' ? 'Stadtteil' : ''"
                        >
                          Stadtteile
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'StatGebiet' ? 'primary' : ''"
                          @click="areaUnit = areaUnit != 'StatGebiet' ? 'StatGebiet' : ''"
                        >
                          Stat. Gebiete
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'Baublock' ? 'primary' : ''"
                          @click="areaUnit = areaUnit != 'Baublock' ? 'Baublock' : ''"
                        >
                          Baublöcke
                        </v-btn>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'Bezirk'">
                        <div style="margin: 10px; font-size: 120%">
                          <span v-if="selectedBezirke.length">
                            {{ selectedBezirke.length }} Bezirke ausgewählt
                          </span>
                          <span v-else>
                            Nichts ausgewählt
                          </span>
                        </div>
                        <v-btn
                          v-if="selectedBezirke.length"
                          style="margin-bottom: 20px"
                        >
                          Auswahl speichern
                        </v-btn>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'Stadtteil'">
                        <div style="margin: 10px; font-size: 120%">
                          <span v-if="selectedStadtteile.length">
                            {{ selectedStadtteile.length }} Stadtteile ausgewählt
                          </span>
                          <span v-else>
                            Nichts ausgewählt
                          </span>
                        </div>
                        <v-btn
                          v-if="selectedStadtteile.length"
                          style="margin-bottom: 20px"
                        >
                          Auswahl speichern
                        </v-btn>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'StatGebiet'">
                        <div style="margin: 10px; font-size: 120%">
                          <span v-if="selectedStatGebiete.length">
                            {{ selectedStatGebiete.length }} statistische Gebiete ausgewählt
                          </span>
                          <span v-else>
                            Nichts ausgewählt
                          </span>
                        </div>
                        <v-btn
                          v-if="selectedStatGebiete.length"
                          style="margin-bottom: 20px"
                        >
                          Auswahl speichern
                        </v-btn>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'Baublock'">
                        <div style="margin: 10px; font-size: 120%">
                          <span v-if="selectedBaublöcke.length">
                            {{ selectedBaublöcke.length }} Baublöcke ausgewählt
                          </span>
                          <span v-else>
                            Nichts ausgewählt
                          </span>
                        </div>
                        <v-btn
                          v-if="selectedBaublöcke.length"
                          style="margin-bottom: 20px"
                        >
                          Auswahl speichern
                        </v-btn>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'Bezirk'">
                        <div
                          v-for="feature in selectedBezirke"
                          :key="feature.ol_uid"
                        >
                          <h3>{{ feature.get("bezirk_name") }}</h3>
                          <p v-if="getBezirkData(feature)">
                            Jährliches Solarpotential: {{ getBezirkData(feature).MWh_a }} MWh/a
                          </p>
                        </div>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'Stadtteil'">
                        <div
                          v-for="feature in selectedStadtteile"
                          :key="feature.ol_uid"
                        >
                          <h3>{{ feature.get("stadtteil_name") }}</h3>
                          <p v-if="getStadtteilData(feature)">
                            Jährliches Solarpotential: {{ getStadtteilData(feature).MWh_a }} MWh/a
                          </p>
                        </div>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'StatGebiet'">
                        <div
                          v-for="feature in selectedStatGebiete"
                          :key="feature.ol_uid"
                        >
                          <h3>
                            Nr. {{ feature.get("statgebiet") }}
                          </h3>
                          <p v-if="getStatGebietData(feature)">
                            {{ getStatGebietData(feature).AnzFlur }} Flurstücke<br>
                            Mittlere Flurstückgröße: {{ getStatGebietData(feature).mttlFlur }} m²<br>
                          </p>
                        </div>
                      </v-sheet>
                      <v-sheet v-if="areaUnit === 'Baublock'">
                        <div
                          v-for="feature in selectedBaublöcke"
                          :key="feature.ol_uid"
                        >
                          <h3>
                            Nr. {{ feature.get("baublockbezeichnung") }}
                          </h3>
                          <p v-if="getBaublockData(feature)">
                            {{ getBaublockData(feature).Anz_Fl }} Flurstücke<br>
                            Jährliches Solarpotential: {{ getBaublockData(feature).p_st_mwh_a }} MWh/a<br>
                          </p>
                        </div>
                      </v-sheet>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Feature from "ol/Feature";
import { Component, Vue } from "vue-property-decorator";

import MapComponent from "./components/MapComponent.vue";
import BezirkeData from "./data/solarflächenpotenzial_bezirke.json";
import StadtteileData from "./data/solarflächenpotenzial_stadtteile.json";
import StatGebieteData from "./data/statistische_gebiete.json";
import BaublöckeData from "./data/baublöcke.json";
import { Baublock, Bezirk, Stadtteil, StatGebiet } from "./typings";

@Component({
  components: {
    MapComponent
  }
})
export default class App extends Vue {
  tab = 0;
  areaUnit = "";
  selectedBezirke: Feature[] = [];
  selectedStadtteile: Feature[] = [];
  selectedStatGebiete: Feature[] = [];
  selectedBaublöcke: Feature[] = [];
  mapLayers = [
    {
      name: "Geobasiskarten",
      title: "Geobasiskarten (schwarz/grau)",
      visible: true,
    },
    {
      name: "Solaratlas",
      title: "Solaratlas",
      visible: false,
    }
  ];

  mounted(): void {
    this.areaUnit = "Bezirk";
  }

  onAdminAreasSelected(event: { [key: string]: Feature[] }): void {
    if (Object.hasOwnProperty.call(event, "Bezirke")) {
      this.selectedBezirke = event.Bezirke;
    }
    if (Object.hasOwnProperty.call(event, "Stadtteile")) {
      this.selectedStadtteile = event.Stadtteile;
    }
    if (Object.hasOwnProperty.call(event, "StatGebiete")) {
      this.selectedStatGebiete = event.StatGebiete;
    }
    if (Object.hasOwnProperty.call(event, "Baublöcke")) {
      this.selectedBaublöcke = event.Baublöcke;
    }
  }

  getBezirkData(feature: Feature): Bezirk | undefined {
    return BezirkeData.find(object => object.Bezirk === feature.get("bezirk"));
  }

  getStadtteilData(feature: Feature): Stadtteil | undefined {
    return StadtteileData.find(object => object.Stadtteil === feature.get("stadtteil_nummer"));
  }

  getStatGebietData(feature: Feature): StatGebiet | undefined {
    return StatGebieteData.find(object => object.STATGEB.toString() === feature.get("statgebiet"));
  }

  getBaublockData(feature: Feature): Baublock | undefined {
    return BaublöckeData.find(object => object.BBZ.toString() === feature.get("baublockbezeichnung"));
  }
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.heading {
  font-size: 140%;
}
</style>
