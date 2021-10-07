<template>
  <v-dialog
    v-model="dialog"
    v-if="selectedAreas && selectedAreas.length"
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
              :key="item.getId()"
            >
              {{ item.getName() }}<span v-if="i < selectedAreas.length - 1">, </span>
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name"
              v-model="title"></v-text-field>
            <v-textarea
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

import { AdminLevelUnit, Selection } from "@/typings";

@Component
export default class SaveDialog extends Vue {
  @Prop() selectedAreas!: AdminLevelUnit[];
  @Prop() type!: string;
  dialog = false;
  title = "";
  note = "";

  save(): void {
    this.dialog = false;

    this.$emit("saveselection", {
      title: this.title,
      type: this.type,
      areas: this.selectedAreas,
      note: this.note
    } as Selection);

    this.reset();
  }

  reset(): void {
    this.title = this.note = "";
  }
}
</script>
