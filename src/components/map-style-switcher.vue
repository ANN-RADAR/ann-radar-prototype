<template>
  <div class="map-style-switcher">
    <v-menu left offset-x nudge-left="8px" rounded="0">
      <template v-slot:activator="{on, attrs}">
        <v-btn
          fab
          small
          tile
          elevation="2"
          v-bind="attrs"
          v-on="on"
          :title="$t('mapStyles')"
        >
          <img
            :src="`assets/map-style-${mapStyle}.png`"
            :alt="$t(`mapStyle.${mapStyle}`)"
          />
        </v-btn>
      </template>

      <v-sheet class="map-style-options">
        <label
          v-for="layer in mapStyleLayersOptions"
          :key="layer.properties.name"
          class="map-style-option"
          :title="$t(`mapStyle.${layer.properties.name}`)"
        >
          <input
            type="radio"
            name="mapStyle"
            :value="layer.properties.name"
            :checked="mapStyle === layer.properties.name"
            @change="setMapStyle($event.target.value)"
          />
          <img
            :src="`assets/map-style-${layer.properties.name}.png`"
            :alt="$t(`mapStyle.${layer.properties.name}`)"
          />
        </label>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {TileLayerOptions} from '@/types/layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {mapStyleLayersOptions} from '../constants/layers';

interface Data {
  mapStyleLayersOptions: Array<TileLayerOptions>;
}

export default Vue.extend({
  data(): Data {
    return {
      mapStyleLayersOptions
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['mapStyle'])
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setMapStyle'])
  }
});
</script>

<style scoped>
.map-style-switcher img,
.map-style-option img {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
}

.map-style-options {
  display: flex;
  height: 40px;
  grid-gap: 4px;
  padding: 4px;
}

.map-style-option input {
  display: none;
}

.map-style-option input:checked + img {
  border: 2px solid #1976d1;
}
</style>
