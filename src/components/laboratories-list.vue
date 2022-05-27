<template>
  <div class="laboratories">
    <div class="map">
      <Map />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card class="laboratories-data">
      <v-card-title>{{
        $t(`laboratories.${laboratoryType}.title`)
      }}</v-card-title>

      <v-list class="laboratories-list" v-if="laboratoryEntries.length">
        <v-list-item
          v-for="[laboratoryId, laboratory] in laboratoryEntries"
          :key="laboratoryId"
          :to="`${basePath}/${laboratoryId}`"
        >
          <v-list-item-content>
            <v-list-item-title>{{ laboratory.name }}</v-list-item-title>
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
import {mapState} from 'vuex';

import {MapStateToComputed} from '@/types/store';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
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
    Map,
    MapStyleSwitcher
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['laboratories']),
    laboratoryEntries(): Array<[LaboratoryId, Laboratory]> {
      return Object.entries(this.laboratories).filter(
        ([, {type}]) => type === this.laboratoryType
      );
    }
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

.map {
  position: relative;
}

.map-overlays {
  position: absolute;
  display: flex;
  flex-direction: column;
  grid-gap: 8px;
  padding: 8px;
}

.map-overlays.top-right {
  top: 0;
  right: 0;
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

.emptyMessage {
  color: rgba(0, 0, 0, 0.6);
}
</style>
