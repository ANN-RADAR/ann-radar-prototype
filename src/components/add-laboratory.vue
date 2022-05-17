<template>
  <div class="laboratory">
    <div class="map">
      <Map
        hasMultipleFeatureSelection
        :drawingSource="source"
        :showDrawingTools="true"
      />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card>
      <v-card-title>{{ $t('laboratories.addLaboratory') }}</v-card-title>
      <v-card-text>
        <v-text-field
          class="laboratory-name"
          outlined
          hide-details
          name="name"
          :label="$t('laboratories.name')"
          type="text"
          v-model="laboratoryName"
          @input="onChange"
        ></v-text-field>
        <v-textarea
          outlined
          hide-details
          no-resize
          name="description"
          :label="$t('laboratories.description')"
          type="text"
          @input="onChange"
          v-model="laboratoryDescription"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="saveLaboratory" :disabled="!canSave">Test</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import {MapActionsToMethods, MapMutationsToMethods} from '@/types/store';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import Vue from 'vue';
import {mapActions, mapMutations} from 'vuex';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';

interface Data {
  source: VectorSource<Geometry>;
  laboratoryName: string;
  laboratoryDescription: string;
}

const source = new VectorSource({wrapX: false});

export default Vue.extend({
  components: {
    Map,
    MapStyleSwitcher
  },
  data(): Data {
    return {source, laboratoryName: '', laboratoryDescription: ''};
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setLaboratory']),
    ...(mapActions as MapActionsToMethods)('root', ['saveLaboratory']),
    onChange() {
      this.setLaboratory({
        name: this.laboratoryName,
        description: this.laboratoryDescription,
        feature: this.source.getFeatures()[0]
      });
    }
  },
  computed: {
    canSave(): boolean {
      const features = this.source.getFeatures();

      return (
        features.length === 1 &&
        Boolean(this.laboratoryDescription) &&
        Boolean(this.laboratoryName)
      );
    }
  },
  mounted() {
    this.source.addEventListener('addfeature', this.onChange);
  }
});
</script>

<style scoped>
.laboratory {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  height: 100%;
  padding: 1rem;
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

.laboratory-name {
  padding-bottom: 1rem;
}
</style>
