<template>
  <div class="laboratory">
    <div class="map">
      <Map :drawingSource="source" showDrawingTools />
      <div class="map-overlays top-right">
        <MapStyleSwitcher />
      </div>
    </div>
    <v-card>
      <v-card-title>
        {{
          laboratory
            ? $t('laboratories.editLaboratory', {name: laboratory.name})
            : $t('laboratories.addLaboratory')
        }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          class="laboratory-name"
          outlined
          hide-details
          name="name"
          :label="$t('laboratories.name')"
          type="text"
          v-model="laboratoryName"
        ></v-text-field>
        <v-textarea
          outlined
          hide-details
          no-resize
          name="description"
          :label="$t('laboratories.description')"
          type="text"
          v-model="laboratoryDescription"
        ></v-textarea>

        <v-alert v-if="error" class="error-message" dense text type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="onSave" :disabled="!canSave">{{ $t('save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  Laboratory,
  LaboratoryId,
  MapActionsToMethods,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';

import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import Vue from 'vue';
import {mapActions, mapMutations, mapState} from 'vuex';

import Map from './map-component.vue';
import MapStyleSwitcher from './map-style-switcher.vue';

interface Data {
  error: string;
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
  props: {
    laboratoryId: {
      type: String,
      required: false
    }
  },
  data(): Data {
    return {
      error: '',
      source,
      laboratoryName: '',
      laboratoryDescription: ''
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['laboratories']),
    canSave(): boolean {
      const features = this.source.getFeatures();

      return (
        features.length === 1 &&
        Boolean(this.laboratoryDescription) &&
        Boolean(this.laboratoryName)
      );
    },
    laboratory(): Laboratory | null {
      return (
        (this.laboratoryId && this.laboratories[this.laboratoryId]) || null
      );
    }
  },
  watch: {
    laboratoryId(newLaboratoryId: LaboratoryId) {
      if (newLaboratoryId && !this.laboratories[newLaboratoryId]) {
        this.$router.push('/laboratories');
      } else {
        this.updateLaboratoryData(this.laboratories[newLaboratoryId]);
      }
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setLaboratory']),
    ...(mapActions as MapActionsToMethods)('root', ['saveLaboratory']),
    updateLaboratoryData(newLaboratory: Laboratory | null | undefined) {
      if (newLaboratory) {
        this.laboratoryName = newLaboratory.name;
        this.laboratoryDescription = newLaboratory.description;
        this.source.addFeature(newLaboratory.feature);
      } else {
        this.laboratoryName = '';
        this.laboratoryDescription = '';
        this.source.clear();
      }
    },
    onSave() {
      this.saveLaboratory({
        id: this.laboratoryId,
        name: this.laboratoryName,
        description: this.laboratoryDescription,
        feature: this.source.getFeatures()[0]
      })
        .then(() => {
          this.$router.push('laboratories');
        })
        .catch(error => {
          this.error = error;
        });
    }
  },
  created() {
    if (this.laboratoryId && !this.laboratory) {
      this.$router.push('/laboratories');
      return;
    }

    // Set laboratory data for the current route
    if (this.laboratory) {
      this.updateLaboratoryData(this.laboratory);
    }
  },
  destroyed() {
    // Reset drawing source
    this.source.clear();
  }
});
</script>

<style scoped>
.map {
  position: relative;
}

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

.error-message {
  margin: 1rem 0;
}
</style>
