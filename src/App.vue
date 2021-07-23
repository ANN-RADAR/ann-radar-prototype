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
                      'StatGebiete': areaUnit === 'StatGebiet'
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
                      <v-btn
                        :color="areaUnit === 'Bezirk' ? 'primary' : ''"
                        @click="areaUnit = areaUnit != 'Bezirk' ? 'Bezirk' : ''"
                      >
                        Bezirk
                      </v-btn>
                      <v-btn
                        :color="areaUnit === 'Stadtteil' ? 'primary' : ''"
                        @click="areaUnit = areaUnit != 'Stadtteil' ? 'Stadtteil' : ''"
                      >
                        Stadtteil
                      </v-btn>
                      <v-btn
                        :color="areaUnit === 'StatGebiet' ? 'primary' : ''"
                        @click="areaUnit = areaUnit != 'StatGebiet' ? 'StatGebiet' : ''"
                      >
                        Stat. Gebiet
                      </v-btn>
                    </v-card-text>
                  </v-card>
                  <div v-if="areaUnit === 'Bezirk'">
                    <v-card
                      v-for="feature in selectedBezirke"
                      :key="feature.ol_uid"
                    >
                      <v-card-title>
                        {{ feature.get("bezirk_name") }}
                      </v-card-title>
                      <v-card-text v-if="getBezirkData(feature)">
                        Jährliches Solarpotential: {{ getBezirkData(feature).MWh_a }} MWh/a
                      </v-card-text>
                    </v-card>
                  </div>
                  <div v-if="areaUnit === 'Stadtteil'">
                    <v-card
                      v-for="feature in selectedStadtteile"
                      :key="feature.ol_uid"
                    >
                      <v-card-title>
                        {{ feature.get("stadtteil_name") }}
                      </v-card-title>
                      <v-card-text v-if="getStadtteilData(feature)">
                        Jährliches Solarpotential: {{ getStadtteilData(feature).MWh_a }} MWh/a
                      </v-card-text>
                    </v-card>
                  </div>
                  <div v-if="areaUnit === 'StatGebiet'">
                    <v-card
                      v-for="feature in selectedStatGebiete"
                      :key="feature.ol_uid"
                    >
                      <v-card-title>
                        {{ feature.get("statgebiet") }}
                      </v-card-title>
                      <v-card-text> </v-card-text>
                    </v-card>
                  </div>
                  <div>
                    <v-card>
                      <v-card-text>
                        <div v-if="selectedBezirke.length + selectedStadtteile.length + selectedStatGebiete.length === 0">
                          Nichts ausgewählt
                        </div>
                        <div v-else>
                          <div v-if="areaUnit === 'Bezirk'">
                            {{ selectedBezirke.length }} Bezirke ausgewählt
                            </div>
                          <div v-if="areaUnit === 'Stadtteil'">
                            {{ selectedStadtteile.length }} Stadtteile ausgewählt
                          </div>
                          <div v-if="areaUnit === 'StatGebiet'">
                            {{ selectedStatGebiete.length }} statistische Gebiete ausgewählt
                          </div>
                          <v-btn>
                            Auswahl speichern
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
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

interface BezirkData {
  Bezirk: string;
  MWh_a: number;
}

interface StadtteilData {
  Stadtteil: string;
  MWh_a: number;
}

@Component({
  components: {
    MapComponent,
  },
})
export default class App extends Vue {
  tab = 0;
  areaUnit = "";
  selectedBezirke: Feature[] = [];
  selectedStadtteile: Feature[] = [];
  selectedStatGebiete: Feature[] = [];
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
    },
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
  }

  getBezirkData(feature: Feature): BezirkData | undefined {
    return BezirkeData.find(
      (item: BezirkData) => item.Bezirk === feature.get("bezirk")
    );
  }

  getStadtteilData(feature: Feature): StadtteilData | undefined {
    return StadtteileData.find(
      (item: StadtteilData) => item.Stadtteil === feature.get("stadtteil_nummer")
    );
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
