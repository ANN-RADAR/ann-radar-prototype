<template>
  <v-dialog
    v-model="dialog"
    v-if="selectedAreas.length"
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
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
      <v-card-title>
        Auswahl speichern
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <span
              v-for="(item, i) in selectedAreas"
              :key="item[idProp]"
            >
              {{ item[nameProp] }}<span v-if="i < selectedAreas.length - 1">, </span>
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              solo
              name="notes-input"
              label="Notizen"
              v-model="note"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save()"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Baublock, Bezirk, Selection, Stadtteil, StatGebiet } from "@/typings";

@Component
export default class SaveDialog extends Vue {
  @Prop() selectedAreas!: (Bezirk | Stadtteil | StatGebiet | Baublock)[];
  @Prop() type!: string;
  @Prop() idProp!: string;
  @Prop() nameProp!: string;
  dialog = false;
  note = "";

  save(): void {
    this.dialog = false;

    this.$emit("saveselection", {
      type: this.type,
      areas: this.selectedAreas,
      note: this.note
    } as Selection);
  }
}
</script>
