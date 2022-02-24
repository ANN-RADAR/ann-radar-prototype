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
      <v-radio-group v-bind:value="mapStyle" @change="setMapStyle" row>
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
import {mapMutations, mapState} from 'vuex';

import {LayerOptions} from '@/types/layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {
  baseLayersOptions,
  solarPotentialLayersOptions,
  mapStyleLayersOptions
} from '../constants/layers';

interface Data {
  layers: Array<LayerOptions>;
  mapStyleLayersOptions: Array<LayerOptions<TileSourceOptions>>;
}

export default Vue.extend({
  data(): Data {
    return {
      layers: [...solarPotentialLayersOptions, ...baseLayersOptions],
      mapStyleLayersOptions
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)(['mapStyle'])
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)([
      'setMapStyle',
      'setBaseLayerTypes'
    ]),
    onLayerChange() {
      this.setBaseLayerTypes(
        this.layers
          .filter(layer => layer.visible)
          .map(layer => layer.properties.name)
      );
    }
  }
});
</script>
