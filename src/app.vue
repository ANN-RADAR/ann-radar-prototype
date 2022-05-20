<template>
  <v-app>
    <v-main>
      <Header :showNotes="showNotes" @toggleNotes="showNotes = !showNotes" />

      <div class="route-wrapper">
        <router-view />
      </div>

      <v-navigation-drawer
        v-model="showNotes"
        absolute
        temporary
        right
        width="min(34rem, 90%)"
      >
        <Notes v-if="showNotes" />
      </v-navigation-drawer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import Header from './components/app-header.vue';
import Notes from './components/app-notes.vue';

interface Data {
  showNotes: boolean;
}

export default Vue.extend({
  components: {
    Header,
    Notes
  },
  data(): Data {
    return {
      showNotes: true
    };
  }
});
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow-y: auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: hidden;
}

.v-application,
.v-application [class*='text-'] {
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
}

.v-application--wrap,
.v-main,
.route-wrapper {
  height: 100%;
}

.route-wrapper > div {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
}

.route-wrapper > div > :last-child {
  grid-row-end: 3;
}
</style>
