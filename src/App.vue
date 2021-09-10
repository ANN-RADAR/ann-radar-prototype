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
                <v-col cols="6">
                  <MapComponent
                    :layerVisibility="mapLayers.reduce((obj, layer) => {
                      obj[layer.name] = layer.visible;
                      return obj;
                    }, {})"
                    :adminLayerVisibility="{
                      'Stadt': areaUnit === 'Stadt',
                      'Bezirke': areaUnit === 'Bezirk',
                      'Stadtteile': areaUnit === 'Stadtteil',
                      'StatGebiete': areaUnit === 'StatGebiet',
                      'Baublöcke': areaUnit === 'Baublock'
                    }"
                    :selectedAdminAreas="{
                      'Stadt': selectedStadt,
                      'Bezirk': selectedBezirke,
                      'Stadtteil': selectedStadtteile,
                      'StatGebiet': selectedStatGebiete,
                      'Baublock': selectedBaublöcke
                    }[areaUnit]"
                    @selectedAdminAreas="onAdminAreasSelected($event)"
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
                      <v-data-table
                        v-if="areaUnit === 'Stadt'"
                        v-model="selectedStadt"
                        :headers="[
                          { text: 'Stadt', sortable: true, value: 'name' }
                        ]"
                        :items="stadt"
                        item-key="name"
                        :show-select="true"
                        style="margin: 15px 0"
                      ></v-data-table>
                      <v-data-table
                        v-if="areaUnit === 'Bezirk'"
                        v-model="selectedBezirke"
                        :headers="[
                          { text: 'Bezirk', sortable: true, value: 'bezirk_name' },
                          { text: 'Solarpotenzial', sortable: true, value: 'MWh_a' }
                        ]"
                        :items="bezirke"
                        item-key="bezirk"
                        :show-select="true"
                        style="margin: 15px 0"
                      >
                        <template v-slot:item.MWh_a="{ item }">
                          <span v-if="item.MWh_a !== undefined">{{ item.MWh_a }}&nbsp;MWh/a</span>
                        </template>
                      </v-data-table>
                      <v-data-table
                        v-if="areaUnit === 'Stadtteil'"
                        v-model="selectedStadtteile"
                        :headers="[
                          { text: 'Stadtteil', sortable: true, value: 'stadtteil_name' },
                          { text: 'Solarpotenzial', sortable: true, value: 'MWh_a' }
                        ]"
                        :items="stadtteile"
                        item-key="stadtteil_nummer"
                        :show-select="true"
                        style="margin: 15px 0"
                      >
                        <template v-slot:item.MWh_a="{ item }">
                          <span v-if="item.MWh_a !== undefined">{{ item.MWh_a }}&nbsp;MWh/a</span>
                        </template>
                      </v-data-table>
                      <v-data-table
                        v-if="areaUnit === 'StatGebiet'"
                        v-model="selectedStatGebiete"
                        :headers="[
                          { text: 'Nr.', sortable: true, value: 'STATGEB' },
                          { text: 'Fläche', sortable: true, value: 'Shape_Area' },
                          { text: 'Flurstücke', sortable: true, value: 'AnzFlur' },
                          { text: 'mittl. Flurstückgröße', sortable: true, value: 'mttlFlur' },
                          { text: 'Solarpotenzial', sortable: true, value: 'MWh_a' }
                        ]"
                        :items="selectedStatGebiete"
                        item-key="STATGEB"
                        :show-select="true"
                        style="margin: 15px 0"
                      >
                        <template v-slot:item.Shape_Area="{ item }">
                          {{ Math.round(item.Shape_Area / 10000) / 100 }}&nbsp;km²
                        </template>
                        <template v-slot:item.mttlFlur="{ item }">
                          {{ Math.round(item.mttlFlur) }}&nbsp;m²
                        </template>
                        <template v-slot:item.MWh_a="{ item }">
                          <span v-if="item.MWh_a !== undefined">{{ item.MWh_a }}&nbsp;MWh/a</span>
                        </template>
                      </v-data-table>
                      <v-data-table
                        v-if="areaUnit === 'Baublock'"
                        v-model="selectedBaublöcke"
                        :headers="[
                          { text: 'Nr.', sortable: true, value: 'BBZ' },
                          { text: 'Flurstücke', sortable: true, value: 'Anz_Fl' },
                          { text: 'Wohnbaufläche', sortable: true, value: 'tatNu_WB_P' },
                          { text: 'Bevölkerung', sortable: true, value: 'Bev_Ges' },
                          { text: 'Solarpotenzial', sortable: true, value: 'p_st_mwh_a' }
                        ]"
                        :items="selectedBaublöcke"
                        item-key="BBZ"
                        :show-select="true"
                        style="margin: 15px 0"
                      >
                        <template v-slot:item.tatNu_WB_P="{ item }">
                          {{ item.tatNu_WB_P }}&nbsp;%
                        </template>
                        <template v-slot:item.p_st_mwh_a="{ item }">
                          <span v-if="item.p_st_mwh_a !== undefined">{{ item.p_st_mwh_a }}&nbsp;MWh/a</span>
                        </template>
                      </v-data-table>
                      <v-sheet>
                        <SaveDialog
                          v-if="areaUnit === 'Bezirk' && selectedBezirke.length"
                          :selected-areas="selectedBezirke"
                          :type="areaUnit"
                          id-prop="bezirk"
                          name-prop="bezirk_name"
                          @saveselection="addSelection($event)"
                        ></SaveDialog>
                        <SaveDialog
                          v-if="areaUnit === 'Stadtteil' && selectedStadtteile.length"
                          :selected-areas="selectedStadtteile"
                          :type="areaUnit"
                          id-prop="stadtteil_nummer"
                          name-prop="stadtteil_name"
                          @saveselection="addSelection($event)"
                        ></SaveDialog>
                        <SaveDialog
                          v-if="areaUnit === 'StatGebiet' && selectedStatGebiete.length"
                          :selected-areas="selectedStatGebiete"
                          :type="areaUnit"
                          id-prop="STATGEB"
                          name-prop="STATGEB"
                          @saveselection="addSelection($event)"
                        ></SaveDialog>
                        <SaveDialog
                          v-if="areaUnit === 'Baublock' && selectedBaublöcke.length"
                          :selected-areas="selectedBaublöcke"
                          :type="areaUnit"
                          id-prop="BBZ"
                          name-prop="BBZ"
                          @saveselection="addSelection($event)"
                        ></SaveDialog>
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
import BezirkeData from "./data/bezirke.json";
import StadtteileData from "./data/stadtteile.json";
import StatGebieteData from "./data/statistische_gebiete.json";
import BaublöckeData from "./data/baublöcke.json";
import { Baublock, Bezirk, Selection, Stadt, Stadtteil, StatGebiet } from "./typings";

