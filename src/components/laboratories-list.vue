<template>
  <div class="laboratories">
    <Map showLayerSwitcher showStyleSwitcher disableFeatureSelection />
    <v-card class="laboratories-data">
      <v-card-title>{{
        $t(`laboratories.${laboratoryType}.title`)
      }}</v-card-title>
      <v-list class="laboratories-list" v-if="laboratoryEntries.length">
        <v-list-item
          v-for="[laboratoryId, laboratory] in laboratoryEntries"
          :key="laboratoryId"
          :to="`${basePath}/${laboratoryId}`"
          :class="{hovered: hoveredLaboratoryId === laboratoryId}"
          @mouseover="setHoveredLaboratoryId(laboratoryId)"
          @mouseout="setHoveredLaboratoryId(null)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ laboratory.projectName }}
              <template v-if="laboratory.projectName && laboratory.name">
                |
              </template>
              {{ laboratory.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ laboratory.location }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-text v-else class="laboratories-list">
        <p class="emptyMessage">
          {{ $t(`laboratories.${laboratoryType}.emptyList`) }}
        </p>
      </v-card-text>

      <v-card-actions>
        <v-btn :to="`${basePath}/new`">
          {{ $t(`laboratories.${laboratoryType}.new`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {mapMutations, mapState} from 'vuex';

import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';

import Map from './map-component.vue';
import {Laboratory, LaboratoryId, LaboratoryType} from '@/types/laboratories';

export default Vue.extend({
  props: {
    laboratoryType: {
      type: String as PropType<LaboratoryType>,
      required: true
    },
    basePath: {
      type: String,
      required: true
    }
  },
  components: {
    Map
  },
  data: () => ({
    selectedItem: 1,
    items: [
      {text: 'Real-Time', icon: 'mdi-clock'},
      {text: 'Audience', icon: 'mdi-account'},
      {text: 'Conversions', icon: 'mdi-flag'}
    ]
  }),
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'laboratories',
      'hoveredLaboratoryId'
    ]),
    laboratoryEntries(): Array<[LaboratoryId, Laboratory]> {
      return Object.entries(this.laboratories)
        .filter(([, {type}]) => type === this.laboratoryType)
        .sort(([, laboratoryA], [, laboratoryB]) => {
          const {projectName: projectNameA = '', name: nameA = ''} =
            laboratoryA;
          const {projectName: projectNameB = '', name: nameB = ''} =
            laboratoryB;

          return projectNameA === projectNameB
            ? nameA.localeCompare(nameB)
            : projectNameA.localeCompare(projectNameB);
        });
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setHoveredLaboratoryId'
    ])
  }
});
</script>

<style scoped>
.laboratories {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  min-height: 0;
  height: 100%;
  padding: 1rem;
}

.laboratories-data {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.laboratories-list {
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
}

.hovered::before {
  opacity: 0.04;
}

.emptyMessage {
  color: rgba(0, 0, 0, 0.6);
}
</style>
