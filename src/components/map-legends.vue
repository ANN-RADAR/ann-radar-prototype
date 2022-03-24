<template>
  <div class="map-legends">
    <v-sheet
      class="map-legend"
      v-for="[layerType, legend] in Object.entries(legends)"
      :key="legend.attributeName"
    >
      <section>
        <h4 class="overline">{{ $t(`layer.${layerType}`) }}</h4>

        <v-list class="map-legend-classification text-body-2" dense>
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
                  >&nbsp;–&nbsp;{{ category.to }}
                </template>
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
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import {LayerConfig} from '@/types/layers';

export default Vue.extend({
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'baseLayerTypes',
      'layersConfig',
      'layerClassificationSelection'
    ]),
    legends(): Record<string, LayerConfig> {
      console.log(
        this.baseLayerTypes.reduce((config, layer) => {
          const layerConfig = this.layersConfig[layer];
          return {...config, ...(layerConfig && {[layer]: layerConfig})};
        }, {})
      );
      return this.baseLayerTypes.reduce((config, layer) => {
        const layerConfig = this.layersConfig[layer];
        return {...config, ...(layerConfig && {[layer]: layerConfig})};
      }, {});
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
    ])
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
