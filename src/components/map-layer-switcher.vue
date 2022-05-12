<template>
  <div class="map-layer-switcher">
    <v-menu
      left
      offset-x
      nudge-left="8px"
      rounded="0"
      :close-on-content-click="false"
      :close-on-click="
        Boolean(!alwaysVisibleLayers || !alwaysVisibleLayers.length)
      "
      :value="isOpen"
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
        <div class="list" :class="{reduced: showReducedList}">
          <section v-if="visibleThematicLayers.length">
            <h4 v-if="!showReducedList && thematicLayersTitle" class="overline">
              {{ thematicLayersTitle }}
            </h4>
            <v-checkbox
              v-for="layer in visibleThematicLayers"
              :key="layer.properties.name"
              :input-value="baseLayerTypes.includes(layer.properties.name)"
              :label="$t(`layer.${layer.properties.name}`)"
              style="margin-top: -4px"
              @change="onLayerChange(layer, $event)"
              dense
              hide-details
            ></v-checkbox>
          </section>

          <section v-if="visibleBaseLayers.length">
            <h4 v-if="!showReducedList" class="overline">
              {{ $t('layerOptions.baseLayers') }}
            </h4>
            <v-checkbox
              v-for="layer in visibleBaseLayers"
              :key="layer.properties.name"
              :input-value="baseLayerTypes.includes(layer.properties.name)"
              :label="$t(`layer.${layer.properties.name}`)"
              style="margin-top: -4px"
              @change="onLayerChange(layer, $event)"
              dense
              hide-details
            ></v-checkbox>
          </section>
        </div>

        <v-btn
          v-if="Boolean(alwaysVisibleLayers && alwaysVisibleLayers.length)"
          tile
          small
          elevation="0"
          class="list-toggle"
          @click="toggleReducedList"
        >
          <v-icon>
            {{
              showReducedList
                ? 'mdi-unfold-more-horizontal'
                : 'mdi-unfold-less-horizontal'
            }}
          </v-icon>
        </v-btn>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {LayerOptions} from '@/types/layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {baseLayersOptions} from '../constants/layers';

interface Data {
  isOpen: boolean;
  showReducedList: boolean;
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
    },
    alwaysVisibleLayers: {
      type: Array as PropType<Array<string>>,
      required: false
    }
  },
  data(): Data {
    return {
      isOpen: Boolean(
        this.alwaysVisibleLayers && this.alwaysVisibleLayers.length
      ),
      showReducedList: Boolean(
        this.alwaysVisibleLayers && this.alwaysVisibleLayers.length
      ),
      baseLayers: baseLayersOptions
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['baseLayerTypes']),
    visibleThematicLayers(): Array<LayerOptions> {
      if (!this.showReducedList) {
        return this.thematicLayers;
      }
      return this.thematicLayers.filter((layer: LayerOptions) =>
        this.alwaysVisibleLayers.includes(layer.properties.name)
      );
    },
    visibleBaseLayers(): Array<LayerOptions> {
      if (!this.showReducedList) {
        return this.baseLayers;
      }
      return this.baseLayers.filter((layer: LayerOptions) =>
        this.alwaysVisibleLayers.includes(layer.properties.name)
      );
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setBaseLayerTypes']),
    onLayerChange(layer: LayerOptions, visible: boolean) {
      layer.visible = visible;

      const layers = [...this.baseLayers, ...this.thematicLayers];
      this.setBaseLayerTypes(
        layers
          .filter(layer => layer.visible)
          .map(layer => layer.properties.name)
      );
    },
    toggleReducedList() {
      this.showReducedList = !this.showReducedList;
    }
  }
});
</script>

<style scoped>
.map-layer-options {
  display: flex;
  flex-direction: column;
  width: 16rem;
  max-height: calc(100vh - (3 * 48px) * 0.8);
  overflow: hidden;
}

.list {
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  padding: 4px 12px 12px 12px;
  overflow: auto;
}

.reduced {
  grid-gap: 0;
  padding: 12px;
}
</style>
