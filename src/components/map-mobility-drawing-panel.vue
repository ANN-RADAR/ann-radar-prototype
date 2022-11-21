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
            :title="$t('mobilityLocationDrawing.title')"
            :value="true"
          >
            <v-icon>mdi-vector-point-edit</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>

      <v-sheet class="map-mobility-drawing-options">
        <v-btn-toggle
          tile
          mandatory
          class="drawing-panel-toggle"
          :value="drawingMode"
          @change="$emit('update:drawingMode', $event)"
        >
          <v-btn small value="draw">
            {{ $t('mobilityLocationDrawing.draw') }}
          </v-btn>
          <v-btn small value="erase">
            {{ $t('mobilityLocationDrawing.erase') }}
          </v-btn>
        </v-btn-toggle>
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';

export default Vue.extend({
  props: {
    drawingActive: {
      type: Boolean,
      required: true
    },
    drawingMode: {
      type: String as PropType<'draw' | 'erase'>,
      required: true
    }
  }
});
</script>

<style scoped>
.map-mobility-drawing-panel .drawing-panel-toggle >>> .v-btn,
.map-mobility-drawing-options .drawing-panel-toggle >>> .v-btn {
  opacity: 1;
}

.map-mobility-drawing-panel .drawing-panel-toggle >>> .v-item--active,
.map-mobility-drawing-options .drawing-panel-toggle >>> .v-item--active {
  background-color: #1976d1;
  color: white;
}

.map-mobility-drawing-panel
  .drawing-panel-toggle::v-deep.v-btn-toggle
  > .v-btn.v-item--active
  .v-icon,
.map-mobility-drawing-options
  .drawing-panel-toggle::v-deep.v-btn-toggle
  > .v-btn.v-item--active
  .v-icon {
  color: white;
}

.map-mobility-drawing-options .drawing-panel-toggle >>> .v-btn {
  height: 32px;
}

.map-mobility-drawing-options {
  grid-gap: 4px;
  padding: 4px;
  overflow: hidden;
}
</style>
