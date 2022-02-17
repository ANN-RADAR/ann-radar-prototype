<template>
  <div class="wrapper">
    <div class="map">
      <Map
        :mapStyleLayer="mapStyle"
        :adminLayerType="adminLayerType"
        :activeLayers="activeLayers"
        @onSelectedFeaturesChanged="selectedFeatures = $event"
      />
      />
    </div>
    <div class="layers">
      <Layers
        @mapStyleChanged="mapStyle = $event"
        @layersChanged="activeLayers = $event"
      />
    </div>
    <div class="notes">notes</div>
    <div class="cockpit">
      <Cockpit
        :selectedFeatures="selectedFeatures"
        :adminLayerType="adminLayerType"
      />
    </div>
    <div class="inspector">
      <Inspector
        @onAdminAreaTypeSelected="adminLayerType = $event"
        :selectedFeatures="selectedFeatures"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {AdminLayerType} from '@/types/admin-layers';
import {LayerOptions} from '@/types/layers';
import {Options as TileSourceOptions} from 'ol/source/TileWMS';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';

import Map from './map-component.vue';
import Layers from './energy-potential-layers.vue';
import Cockpit from './energy-potential-cockpit.vue';
import Inspector from './energy-potential-inspector.vue';

import {mapStyleLayersOptions} from '@/constants/layers';

const mapStyle = mapStyleLayersOptions[0].properties.name;

interface Data {
  mapStyleLayersOptions: Array<LayerOptions<TileSourceOptions>>;
  mapStyle: string;
  activeLayers: Array<string>;
  adminLayerType: AdminLayerType | null;
  selectedFeatures: Array<Feature<Geometry>>;
}

export default Vue.extend({
  data(): Data {
    return {
      mapStyleLayersOptions,
      mapStyle,
      activeLayers: [],
      adminLayerType: null,
      selectedFeatures: []
    };
  },
  components: {
    Map,
    Layers,
    // Notes,
    Cockpit,
    Inspector
  },
  methods: {
    onLegendUrlsChange(legendUrls: Record<string, string>) {
      console.log(legendUrls);
    }
  }
});
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 50% 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.5rem;
  height: 100%;
}

.map {
  grid-column: 1 / 2;
  grid-row: 1 / 4;
}

.layer {
  grid-column: 2 / 3;
  grid-row: 1 / 4;
}

.cockpit {
  grid-column: 2 / 4;
  grid-row: 2 / 3;
}

.inspector {
  grid-column: 2 / 4;
  grid-row: 3 / 4;
}
</style>
