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
                  <v-row>
                    <v-col cols="8">
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
                    </v-col>
                    <v-col cols="4">
                      <v-card class="card-notes">
                        <v-card-title>Notizen</v-card-title>
                        <v-card-text>
                          <v-textarea
                            v-model="notes"
                            filled
                          ></v-textarea>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-card>
                    <v-card-title>Cockpit</v-card-title>
                    <v-card-text>
                      <div
                        v-if="areaUnit !== 'Stadt' && selectedAreas[areaUnit] && selectedAreas[areaUnit].length > 0"
                        v-resize="onResize"
                        style="display: flex; justify-content: space-around"
                      >
                        <v-sheet>
                          Flurstücke
                          <div class="kpi">{{ formatNumber(aggregation.AnzFl) }}</div>
                        </v-sheet>
                        <v-sheet>
                          mittl. Flurstückgröße
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.mittlFl)) }}&nbsp;m²</div>
                        </v-sheet>
                        <v-sheet>
                          BGF
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.BGF)) }}&nbsp;m²</div>
                        </v-sheet>
                        <v-sheet>
                          Wohnbaufläche
                          <div class="kpi">{{ formatNumber(Math.round(aggregation.tatNu_WB_P * 100) / 100) }}&nbsp;%</div>
                        </v-sheet>
                        <v-sheet>
                          Bevölkerung
                          <div class="kpi">{{ formatNumber(aggregation.Bev_311219) }}</div>
                        </v-sheet>
                        <v-sheet>
                          Solarpotenzial
                          <div v-if="isNaN(aggregation.p_st_mwh_a)" class="kpi">?</div>
                          <div v-else class="kpi">{{ formatNumber(Math.round(aggregation.p_st_mwh_a)) }}&nbsp;MWh/a</div>
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
                          v-if="areaUnit"
                          v-model="selectedAreas[areaUnit]"
                          :headers="[
                            { text: areaUnit, sortable: true, value: adminLevelClassMap[areaUnit].nameProp },
                            { text: 'Flurstücke', sortable: true, value: 'AnzFl' },
                            { text: 'mittl. Flurstückgröße', sortable: true, value: 'mittlFl' },
                            { text: 'BGF', sortable: true, value: 'BGF' },
                            { text: 'Wohnbaufläche', sortable: true, value: 'tatNu_WB_P' },
                            { text: 'Bevölkerung', sortable: true, value: 'Bev_311219' },
                            { text: 'Solarpotenzial', sortable: true, value: 'p_st_mwh_a' }
                          ].concat(areaUnit === 'StatGebiet' ? [{ text: 'Soz. Status', sortable: true, value: 'Soz_Status' }] : [])"
                          :items="selectedAreas[areaUnit]"
                          :item-key="adminLevelClassMap[areaUnit].nameProp"
                          :show-select="true"
                          :height="tableHeight"
                          :fixed-header="true"
                          hide-default-footer
                        >
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.AnzFl="{ item }">
                            <span v-if="item.AnzFl !== undefined">{{ formatNumber(Math.round(item.AnzFl)) }}</span>
                            <span v-else>k. A.</span>
                          </template>
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.mittlFl="{ item }">
                            <span v-if="item.mittlFl !== undefined">{{ formatNumber(Math.round(item.mittlFl)) }}&nbsp;m²</span>
                            <span v-else>k. A.</span>
                          </template>
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.BGF="{ item }">
                            <span v-if="item.BGF !== undefined">{{ formatNumber(Math.round(item.BGF)) }}&nbsp;m²</span>
                            <span v-else>k. A.</span>
                          </template>
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.tatNu_WB_P="{ item }">
                            <span v-if="item.tatNu_WB_P !== undefined">{{ formatNumber(item.tatNu_WB_P) }}&nbsp;%</span>
                            <span v-else>k. A.</span>
                          </template>
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.Bev_311219="{ item }">
                            <span v-if="item.Bev_311219 !== undefined">{{ formatNumber(Math.round(item.Bev_311219)) }}</span>
                            <span v-else>k. A.</span>
                          </template>
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.p_st_mwh_a="{ item }">
                            <span v-if="item.p_st_mwh_a !== undefined">{{ formatNumber(item.p_st_mwh_a) }}&nbsp;MWh/a</span>
                            <span v-else>k. A.</span>
                          </template>
                          <!-- eslint-disable-next-line vue/valid-v-slot -->
                          <template v-slot:item.Soz_Status="{ item }">
                            <span v-if="item.Soz_Status !== undefined">{{ item.Soz_Status }}</span>
                            <span v-else>k. A.</span>
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
                          :selected-areas="selectedAreas"
                          :notes="notes"
                          @save="saveSession($event)"
                        ></SaveDialog>
                        <div>
                          <v-select
                            :items="savedSessions.map(selection => ({ text: selection.title, value: selection }))"
                            label="Auswahl wiederherstellen"
                            @change="restoreSession($event)"
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

