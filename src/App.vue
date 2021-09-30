<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-btn color="primary">Solar</v-btn>
        <v-btn>Energieeffizienz</v-btn>
        <v-btn>Mobilität</v-btn>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center heading">ANN RADAR</div>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        style="display: flex; flex-direction: column; height: 100%; padding: 0"
      >
        <v-tabs v-model="tab">
          <v-tab>Potential</v-tab>
          <v-tab>Plans</v-tab>
          <v-tab>Stakeholders</v-tab>
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
                <v-col cols="6" style="display: flex; flex-direction: column">
                  <MapComponent
                    :layerVisibility="basemaps.concat(thematicLayers).reduce((obj, layer) => {
                      obj[layer.name] = layer.visible;
                      return obj;
                    }, {})"
                    :adminLayerVisibility="adminLevels.reduce((obj, key) => {
                      obj[key] = areaUnit === key;
                      return obj;
                    }, {})"
                    :selectedAdminAreas="selectedAreas[areaUnit]"
                    @selectedAdminAreas="onAdminAreasSelected($event)"
                    @legendUrls="onLegendUrlsChange($event)"
                  />
                  <v-card>
                    <v-card-text style="max-height: 150px; overflow: auto">
                      <div
                        v-for="layer in thematicLayers.filter(l => l.visible)"
                        :key="layer.name"
                        style="display: grid; grid-template-columns: auto auto"
                      >
                        <img
                          v-for="url in legendUrls[layer.name]"
                          :key="url"
                          :src="url"
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6" v-resize="onResize">
                  <v-card>
                    <v-card-title>Layer</v-card-title>
                    <v-card-text style="max-height: 250px; overflow: auto">
                      <div style="display: grid; grid-template-columns: auto auto">
                        <v-checkbox
                          v-for="layer in thematicLayers"
                          :key="layer.name"
                          v-model="layer.visible"
                          :label="layer.name"
                          style="margin-top: -4px"
                        ></v-checkbox>
                      </div>
                      <v-radio-group
                        v-model="currentBasemap"
                        @change="onBasemapChange()"
                        row
                      >
                        <span style="margin-right: 16px">Hintergrundkarte:</span>
                        <v-radio
                          v-for="layer in basemaps"
                          :key="layer.name"
                          :label="layer.name"
                          :value="layer.name"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-title>Cockpit</v-card-title>
                    <v-card-text>
                      <div
                        v-if="areaUnit === 'StatGebiet' && aggregations.StatGebiet"
                        v-resize="onResize"
                        style="display: flex; justify-content: space-around"
                      >
                        <v-sheet>
                          Flurstücke
                          <div class="kpi">{{ aggregations.StatGebiet.AnzFl }}</div>
                        </v-sheet>
                        <v-sheet>
                          mittl. Flurstückgröße
                          <div class="kpi">{{ Math.round(aggregations.StatGebiet.mittlFl) }}&nbsp;m²</div>
                        </v-sheet>
                        <v-sheet>
                          BGF
                          <div class="kpi">{{ Math.round(aggregations.StatGebiet.BGF) }}&nbsp;m²</div>
                        </v-sheet>
                        <v-sheet>
                          Wohnbaufläche
                          <div class="kpi">{{ Math.round(aggregations.StatGebiet.tatNu_WB_P * 100) / 100 }}&nbsp;%</div>
                        </v-sheet>
                      </div>
                      <div
                        v-if="areaUnit === 'Baublock' && aggregations.Baublock"
                        v-resize="onResize"
                        style="display: flex; justify-content: space-around"
                      >
                        <v-sheet>
                          Flurstücke
                          <div class="kpi">{{ aggregations.Baublock.Anz_Fl }}</div>
                        </v-sheet>
                        <v-sheet>
                          Wohnbaufläche
                          <div class="kpi">{{ Math.round(aggregations.Baublock.tatNu_WB_P * 100) / 100 }}&nbsp;%</div>
                        </v-sheet>
                        <v-sheet>
                          Bevölkerung
                          <div class="kpi">{{ aggregations.Baublock.Bev_Ges }}</div>
                        </v-sheet>
                        <v-sheet>
                          Solarpotenzial
                          <div class="kpi">{{ Math.round(aggregations.Baublock.p_st_mwh_a) }}&nbsp;MWh/a</div>
                        </v-sheet>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-title>Gebiete inspizieren</v-card-title>
                    <v-card-text>
                      <v-sheet>
                        <v-btn
                          :color="areaUnit === 'Stadt' ? 'primary' : ''"
                          @click="areaUnit = areaUnit !== 'Stadt' ? 'Stadt' : ''"
                        >
                          Stadt
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'Bezirk' ? 'primary' : ''"
                          @click="areaUnit = areaUnit !== 'Bezirk' ? 'Bezirk' : ''"
                        >
                          Bezirke
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'Stadtteil' ? 'primary' : ''"
                          @click="areaUnit = areaUnit !== 'Stadtteil' ? 'Stadtteil' : ''"
                        >
                          Stadtteile
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'StatGebiet' ? 'primary' : ''"
                          @click="areaUnit = areaUnit !== 'StatGebiet' ? 'StatGebiet' : ''"
                        >
                          Stat. Gebiete
                        </v-btn>
                        <v-btn
                          :color="areaUnit === 'Baublock' ? 'primary' : ''"
                          @click="areaUnit = areaUnit !== 'Baublock' ? 'Baublock' : ''"
                        >
                          Baublöcke
                        </v-btn>
                      </v-sheet>
                      <v-container class="table-container" ref="tableContainer">
                        <v-data-table
                          v-if="areaUnit === 'Stadt'"
                          v-model="selectedAreas.Stadt"
                          :headers="[
                            { text: 'Stadt', sortable: true, value: 'name' }
                          ]"
                          :items="selectedAreas.Stadt"
                          item-key="name"
                          :show-select="true"
                          :height="tableHeight"
                          :fixed-header="true"
                        ></v-data-table>
                        <v-data-table
                          v-if="areaUnit === 'Bezirk'"
                          v-model="selectedAreas.Bezirk"
                          :headers="[
                            { text: 'Bezirk', sortable: true, value: 'bezirk_name' },
                            { text: 'Solarpotenzial', sortable: true, value: 'MWh_a' }
                          ]"
                          :items="selectedAreas.Bezirk"
                          item-key="bezirk"
                          :show-select="true"
                          :height="tableHeight"
                          :fixed-header="true"
                        >
                          <template v-slot:item.MWh_a="{ item }">
                            <span v-if="item.MWh_a !== undefined">{{ item.MWh_a }}&nbsp;MWh/a</span>
                          </template>
                        </v-data-table>
                        <v-data-table
                          v-if="areaUnit === 'Stadtteil'"
                          v-model="selectedAreas.Stadtteil"
                          :headers="[
                            { text: 'Stadtteil', sortable: true, value: 'stadtteil_name' },
                            { text: 'Solarpotenzial', sortable: true, value: 'MWh_a' }
                          ]"
                          :items="selectedAreas.Stadtteil"
                          item-key="stadtteil_nummer"
                          :show-select="true"
                          :height="tableHeight"
                          :fixed-header="true"
                        >
                          <template v-slot:item.MWh_a="{ item }">
                            <span v-if="item.MWh_a !== undefined">{{ item.MWh_a }}&nbsp;MWh/a</span>
                          </template>
                        </v-data-table>
                        <v-data-table
                          v-if="areaUnit === 'StatGebiet'"
                          v-model="selectedAreas.StatGebiet"
                          :headers="[
                            { text: 'Nr.', sortable: true, value: 'STATGEB' },
                            { text: 'Flurstücke', sortable: true, value: 'AnzFl' },
                            { text: 'mittl. Flurstückgröße', sortable: true, value: 'mittlFl' },
                            { text: 'BGF', sortable: true, value: 'BGF' },
                            { text: 'Wohnbaufläche', sortable: true, value: 'tatNu_WB_P' },
                            { text: 'Soz. Status', sortable: true, value: 'Soz_Status' }
                          ]"
                          :items="selectedAreas.StatGebiet"
                          item-key="STATGEB"
                          :show-select="true"
                          :height="tableHeight"
                          :fixed-header="true"
                        >
                          <template v-slot:item.Shape_Area="{ item }">
                            {{ Math.round(item.Shape_Area / 10000) / 100 }}&nbsp;km²
                          </template>
                          <template v-slot:item.mittlFl="{ item }">
                            {{ Math.round(item.mittlFl) }}&nbsp;m²
                          </template>
                          <template v-slot:item.BGF="{ item }">
                            {{ Math.round(item.BGF) }}&nbsp;m²
                          </template>
                          <template v-slot:item.tatNu_WB_P="{ item }">
                            {{ item.tatNu_WB_P }}&nbsp;%
                          </template>
                        </v-data-table>
                        <v-data-table
                          v-if="areaUnit === 'Baublock'"
                          v-model="selectedAreas.Baublock"
                          :headers="[
                            { text: 'Nr.', sortable: true, value: 'BBZ' },
                            { text: 'Flurstücke', sortable: true, value: 'Anz_Fl' },
                            { text: 'Wohnbaufläche', sortable: true, value: 'tatNu_WB_P' },
                            { text: 'Bevölkerung', sortable: true, value: 'Bev_Ges' },
                            { text: 'Solarpotenzial', sortable: true, value: 'p_st_mwh_a' }
                          ]"
                          :items="selectedAreas.Baublock"
                          item-key="BBZ"
                          :show-select="true"
                          :height="tableHeight"
                          :fixed-header="true"
                        >
                          <template v-slot:item.tatNu_WB_P="{ item }">
                            {{ item.tatNu_WB_P }}&nbsp;%
                          </template>
                          <template v-slot:item.p_st_mwh_a="{ item }">
                            <span v-if="item.p_st_mwh_a !== undefined">{{ item.p_st_mwh_a }}&nbsp;MWh/a</span>
                          </template>
                        </v-data-table>
                      </v-container>
                      <!-- <v-sheet
                        v-for="adminLevel in adminLevels"
                        :key="adminLevel"
                      >
                        <SaveDialog
                          v-if="areaUnit === adminLevel && selectedAreas[adminLevel].length"
                          :selected-areas="selectedAreas[adminLevel]"
                          :type="areaUnit"
                          @saveselection="addSelection($event)"
                        ></SaveDialog>
                      </v-sheet> -->
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
import { Component, Vue, Watch } from "vue-property-decorator";

