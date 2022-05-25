<template>
  <v-app-bar app elevation="2" dense class="header">
    <v-app-bar-title>{{ $t('annRadar') }}</v-app-bar-title>

    <span class="scenario-name" v-if="scenarioMetaData">{{
      $t('scenarios.scenario') + scenarioMetaData.name
    }}</span>
    <div class="header-actions">
      <ScenarioCreateDialog />
      <ScenarioLoadDialog />
      <v-btn text @click="saveScenario" :disabled="!canSave">
        <span>{{ $t('scenarios.saveScenario') }}</span>
        <v-icon right>mdi-content-save</v-icon>
      </v-btn>

      <v-btn text active-class="primary--text" to="/laboratories">
        <span>{{ $t('realLaboratories') }}</span>
        <v-icon right>mdi-notebook-edit-outline</v-icon>
      </v-btn>

      <v-btn
        text
        active-class="primary--text"
        :input-value="showNotes"
        @click="$emit('toggleNotes')"
      >
        <span>{{ $t('notes') }}</span>
        <v-icon right>mdi-notebook-edit-outline</v-icon>
      </v-btn>

      <v-btn text @click="logOut">
        <span>{{ $t('auth.logout') }}</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </div>

    <template v-slot:extension>
      <v-tabs v-model="tab">
        <v-tab to="/potential">{{ $t('navigation.potential') }}</v-tab>
        <v-tab to="/plans">{{ $t('navigation.plans') }}</v-tab>
        <v-tab to="/stakeholders">{{ $t('navigation.stakeholders') }}</v-tab>
        <v-tab to="/urban-data">{{ $t('navigation.urbanData') }}</v-tab>
        <v-tab to="/governance">{{ $t('navigation.governance') }}</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import {logOut} from '@/libs/firebase';
import {mapActions, mapState} from 'vuex';
import {MapActionsToMethods, MapStateToComputed} from '@/types/store';

import ScenarioCreateDialog from './create-scenario-dialog.vue';
import ScenarioLoadDialog from '../components/scenario-load-dialog.vue';

interface Data {
  tab: number;
}

export default Vue.extend({
  props: {
    showNotes: {
      type: Boolean,
      required: true
    }
  },
  components: {
    ScenarioCreateDialog,
    ScenarioLoadDialog
  },
  data(): Data {
    return {
      tab: 0
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['scenarioMetaData']),
    ...(mapState as MapStateToComputed)('user', ['roles']),
    canSave(): boolean {
      const isWriter = this.roles.includes('WRITER');
      const hasScenarioMetaData = Boolean(this.scenarioMetaData);

      return hasScenarioMetaData && isWriter;
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['saveScenario']),
    logOut() {
      logOut().then(() => {
        this.$router.push('/login');
      });
    }
  }
});
</script>

<style scoped>
.header::v-deep > div {
  display: grid;
  grid-template-columns: 1fr auto auto;
}

.header-actions {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
}

.scenario-name {
  padding: 0 32px;
}
</style>
