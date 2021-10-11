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
                        v-if="selectedAreas[areaUnit] && selectedAreas[areaUnit].length > 0"
                        v-resize="onResize"
                        style="display: flex; justify-content: space-around"
                      >
                        <v-sheet v-if="areaUnit === 'StatGebiet'">
                          Flurstücke
                          <div class="kpi">{{ formatNumber(aggregation.AnzFl) }}</div>
                        </v-sheet>
                        <v-sheet v-if="areaUnit === 'Baublock'">
                          Flurstücke
                          <div class="kpi">{{ formatNumber(aggregation.Anz_Fl) }}</div>
                        </v-sheet>
                        <v-sheet v-if="areaUnit === 'StatGebiet'">
                          mittl. Flurstückgröße
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.mittlFl)) }}&nbsp;m²</div>
                        </v-sheet>
                        <v-sheet v-if="areaUnit === 'StatGebiet'">
                          BGF
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.BGF)) }}&nbsp;m²</div>
                        </v-sheet>
                        <v-sheet v-if="areaUnit === 'StatGebiet' || areaUnit === 'Baublock'">
                          Wohnbaufläche
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.tatNu_WB_P * 100) / 100) }}&nbsp;%</div>
                        </v-sheet>
                        <v-sheet v-if="areaUnit === 'Baublock'">
                          Bevölkerung
                          <div class="kpi">{{ formatNumber(aggregation.Bev_Ges) }}</div>
                        </v-sheet>
                        <v-sheet v-if="areaUnit === 'Baublock'">
                          Solarpotenzial
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.p_st_mwh_a)) }}&nbsp;MWh/a</div>
                        </v-sheet>
                      </div>
                    </v-card-text>
                  </v-card>
                  <v-card>
                    <v-card-title>Gebiete inspizieren</v-card-title>
                    <v-card-text>
                      <v-sheet>
                        <v-btn
                          v-for="adminLevel in adminLevels"
                          :key="adminLevel"
                          :color="areaUnit === adminLevel ? 'primary' : ''"
                          @click="areaUnit = areaUnit !== adminLevel ? adminLevel : ''"
                        >
                          {{ adminLevelDisplayNames[adminLevel][0] }}
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
                          hide-default-footer
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
                          hide-default-footer
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
                          hide-default-footer
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
                          hide-default-footer
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
                          hide-default-footer
                        >
                          <template v-slot:item.tatNu_WB_P="{ item }">
                            {{ item.tatNu_WB_P }}&nbsp;%
                          </template>
                          <template v-slot:item.p_st_mwh_a="{ item }">
                            <span v-if="item.p_st_mwh_a !== undefined">{{ item.p_st_mwh_a }}&nbsp;MWh/a</span>
                          </template>
                        </v-data-table>
                      </v-container>
                      <v-sheet
                        style="display: flex; justify-content: space-between; align-items: baseline; height: 54px"
                      >
                        <div v-if="selectedAreas[areaUnit]">
                          <span v-if="selectedAreas[areaUnit].length > 0">
                            {{ selectedAreas[areaUnit].length }}
                            {{ adminLevelDisplayNames[areaUnit][selectedAreas[areaUnit].length == 1 ? 1 : 0] }} ausgewählt
                          </span>
                          <span v-else>Nichts ausgewählt</span>
                        </div>
                        <SaveDialog
                          :selected-areas="selectedAreas[areaUnit]"
                          :type="areaUnit"
                          @saveselection="saveSelection($event)"
                        ></SaveDialog>
                        <div>
                          <v-select
                            :items="savedSelections.map(selection => ({ text: selection.title, value: selection }))"
                            label="Auswahl wiederherstellen"
                            @change="restoreSelection($event)"
                          ></v-select>
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
import { Component, Vue, Watch } from "vue-property-decorator";

import { AdminLevelUnit, Selection } from "@/typings";
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

