<template>
  <v-dialog persistent v-model="open" max-width="400px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <p>
          {{ content }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onCancel">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="blue darken-1" text @click="onConfirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      open: true
    };
  },
  methods: {
    onConfirm() {
      this.$emit('onConfirm');
    },
    onCancel() {
      this.$emit('onCancel');
    }
  }
});
</script>