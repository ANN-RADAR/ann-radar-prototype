<!--
  Currently only a blanc wrapper.
  Here we should add other content for adding,
  editing and viewing real laboratories.
-->

<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import {MapActionsToMethods} from '@/types/store';
import Vue from 'vue';
import {mapActions} from 'vuex';

export default Vue.extend({
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchLaboratories'])
  },
  created() {
    this.fetchLaboratories();
  }
});
</script>
