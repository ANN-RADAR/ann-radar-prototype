<template>
  <div class="map-mobility-drawing-panel">
    <v-menu
      left
      offset-x
      nudge-left="8px"
      rounded="0"
      :value="drawingActive"
      :close-on-click="false"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{on, attrs}">
        <v-btn-toggle
          tile
          class="drawing-panel-toggle"
          :value="drawingActive"
          @change="$emit('update:drawingActive', $event || false)"
        >
          <v-btn
            fab
            small
            elevation="2"
            v-bind="attrs"
            v-on="on"
            :title="$t('mapStyles')"
            :value="true"
          >
            <v-icon>mdi-vector-point-edit</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    drawingActive: {
      type: Boolean,
      required: true
    }
  }
});
</script>

<style scoped>
.map-mobility-drawing-panel .drawing-panel-toggle >>> .v-btn {
  opacity: 1;
}

.map-mobility-drawing-panel .drawing-panel-toggle >>> .v-item--active {
  background-color: #1976d1;
  color: white;
}

.map-mobility-drawing-panel
  .drawing-panel-toggle::v-deep.v-btn-toggle
  > .v-btn.v-item--active
  .v-icon {
  color: white;
}
</style>
