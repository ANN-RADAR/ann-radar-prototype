<template>
  <div class="wrapper">
    <div class="potential">
      <div class="map">
        <Map hasMultipleFeatureSelection />
        <div class="map-overlays top-right">
          <MapLayerSwitcher
            :thematicLayers="solarPotentialLayers"
            :thematicLayersTitle="$t('layerOptions.solarLayers')"
          />
          <MapStyleSwitcher />
        </div>
        <div class="map-overlays bottom-right">
          <MapLegends />
        </div>
      </div>
      <v-card>
        <AdminAreasInspector>
          <SolarPotentialInspectorTable />
        </AdminAreasInspector>
      </v-card>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Map from './map-component.vue';
import MapLayerSwitcher from './map-layer-switcher.vue';
import MapStyleSwitcher from './map-style-switcher.vue';
import MapLegends from './map-legends.vue';
import AdminAreasInspector from './admin-areas-inspector.vue';
import SolarPotentialInspectorTable from './solar-potential-inspector-table.vue';

import {LayerOptions} from '@/types/layers';
import {solarPotentialLayersOptions} from '../constants/layers';

interface Data {
  solarPotentialLayers: Array<LayerOptions>;
}

export default Vue.extend({
  components: {
    Map,
    MapLayerSwitcher,
    MapStyleSwitcher,
    MapLegends,
    AdminAreasInspector,
    SolarPotentialInspectorTable
  },
  data(): Data {
    return {
      solarPotentialLayers: solarPotentialLayersOptions
    };
  }
});
</script>

<style scoped>
.potential {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  height: 100%;
  padding: 1rem;
}

.potential > * {
  position: relative;
  display: grid;
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

.map-overlays.bottom-right {
  bottom: 0;
  right: 0;
}
</style>
