<template>
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
      <v-radio-group v-model="currentBasemap" @change="onBasemapChange()" row>
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
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    basemaps: {
      type: Array,
      required: true
    },
    currentBasemap: {
      type: String,
      required: true
    }
  },
  computed: {
    localCurrentBasemap: {
      get() {
        return this.currentBasemap;
      },
      set(localCurrentBasemap) {
        this.$emit('input', localCurrentBasemap);
      }
    }
  },
  data() {
    return {
      thematicLayers: [
        {name: 'Solaratlas', visible: false},
        {name: 'Schulen', visible: false},
        {name: 'Stadtteilkultur', visible: false},
        {name: 'Soziale Infrastruktur', visible: false},
        {name: 'Bauen und Wohnen', visible: false},
        {name: 'RISE-Fördergebiete', visible: false},
        {name: 'Sozialmonitoring 2020', visible: false}
      ]
    };
  }
});
</script>
