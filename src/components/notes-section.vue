<template>
  <div class="notes">
    <v-card-title>{{ $t('notes') }}</v-card-title>
    <v-card-text class="notes-content">
      <v-textarea
        class="notes-textarea"
        :value="note"
        @input="onNoteChange"
        :disabled="!adminLayerType"
        filled
        no-resize
      ></v-textarea>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import Vue from 'vue';
import {mapMutations, mapState} from 'vuex';

export default Vue.extend({
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerType',
      'adminLayerData'
    ]),
    note(): string {
      return (
        (this.adminLayerType &&
          this.adminLayerData[this.adminLayerType]?.note) ||
        ''
      );
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setNote']),
    onNoteChange(note: string) {
      if (!this.adminLayerType) {
        return;
      }

      this.setNote({adminLayerType: this.adminLayerType, note});
    }
  }
});
</script>

<style scoped>
.notes-content {
  height: calc(100% - 2rem - 32px);
}

.notes-textarea,
.notes-textarea >>> * {
  height: 100%;
}
</style>