@Component({
  components: {
    MapComponent,
    SaveDialog
  }
})
export default class App extends Vue {
  tab = 0;
  areaUnit = "";
  stadt = [{ name: "FHH" }] as Stadt[];
  bezirke = BezirkeData as Bezirk[];
  stadtteile = StadtteileData as Stadtteil[];
  statGebiete = StatGebieteData as StatGebiet[];
  baublöcke = BaublöckeData as Baublock[];
  selectedStadt: Stadt[] = [];
  selectedBezirke: Bezirk[] = [];
  selectedStadtteile: Stadtteil[] = [];
  selectedStatGebiete: StatGebiet[] = [];
  selectedBaublöcke: Baublock[] = [];
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
    {
      name: "Sozialmonitoring",
      title: "Sozialmonitoring",
      visible: false,
    },
    {
      name: "RISE",
      title: "RISE-Fördergebiete",
      visible: false
    }
  ];
  dialog = false;
  savedSelections: Selection[] = [];

  @Watch("selectedBezirke")
  onSelectedBezirkeChange(after: Bezirk[], before: Bezirk[]): void {
    const added = after.filter(bez => before.indexOf(bez) < 0);
    const removed = before.filter(bez => after.indexOf(bez) < 0);

    // wähle alle Stadtteile innerhalb des gewählten Bezirks aus
    for (const st of this.stadtteile) {
      const sti = this.selectedStadtteile.indexOf(st);

      if (sti < 0 && added.find(bez => bez.bezirk == st.stadtteil_nummer[0])) {
        this.selectedStadtteile.push(st);
      }
      else if (sti > -1 && removed.find(bez => bez.bezirk == st.stadtteil_nummer[0])) {
        this.selectedStadtteile.splice(sti, 1);
      }
    }
  }

  mounted(): void {
    this.areaUnit = "Stadt";
  }

  onAdminAreasSelected(event: { [key: string]: string[] }): void {
    this.selectedStadt = this.stadt.filter(area => event.Stadt.indexOf(area.name) > -1);
    this.selectedBezirke = this.bezirke.filter(area => event.Bezirke.indexOf(area.bezirk) > -1);
    this.selectedStadtteile = this.stadtteile.filter(area => event.Stadtteile.indexOf(area.stadtteil_nummer) > -1);
    this.selectedStatGebiete = this.statGebiete.filter(area => event.StatGebiete.indexOf(area.STATGEB.toString()) > -1);
    this.selectedBaublöcke = this.baublöcke.filter(area => event.Baublöcke.indexOf(area.BBZ.toString()) > -1);
  }

  addSelection(selection: Selection): void {
    const storageString = localStorage.getItem("selections");
    if (storageString) {
      this.savedSelections = JSON.parse(storageString);
    }
    this.savedSelections.push(selection);
    localStorage.setItem('selections', JSON.stringify(this.savedSelections));
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

.v-btn {
  margin-right: 10px;
}
</style>
