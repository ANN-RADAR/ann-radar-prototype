<!--
  Currently only a blanc wrapper.
  Here we should add other content for adding,
  editing and viewing real laboratories.
-->

<template>
  <div>
    <router-view :key="$route.params.laboratoryType" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend();
</script>
