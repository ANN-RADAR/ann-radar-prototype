<template>
  <div class="wrapper">
    <div class="map">
      <Map
        :mapStyleLayer="mapStyle"
        :activeLayers="activeLayers"
        :selectedFeatures="selectedFeatures[adminLayerType]"
        @onSelectedFeaturesChanged="
          selectedFeatures = {...selectedFeatures, [adminLayerType]: $event}
        "
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
      <Cockpit :selectedFeatures="selectedFeatures[adminLayerType]" />
    </div>
    <div class="inspector">
      <Inspector @onAdminAreaTypeSelected="adminLayerType = $event" />
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
  selectedFeatures: Record<AdminLayerType, Array<Feature<Geometry>>>;
}

export default Vue.extend({
  data(): Data {
    return {
      mapStyleLayersOptions,
      mapStyle,
      activeLayers: [],
      selectedFeatures: {} as Record<AdminLayerType, Array<Feature<Geometry>>>
    };
  },
  components: {
    Map,
    Layers,
    // Notes,
    Cockpit,
    Inspector
  },
  computed: {
    adminLayerType(): AdminLayerType {
      return this.$store.state.adminLayerType;
    }
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
  grid-template-columns: 50% 2fr 1fr;
  grid-template-rows: 1fr 9rem 1fr;
  gap: 0.75rem;
  padding: 0.5rem;
  height: calc(100vh - 64px - 48px);
}

.wrapper > * {
  display: grid;
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
