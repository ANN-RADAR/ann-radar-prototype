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

    <Tour />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import Header from './components/app-header.vue';
import Notes from './components/app-notes.vue';
import Tour from './components/app-tour.vue';

import {mapActions} from 'vuex';
import {MapActionsToMethods} from '@/types/store';

import {ScorecardType} from '@/types/scorecards';

interface Data {
  showNotes: boolean;
}

export default Vue.extend({
  components: {
    Header,
    Notes,
    Tour
  },
  data(): Data {
    return {
      showNotes: true
    };
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', [
      'fetchAdminLayerData',
      'fetchBalancedScorecard',
      'fetchBalancedScorecardRatings'
    ])
  },
  created() {
    this.fetchAdminLayerData();
    Object.values(ScorecardType).forEach(scorecardType => {
      this.fetchBalancedScorecard(scorecardType);
      this.fetchBalancedScorecardRatings(scorecardType);
    });
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
  grid-template-rows: 48px 1fr;
  height: 100%;
}

.route-wrapper > div > :last-child {
  grid-row-end: 3;
}
</style>
