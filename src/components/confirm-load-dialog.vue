<template>
  <v-dialog persistent v-model="open" max-width="400px">
    <v-card>
      <v-card-title>{{ $t('scenarios.loadScenario') }}</v-card-title>
      <v-card-text>
        <p>
          {{ $t('scenarios.loadScenarioWarning') }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onCancel">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="blue darken-1" text @click="onLoad">
          {{ $t('scenarios.loadScenario') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      open: true
    };
  },
  methods: {
    onLoad() {
      this.$emit('onLoad');
    },
    onCancel() {
      this.$emit('onCancel');
    }
  }
});
</script>