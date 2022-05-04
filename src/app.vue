<template>
  <v-app>
    <v-main>
      <Header />
      <v-container
        fluid
        style="display: flex; flex-direction: column; height: 100%; padding: 0"
      >
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapState} from 'vuex';

import {
  MapActionsToMethods,
  MapStateToComputed,
  UserState
} from '@/types/store';

import Header from './components/app-header.vue';

export default Vue.extend({
  components: {
    Header
  },
  computed: {
    ...(mapState as MapStateToComputed)('user', ['data'])
  },
  watch: {
    data(newUserData: UserState['data']) {
      if (newUserData) {
        // Fetch demo scenario as long as we didn't implement the scenario selection
        // TODO: scenario selection
        this.fetchScenario('tzWIt9gWFDVKG0B0CYU3');
      }
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchScenario'])
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
}

.v-application,
.v-application [class*='text-'] {
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
}
</style>