import { AdminLevelKey, AdminLevelUnit, Selection } from "@/typings";
import MapComponent from "./components/MapComponent.vue";
import SaveDialog from "./components/SaveDialog.vue";
import BezirkData from "./data/bezirke.json";
import StadtteilData from "./data/stadtteile.json";
import StatGebietData from "./data/statistische_gebiete.json";
import BaublockData from "./data/baublöcke.json";
import { Baublock } from  "./models/Baublock";
import { Bezirk } from  "./models/Bezirk";
import { Stadt } from  "./models/Stadt";
import { Stadtteil } from  "./models/Stadtteil";
import { StatGebiet } from  "./models/StatGebiet";

export const adminLevelClassMap = {
  "Stadt": Stadt,
  "Bezirk": Bezirk,
  "Stadtteil": Stadtteil,
  "StatGebiet": StatGebiet,
  "Baublock": Baublock
};

@Component({
  components: {
    MapComponent,
    SaveDialog
  }
})
export default class App extends Vue {
  tab = 0;
  areaUnit = "";
  adminLevels = Object.keys(adminLevelClassMap);
  areaData = {
    Stadt: [new Stadt({name: "FHH"})],
    Bezirk: BezirkData.map(data => new Bezirk(data)),
    Stadtteil: StadtteilData.map(data => new Stadtteil(data)),
    StatGebiet: StatGebietData.map(data => new StatGebiet(data)),
    Baublock: BaublockData.map(data => new Baublock(data))
  };
  selectedAreas: {[key: string]: AdminLevelUnit[]} = {
    Stadt: [],
    Bezirk: [],
    Stadtteil: [],
    StatGebiet: [],
    Baublock: []
  };
  aggregations: {[key: string]: AdminLevelUnit} = {};
  basemaps = [
    {
      name: "farbig",
      visible: true
    },
    {
      name: "grau-blau",
      visible: false
    },
    {
      name: "schwarz-grau",
      visible: false
    }
  ];
  currentBasemap = this.basemaps[0].name;
  thematicLayers = [
    {
      name: "Solaratlas",
      visible: false,
    },
    {
      name: "Schulen",
      visible: false
    },
    {
      name: "Stadtteilkultur",
      visible: false
    },
    {
      name: "Soziale Infrastruktur",
      visible: false
    },
    {
      name: "Bauen und Wohnen",
      visible: false
    },
    {
      name: "RISE-Fördergebiete",
      visible: false
    },
    {
      name: "Sozialmonitoring 2020",
      visible: false,
    }
  ];
  legendUrls: string[] = [];
  dialog = false;
  savedSelections: Selection[] = [];
  tableHeight = 0;

