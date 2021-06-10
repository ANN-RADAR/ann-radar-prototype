<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center">
        Solar
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center heading">
        ANN RADAR
      </div>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
        style="display: flex; flex-direction: column; height: 100%; padding: 0;"
      >
        <v-tabs
          v-model="tab"
        >
          <v-tab>
            Potenzial
          </v-tab>
          <v-tab>
            Strategie
          </v-tab>
          <v-tab>
            Stakeholder
          </v-tab>
          <v-tab>
            Urban Data
          </v-tab>
          <v-tab>
            Governance
          </v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="tab"
          style="height: 100%;"
        >
          <v-tab-item style="flex-grow: 1;">
            <v-container
              fluid
              style="display: flex; flex-direction: column; height: 100%;"
            >
              <v-row style="flex-grow: 1;">
                <v-col cols="8">
                  <MapComponent
                    :bezirkeVisible="areaUnit == 'Bezirk'"
                    :stadtteileVisible="areaUnit == 'Stadtteil'"
                    :statGebieteVisible="areaUnit == 'Stat. Gebiet'"
                  />
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-title>
                      Gebiet inspizieren
                    </v-card-title>
                    <v-card-text>
                      <v-btn
                        :color="areaUnit == 'Bezirk' ? 'primary' : ''"
                        @click="areaUnit = areaUnit != 'Bezirk' ? 'Bezirk' : ''"
                      >
                        Bezirk
                      </v-btn>
                      <v-btn
                        :color="areaUnit == 'Stadtteil' ? 'primary' : ''"
                        @click="areaUnit = areaUnit != 'Stadtteil' ? 'Stadtteil' : ''"
                      >
                        Stadtteil
                      </v-btn>
                      <v-btn
                        :color="areaUnit == 'Stat. Gebiet' ? 'primary' : ''"
                        @click="areaUnit = areaUnit != 'Stat. Gebiet' ? 'Stat. Gebiet' : ''"
                      >
                        Stat. Gebiet
                      </v-btn>
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
import { Component, Vue } from 'vue-property-decorator';
import MapComponent from './components/MapComponent.vue';

@Component({
  components: {
    MapComponent,
  },
})
export default class App extends Vue {
  tab = 0;
  areaUnit = "";
}
</script>

<style>
html, body {
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
