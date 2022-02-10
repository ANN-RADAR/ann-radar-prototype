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
      <v-radio-group
        v-bind:value="'farbig'"
        @change="$emit('mapStyleChanged', $event)"
        row
      >
        <span style="margin-right: 16px">Hintergrundkarte:</span>
        <v-radio
          v-for="layer in baseLayers"
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
import {thematicLayers, baseLayers} from '../constants/layers';

export default Vue.extend({
  data() {
    return {
      thematicLayers,
      baseLayers
    };
  }
});
</script>