import MapComponent from "./components/MapComponent.vue";
import SaveDialog from "./components/SaveDialog.vue";
import BaublockData from "./data/baublöcke.json";
import BezirkData from "./data/bezirke.json";
import StadtteilData from "./data/stadtteile.json";
import StatGebietData from "./data/statistische_gebiete.json";
import { Baublock } from "./models/Baublock";
import { Bezirk } from "./models/Bezirk";
import { Stadt } from "./models/Stadt";
import { Stadtteil } from "./models/Stadtteil";
import { StatGebiet } from "./models/StatGebiet";
import { AdminLevelUnit, Session } from "./typings";

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
  adminLevelClassMap = adminLevelClassMap;
  adminLevels = Object.keys(adminLevelClassMap);
  adminLevelDisplayNames = {
    "Stadt": ["Stadt", "Stadt"],
    "Bezirk": ["Bezirke", "Bezirk"],
    "Stadtteil": ["Stadtteile", "Stadtteil"],
    "StatGebiet": ["Stat. Gebiete", "Stat. Gebiet"],
    "Baublock": ["Baublöcke", "Baublock"]
  };
  areaData: Record<string, AdminLevelUnit[]> = {
    Stadt: [new Stadt({name: "FHH"} as Stadt)],
    Bezirk: BezirkData.map(data => new Bezirk(data as unknown as Bezirk)),
    Stadtteil: StadtteilData.map(data => new Stadtteil(data as unknown as Stadtteil)),
    StatGebiet: StatGebietData.map(data => new StatGebiet(data as unknown as StatGebiet)),
    Baublock: BaublockData.map(data => new Baublock(data as unknown as Baublock))
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
  savedSessions: Session[] = [];
  notes = "";
  tableHeight = 0;

  mounted(): void {
    this.areaUnit = "Stadt";

    // load saved items
    const storageString = localStorage.getItem("selections");

    if (storageString) {
      this.savedSessions = JSON.parse(storageString);
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
  onSelectedBezirkeChange(selection: Bezirk[], before: Bezirk[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    this.aggregation = new Bezirk(this.calculateAggregateValues(selection) as unknown as Bezirk);

    const added = selection.filter(bez => before.indexOf(bez) < 0);
    const removed = before.filter(bez => selection.indexOf(bez) < 0);

    // wähle alle Stadtteile innerhalb des gewählten Bezirks aus
    for (const st of this.areaData.Stadtteil as Stadtteil[]) {
      const sti = this.selectedAreas.Stadtteil.indexOf(st);

      // die erste Ziffer in der Stadtteilkennung ist die Bezirkskennung!
      if (sti < 0 && added.find(bez => bez.bezirk == st.stadtteil_nummer[0])) {
        this.selectedAreas.Stadtteil.push(st);
      }
      else if (sti > -1 && removed.find(bez => bez.bezirk == st.stadtteil_nummer[0])) {
        this.selectedAreas.Stadtteil.splice(sti, 1);
      }
    }
  }

  @Watch("selectedAreas.Stadtteil")
  onSelectedStadtteileChange(selection: Stadtteil[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    this.aggregation = new Stadtteil(this.calculateAggregateValues(selection) as unknown as Stadtteil);
  }

  @Watch("selectedAreas.StatGebiet")
  onSelectedStatGebieteChange(selection: StatGebiet[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    this.aggregation = new StatGebiet(this.calculateAggregateValues(selection) as unknown as StatGebiet);
  }

  @Watch("selectedAreas.Baublock")
  onSelectedBaublöckeChange(selection: Baublock[]): void {
    // berechne aggregierte Werte über die gewählten Flächen
    this.aggregation = new Baublock(this.calculateAggregateValues(selection) as unknown as Baublock);
  }

  calculateAggregateValues(selection: (Stadt | Bezirk | Stadtteil | StatGebiet | Baublock)[]): Record<string, number> {
    const weightedSums = selection.reduce((aggr, area) => {
      return {
        Shape_Area: aggr.Shape_Area + area.Shape_Area,
        AnzFl: aggr.AnzFl + area.AnzFl,
        mittlFl: aggr.mittlFl + area.mittlFl * area.AnzFl,
        BGF: aggr.BGF + area.BGF,
        tatNu_WB_P: aggr.tatNu_WB_P + area.tatNu_WB_P * area.Shape_Area,
        Bev_311219: aggr.Bev_311219 + area.Bev_311219,
        p_st_mwh_a: aggr.p_st_mwh_a + (area.p_st_mwh_a || 0)
      }
    }, {Shape_Area: 0, AnzFl: 0, mittlFl: 0, BGF: 0, tatNu_WB_P: 0, Bev_311219: 0, p_st_mwh_a: 0});

    return {
      AnzFl: weightedSums.AnzFl,
      mittlFl: weightedSums.mittlFl / weightedSums.AnzFl,
      BGF: weightedSums.BGF,
      tatNu_WB_P: weightedSums.tatNu_WB_P / weightedSums.Shape_Area,
      Bev_311219: weightedSums.Bev_311219,
      p_st_mwh_a: weightedSums.p_st_mwh_a
    };
  }

  onAdminAreasSelected(event: { [key: string]: string[] }): void {
    for (const key of this.adminLevels) {
      this.selectedAreas[key] =
        (this.areaData[key] as AdminLevelUnit[]).filter(area => event[key].indexOf(area.getId()) > -1);
    }
  }

  /**
   * Speichere die aktuelle Sitzung (ausgewählte Flächen auf allen Ebenen plus Notizen)
   * im LocalStorage
   */
  saveSession(session: Session): void {
    const storageString = localStorage.getItem("selections");
    if (storageString) {
      this.savedSessions = JSON.parse(storageString);
    }
    this.savedSessions.push(session);
    localStorage.setItem("selections", JSON.stringify(this.savedSessions));
  }

  /**
   * Stelle eine gespeicherte Sitzung wieder her
   */
  restoreSession(session: Session): void {
    for (const type in this.areaData) {
      this.selectedAreas[type] = this.areaData[type].filter(item => {
        return session.selectedAreas[type].find(area => item.getId() === new adminLevelClassMap[type](area).getId());
      });
    }
    this.notes = session.notes;
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
    return n?.toLocaleString("de-DE");
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

.card-notes {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-notes .v-card__text {
  flex-grow: 1;
}

.card-notes .v-textarea {
  height: 100%;
}

.card-notes .v-textarea .v-input__control {
  height: 100%;
}

.card-notes .v-textarea .v-input__control .v-input__slot {
  flex: 1;
}

.card-notes .v-textarea .v-input__control .v-text-field__details {
  flex: unset;
}

.kpi {
  font-size: 20px;
  line-height: 36px;
}
</style>
