<template>
  <v-card>
    <v-card-title>Layer</v-card-title>
    <v-card-text style="max-height: 250px; overflow: auto">
      <div style="display: grid; grid-template-columns: auto auto">
        <v-checkbox
          v-for="layer in layers"
          :key="layer.properties.name"
          v-model="layer.visible"
          :label="layer.properties.name"
          style="margin-top: -4px"
          @change="onLayerChange"
        ></v-checkbox>
      </div>
      <v-radio-group
        v-bind:value="'farbig'"
        @change="$emit('mapStyleChanged', $event)"
        row
      >
        <span style="margin-right: 16px">Hintergrundkarte:</span>
        <v-radio
          v-for="layer in mapStyleLayersOptions"
          :key="layer.properties.name"
          :label="layer.properties.name"
          :value="layer.properties.name"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  baseLayersOptions,
  heatingLayerOptions,
  mapStyleLayersOptions
} from '../constants/layers';

export default Vue.extend({
  data() {
    return {
      layers: [heatingLayerOptions, ...baseLayersOptions],
      mapStyleLayersOptions
    };
  },
  methods: {
    onLayerChange() {
      this.$emit(
        'layersChanged',
        this.layers
          .filter(layer => layer.visible)
          .map(layer => layer.properties.name)
      );
    }
  }
});
</script>
