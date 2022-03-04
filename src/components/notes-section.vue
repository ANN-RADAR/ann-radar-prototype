<template>
  <v-card class="card-notes">
    <v-card-title>{{ $t('notes') }}</v-card-title>
    <v-card-text>
      <v-textarea
        :value="note"
        @input="onNoteChange"
        :disabled="!adminLayerType"
        filled
      ></v-textarea>
    </v-card-text>
  </v-card>
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
