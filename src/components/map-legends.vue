<template>
  <div class="map-legends">
    <v-sheet
      class="map-legend"
      v-for="[layerType, legend] in Object.entries(legends)"
      :key="layerType"
    >
      <section>
        <h4 class="overline">{{ $t(`layer.${layerType}`) }}</h4>

        <img v-if="'legendUrl' in legend" :src="legend.legendUrl" />

        <v-list v-else class="map-legend-classification text-body-2" dense>
          <template v-for="(category, index) in legend.classification">
            <v-list-item
              v-if="!category.classification || !category.classification.length"
              :key="`${category.from}-${category.to}`"
              class="map-legend-category"
              :disabled="layerClassificationSelection[layerType] != null"
            >
              <v-list-item-icon>
                <div
                  class="map-legend-category-color"
                  :style="`background-color: ${category.color};`"
                />
              </v-list-item-icon>

              <v-list-item-title
                >{{ category.from
                }}<template v-if="category.from !== category.to"
                  >&nbsp;–&nbsp;{{ category.to }}</template
                ><template v-if="category.unit"
                  >&nbsp;{{ $t(`legends.units.${category.unit}`) }}</template
                >
              </v-list-item-title>
            </v-list-item>

            <v-list-group
              v-else
              :key="`${category.from}-${category.to}`"
              :value="layerClassificationSelection[layerType] === index"
              @change="
                setLayerClassificationSelection({
                  layerType,
                  selectedClassificationIndex: !layerClassificationSelection[
                    layerType
                  ]
                    ? index
                    : null
                })
              "
            >
              <template v-slot:prependIcon>
                <div
                  class="map-legend-category-color"
                  :style="`background-color: ${category.color};`"
                />
              </template>

              <template v-slot:activator>
                <v-list-item-title
                  >{{ category.from
                  }}<template v-if="category.from !== category.to"
                    >&nbsp;–&nbsp;{{ category.to }}
                  </template>
                </v-list-item-title>
              </template>

              <v-list-item
                v-for="subcategory in category.classification"
                :key="`${subcategory.from}–${subcategory.to}`"
                class="map-legend-category"
              >
                <v-list-item-icon>
                  <div
                    class="map-legend-category-color"
                    :style="`background-color: ${subcategory.color};`"
                  />
                </v-list-item-icon>

                <v-list-item-title
                  >{{ subcategory.from
                  }}<template v-if="subcategory.from !== subcategory.to"
                    >&nbsp;–&nbsp;{{ subcategory.to }}
                  </template>
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </section>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {LayerConfig, LayerOptions} from '@/types/layers';
import {baseLayersOptions} from '@/constants/layers';
import {
  energyPotentialLayersOptions,
  solarPotentialLayersOptions,
  mobilityPotentialLayersOptions
} from '@/constants/layers';

interface Data {
  baseLayers: Array<LayerOptions>;
  energyLayers: Array<LayerOptions>;
  solarLayers: Array<LayerOptions>;
  mobilityLayers: Array<LayerOptions>;
}

export default Vue.extend({
  props: {
    thematicLayers: {
      type: Array as PropType<Array<LayerOptions>>,
      required: false
    }
  },
  data(): Data {
    return {
      baseLayers: baseLayersOptions,
      energyLayers: energyPotentialLayersOptions,
      solarLayers: solarPotentialLayersOptions,
      mobilityLayers: mobilityPotentialLayersOptions
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'baseLayerTypes',
      'layersConfig',
      'layerClassificationSelection'
    ]),
    availableLayers(): Array<string> {
      return [...this.baseLayers, ...(this.thematicLayers || [])].map(
        ({properties: {name}}) => name
      );
    },
    legends(): Record<string, LayerConfig | {legendUrl: string}> {
      const legendsConfig = this.baseLayerTypes.reduce<
        Record<string, LayerConfig | {legendUrl: string}>
      >((configOrUrl, layer) => {
        if (!this.availableLayers.includes(layer)) {
          return configOrUrl;
        }

        const layerConfig = this.layersConfig[layer];
        const legendUrl = !layerConfig
          ? this.getLegendUrl(layer, [
              ...this.energyLayers,
              ...this.solarLayers,
              ...this.mobilityLayers
            ])
          : null;

        return {
          ...configOrUrl,
          ...(layerConfig && {[layer]: layerConfig}),
          ...(legendUrl && {[layer]: legendUrl})
        };
      }, {});

      if (
        this.$route.path.startsWith('/potential/mobility') &&
        this.layersConfig.mobilityIsochrones
      ) {
        legendsConfig.mobilityIsochrones = this.layersConfig.mobilityIsochrones;
      }

      return legendsConfig;
    }
  },
  watch: {
    baseLayerTypes(newBaseLayerTypes: Array<string>) {
      const removedBaseLayerTypes = Object.keys(
        this.layerClassificationSelection
      ).filter(selectedLayerType =>
        newBaseLayerTypes.includes(selectedLayerType)
      );
      // Reset the legend
      for (const layerType of removedBaseLayerTypes) {
        this.setLayerClassificationSelection({
          layerType,
          selectedClassificationIndex: null
        });
      }
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setLayerClassificationSelection'
    ]),
    getLegendUrl: (layer: string, layerOptions: LayerOptions[]) => {
      const layerOption = layerOptions.find(
        baseLayer => baseLayer.properties.name === layer
      );
      if (layerOption && layerOption.type === 'tile') {
        const layerUrl = layerOption.source
          ? Array.isArray(layerOption.source)
            ? layerOption.source[0].url
            : layerOption.source.url
          : null;
        const layerId = layerOption.properties?.options
          ? Array.isArray(layerOption.properties.options)
            ? layerOption.properties.options[0].id
            : null
          : null;

        return layerUrl && layerId
          ? {
              legendUrl: `${layerUrl}?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&LAYER=${layerId}`
            }
          : null;
      }
    }
  }
});
</script>

<style scoped>
.map-legends {
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
}

.map-legend {
  min-width: 11rem;
  padding: 4px 12px 12px 12px;
}

.map-legend-classification {
  margin: 0 -8px;
  padding: 0;
}

.map-legend-classification >>> .v-list-item {
  min-height: 2em;
  padding: 0 8px;
}

.map-legend-classification >>> .v-list-item__icon:first-child {
  min-width: 1rem;
  height: 1rem;
  margin-right: 8px;
}

.map-legend-category-color {
  width: 1rem;
  height: 1rem;
}

.map-legend-classification [aria-disabled='true'] .map-legend-category-color {
  background-color: transparent !important;
  border: 1px dashed rgba(0, 0, 0, 0.38);
}

.map-legend-classification >>> .v-list-item .v-list-item__content {
  padding: 2px 0;
}

.map-legend-classification >>> .v-list-group__items .v-list-item {
  padding-left: calc(1rem + 16px);
}
</style>
