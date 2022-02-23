<template>
  <v-dialog v-model="dialog" v-if="selectedAreas" max-width="600px">
    <template v-slot:activator="{on, attrs}">
      <v-btn
        color="primary"
        dark
        style="margin-bottom: 20px"
        v-bind="attrs"
        v-on="on"
      >
        Auswahl speichern
      </v-btn>
    </template>
    <v-card>
      <v-card-title> Auswahl speichern </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Name" v-model="title"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Abbrechen
        </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Speichern </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

import {Session} from '@/types/typings';

@Component
export default class SaveDialog extends Vue {
  @Prop() selectedAreas!: Record<string, any[]>;
  @Prop() notes!: string;
  dialog = false;
  title = '';

  save(): void {
    this.dialog = false;

    this.$emit('save', {
      title: this.title,
      selectedAreas: this.selectedAreas,
      notes: this.notes
    } as Session);

    this.reset();
  }

  reset(): void {
    this.title = '';
  }
}
</script>
