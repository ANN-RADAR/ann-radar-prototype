<template>
  <div class="map-layer-switcher">
    <v-menu
      left
      offset-x
      nudge-left="8px"
      rounded="0"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{on, attrs}">
        <v-btn
          fab
          small
          tile
          elevation="2"
          v-bind="attrs"
          v-on="on"
          :title="$t('layers')"
        >
          <v-icon>mdi-layers</v-icon>
        </v-btn>
      </template>

      <v-sheet class="map-layer-options">
        <section v-if="thematicLayers.length">
          <h4 v-if="thematicLayersTitle" class="overline">
            {{ thematicLayersTitle }}
          </h4>
          <v-checkbox
            v-for="layer in thematicLayers"
            :key="layer.properties.name"
            v-model="layer.visible"
            :label="$t(`layer.${layer.properties.name}`)"
            style="margin-top: -4px"
            @change="onLayerChange"
            dense
            hide-details
          ></v-checkbox>
        </section>

        <section>
          <h4 class="overline">{{ $t('layerOptions.baseLayers') }}</h4>
          <v-checkbox
            v-for="layer in baseLayers"
            :key="layer.properties.name"
            v-model="layer.visible"
            :label="$t(`layer.${layer.properties.name}`)"
            style="margin-top: -4px"
            @change="onLayerChange"
            dense
            hide-details
          ></v-checkbox>
        </section>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations} from 'vuex';

import {LayerOptions} from '@/types/layers';
import {MapMutationsToMethods} from '@/types/store';
import {baseLayersOptions} from '../constants/layers';

interface Data {
  baseLayers: Array<LayerOptions>;
}

export default Vue.extend({
  props: {
    thematicLayers: {
      type: Array as PropType<Array<LayerOptions>>,
      required: false
    },
    thematicLayersTitle: {
      type: String,
      required: false
    }
  },
  data(): Data {
    return {
      baseLayers: baseLayersOptions
    };
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setBaseLayerTypes']),
    onLayerChange() {
      const layers = [...this.baseLayers, ...this.thematicLayers];

      this.setBaseLayerTypes(
        layers
          .filter(layer => layer.visible)
          .map(layer => layer.properties.name)
      );
    }
  }
});
</script>

<style scoped>
.map-layer-options {
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  padding: 4px 12px 12px 12px;
  text-align: left;
}
</style>