  mounted(): void {
    this.areaUnit = "Stadt";
  }

  onBasemapChange(): void {
    for (const layer of this.basemaps) {
      layer.visible = layer.name === this.currentBasemap;
    }
  }

  onLegendUrlsChange(event: string[]): void {
    this.legendUrls = event;
  }

  @Watch("selectedAreas.Bezirk")
  onSelectedBezirkeChange(after: Bezirk[], before: Bezirk[]): void {
    const added = after.filter(bez => before.indexOf(bez) < 0);
    const removed = before.filter(bez => after.indexOf(bez) < 0);

    // wähle alle Stadtteile innerhalb des gewählten Bezirks aus
    for (const st of this.areaData.Stadtteil) {
      const sti = this.selectedAreas.Stadtteil.indexOf(st);

      if (sti < 0 && added.find(bez => bez.bezirk == st.stadtteil_nummer[0])) {
        this.selectedAreas.Stadtteil.push(st);
      }
      else if (sti > -1 && removed.find(bez => bez.bezirk == st.stadtteil_nummer[0])) {
        this.selectedAreas.Stadtteil.splice(sti, 1);
      }
    }
  }

  @Watch("selectedAreas.StatGebiet")
  onSelectedStatGebieteChange(selection: StatGebiet[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    const totalTatNu = selection.reduce((aggr, area) => aggr += area.tatNu_gesP, 0);
    const totalAnzFl = selection.reduce((aggr, area) => aggr += area.AnzFl, 0);

    this.aggregations.StatGebiet = new StatGebiet({
      STATGEB: "_",
      AnzFl: totalAnzFl,
      mittlFl: selection.reduce((aggr, area) => aggr += area.mittlFl * area.AnzFl, 0) / totalAnzFl,
      BGF: selection.reduce((aggr, area) => aggr += area.BGF, 0),
      tatNu_WB_P: selection.reduce((aggr, area) => aggr += area.tatNu_WB_P * area.tatNu_gesP, 0) / totalTatNu
    });
  }

  @Watch("selectedAreas.Baublock")
  onSelectedBaublöckeChange(selection: Baublock[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    const totalTatNu = selection.reduce((aggr, area) => aggr += area.tatNu_GesP, 0);
    const totalAnzFl = selection.reduce((aggr, area) => aggr += area.Anz_Fl, 0);

    this.aggregations.Baublock = new Baublock({
      BBZ: "_",
      Anz_Fl: totalAnzFl,
      Bev_Ges: selection.reduce((aggr, area) => aggr += area.Bev_Ges, 0),
      tatNu_WB_P: selection.reduce((aggr, area) => aggr += area.tatNu_WB_P * area.tatNu_GesP, 0) / totalTatNu,
      p_st_mwh_a: selection.reduce((aggr, area) => aggr += area.p_st_mwh_a || 0, 0)
    });
  }

  onAdminAreasSelected(event: { [key: string]: string[] }): void {
    for (const key of this.adminLevels) {
      this.selectedAreas[key] =
        (this.areaData[key as AdminLevelKey] as AdminLevelUnit[]).filter(area => event[key].indexOf(area.getId()) > -1);
    }
  }

  addSelection(selection: Selection): void {
    const storageString = localStorage.getItem("selections");
    if (storageString) {
      this.savedSelections = JSON.parse(storageString);
    }
    this.savedSelections.push(selection);
    localStorage.setItem('selections', JSON.stringify(this.savedSelections));
  }

  onResize(): void {
    // a hacky way of resizing the data table
    const container = this.$refs.tableContainer as Element;
    if (container) {
      // subtract margins, paddings and footer height
      this.tableHeight = window.innerHeight - container.getBoundingClientRect().y - 12 - 16 - 16 - 59;
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow-y: auto;
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

.table-container {
  padding: 0;
}

.v-data-table {
  margin-top: 16px;
}

.v-btn {
  margin-right: 10px;
}

.v-input__slot {
  margin: 0;
}

.kpi {
  font-size: 32px;
  line-height: 48px;
}
</style>