export const adminLevelClassMap: Record<string, typeof Stadt | typeof Bezirk | typeof Stadtteil | typeof StatGebiet | typeof Baublock> = {
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
  adminLevelDisplayNames = {
    "Stadt": ["Stadt", "Stadt"],
    "Bezirk": ["Bezirke", "Bezirk"],
    "Stadtteil": ["Stadtteile", "Stadtteil"],
    "StatGebiet": ["Stat. Gebiete", "Stat. Gebiet"],
    "Baublock": ["Baublöcke", "Baublock"]
  };
  areaData: Record<string, AdminLevelUnit[]> = {
    Stadt: [new Stadt({name: "FHH"})],
    Bezirk: BezirkData.map(data => new Bezirk(data)),
    Stadtteil: StadtteilData.map(data => new Stadtteil(data)),
    StatGebiet: StatGebietData.map(data => new StatGebiet(data)),
    Baublock: BaublockData.map(data => new Baublock(data))
  };
  selectedAreas: Record<string, AdminLevelUnit[]> = {
    Stadt: [],
    Bezirk: [],
    Stadtteil: [],
    StatGebiet: [],
    Baublock: []
  };
  aggregation: AdminLevelUnit = {} as AdminLevelUnit;
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

    // load saved items
    const storageString = localStorage.getItem("selections");

    if (storageString) {
      this.savedSelections = JSON.parse(storageString);
    }
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
    for (const st of this.areaData.Stadtteil as Stadtteil[]) {
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
    const aggregation = selection.reduce((aggr, area) => {
      return {
        Shape_Area: aggr.Shape_Area + area.Shape_Area,
        AnzFl: aggr.AnzFl + area.AnzFl,
        mittlFl: aggr.mittlFl + area.mittlFl * area.AnzFl,
        BGF: aggr.BGF + area.BGF,
        tatNu_WB_P: aggr.tatNu_WB_P + area.tatNu_WB_P * area.Shape_Area
      }
    }, {Shape_Area: 0, AnzFl: 0, mittlFl: 0, BGF: 0, tatNu_WB_P: 0});

    this.aggregation = new StatGebiet({
      STATGEB: "_",
      AnzFl: aggregation.AnzFl,
      mittlFl: aggregation.mittlFl / aggregation.AnzFl,
      BGF: aggregation.BGF,
      tatNu_WB_P: aggregation.tatNu_WB_P / aggregation.Shape_Area
    });
  }

  @Watch("selectedAreas.Baublock")
  onSelectedBaublöckeChange(selection: Baublock[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    const aggregation = selection.reduce((aggr, area) => {
      return {
        Shape_Area: aggr.Shape_Area + area.Shape_Area,
        Anz_Fl: aggr.Anz_Fl + area.Anz_Fl,
        Bev_Ges: aggr.Bev_Ges + area.Bev_Ges,
        tatNu_WB_P: aggr.tatNu_WB_P + area.tatNu_WB_P * area.Shape_Area,
        p_st_mwh_a: aggr.p_st_mwh_a + area.p_st_mwh_a || 0
      }
    }, {Shape_Area: 0, Anz_Fl: 0, Bev_Ges: 0, tatNu_WB_P: 0, p_st_mwh_a: 0});

    this.aggregation = new Baublock({
      BBZ: "_",
      Anz_Fl: aggregation.Anz_Fl,
      Bev_Ges: aggregation.Bev_Ges,
      tatNu_WB_P: aggregation.tatNu_WB_P / aggregation.Shape_Area,
      p_st_mwh_a: aggregation.p_st_mwh_a
    });
  }

  onAdminAreasSelected(event: { [key: string]: string[] }): void {
    for (const key of this.adminLevels) {
      this.selectedAreas[key] =
        (this.areaData[key] as AdminLevelUnit[]).filter(area => event[key].indexOf(area.getId()) > -1);
    }
  }

  saveSelection(selection: Selection): void {
    const storageString = localStorage.getItem("selections");
    if (storageString) {
      this.savedSelections = JSON.parse(storageString);
    }
    this.savedSelections.push(selection);
    localStorage.setItem("selections", JSON.stringify(this.savedSelections));
  }

  restoreSelection(selection: Selection): void {
    this.areaUnit = selection.type;

    // this.selectedAreas[selection.type] = selection.areas;
    this.selectedAreas[selection.type] = this.areaData[selection.type].filter(item => {
      return selection.areas.find(area => item.getId() === new adminLevelClassMap[selection.type](area).getId());
    });
  }

  onResize(): void {
    // a hacky way of resizing the data table
    const container = this.$refs.tableContainer as Element;
    if (container) {
      // subtract margins, paddings and footer height
      this.tableHeight = window.innerHeight - container.getBoundingClientRect().y - 12 - 16 - 16 - 54;
    }
  }

  formatNumber(n: number): string {
    return n.toLocaleString("de-DE");
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
  font-size: 28px;
  line-height: 44px;
}
</style>
