<template>
  <div class="map-layer-switcher">
    <v-menu
      left
      offset-x
      nudge-left="8px"
      rounded="0"
      :close-on-content-click="false"
      :close-on-click="!alwaysVisibleLayers || !alwaysVisibleLayers.length"
      :value="isOpen"
    >
      <template v-slot:activator="{on, attrs}">
        <v-btn
          id="tour-data-layers"
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
            <div
              v-for="layer in visibleThematicLayers"
              :key="layer.properties.name"
            >
              <v-checkbox
                :input-value="baseLayerTypes.includes(layer.properties.name)"
                :label="$t(`layer.${layer.properties.name}`)"
                class="checkbox"
                @change="onLayerChange(layer, $event)"
                dense
                hide-details
              ></v-checkbox>
              <v-radio-group
                v-if="
                  baseLayerTypes.includes(layer.properties.name) &&
                  layer.properties.options &&
                  layer.properties.options.length
                "
                :value="
                  baseLayerOptions[layer.properties.name] ||
                  layer.properties.options[0].id
                "
                dense
                hide-details
                class="sub-radio-group"
              >
                <v-radio
                  v-for="option in layer.properties.options"
                  :key="option.id"
                  :label="
                    $t(
                      `layer.properties.${layer.properties.name}.${option.name}`
                    )
                  "
                  :value="option.id"
                  class="radio"
                  @change="
                    onLayerOptionChange(layer.properties.name, option.id)
                  "
                ></v-radio>
              </v-radio-group>
            </div>
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
              class="checkbox"
              @change="onLayerChange(layer, $event)"
              dense
              hide-details
            ></v-checkbox>
          </section>

          <section v-if="!$route.path.startsWith('/urban-testbeds')">
            <h4 v-if="!showReducedList" class="overline">
              {{ $t('navigation.urbanTestbeds') }}
            </h4>
            <v-checkbox
              v-for="layer in laboratoriesLayers"
              :key="layer.properties.name"
              :input-value="baseLayerTypes.includes(layer.properties.name)"
              :label="$t(`layer.${layer.properties.name}`)"
              class="checkbox"
              @change="onLayerChange(layer, $event)"
              dense
              hide-details
            ></v-checkbox>
          </section>

          <section v-if="$route.path.startsWith('/urban-testbeds')">
            <h4 v-if="!showReducedList" class="overline">
              {{ $t('layerOptions.administrativeBorders') }}
            </h4>
            <v-radio-group
              :value="adminLayerType"
              @change="onAdminAreaLayerChange($event)"
              class="radio-group"
              dense
              hide-details
            >
              <v-radio
                :label="$t('layerOptions.none')"
                :value="null"
                class="radio"
              ></v-radio>
              <v-radio
                v-for="adminLayer in allAdminLayerTypes"
                :key="adminLayer"
                :label="$t(`adminLayer.${adminLayer}`)"
                :value="adminLayer"
                class="radio"
              ></v-radio>
            </v-radio-group>
          </section>
        </div>

        <v-btn
          v-if="alwaysVisibleLayers && alwaysVisibleLayers.length"
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

import {AdminLayerType} from '@/types/admin-layers';
import {LayerOptions} from '@/types/layers';
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {
  baseLayersOptions,
  laboratoriesLayersOptions
} from '../constants/layers';

interface Data {
  isOpen: boolean;
  showReducedList: boolean;
  baseLayers: Array<LayerOptions>;
  laboratoriesLayers: Array<LayerOptions>;
  allAdminLayerTypes: Array<AdminLayerType>;
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
    const hasAlwaysVisibleLayers = Boolean(
      this.alwaysVisibleLayers && this.alwaysVisibleLayers.length
    );
    return {
      isOpen: hasAlwaysVisibleLayers,
      showReducedList: hasAlwaysVisibleLayers,
      baseLayers: baseLayersOptions,
      laboratoriesLayers: laboratoriesLayersOptions,
      allAdminLayerTypes: Object.values(AdminLayerType)
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'baseLayerTypes',
      'baseLayerOptions'
    ]),
    visibleThematicLayers(): Array<LayerOptions> {
      if (!this.showReducedList) {
        return this.thematicLayers || [];
      }
      return (this.thematicLayers || []).filter((layer: LayerOptions) =>
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
    ...(mapMutations as MapMutationsToMethods)('root', [
      'toggleBaseLayerType',
      'setBaseLayerOption',
      'setAdminLayerType'
    ]),
    onLayerChange(layer: LayerOptions, visible: boolean) {
      layer.visible = visible;
      this.toggleBaseLayerType(layer.properties.name);
    },
    onLayerOptionChange(baseLayerType: string, baseLayerOptionId: string) {
      this.setBaseLayerOption({
        baseLayerType,
        baseLayerOptionId
      });
    },
    onAdminAreaLayerChange(newSelectedAdminLayer: AdminLayerType | null) {
      this.setAdminLayerType(newSelectedAdminLayer);
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

.list .checkbox {
  margin-top: -4px;
}

.list .radio-group {
  margin-top: 0;
}

.list .sub-radio-group {
  margin-top: 10px;
  margin-left: 10px;
}

.list .radio {
  margin-top: -8px;
}

.reduced {
  grid-gap: 0;
  padding: 12px;
}
</style>
