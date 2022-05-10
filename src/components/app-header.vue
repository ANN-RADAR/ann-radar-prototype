<template>
  <v-app-bar app elevation="2" dense class="header">
    <v-app-bar-title>{{ $t('annRadar') }}</v-app-bar-title>

    <div class="header-actions">
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
  data(): Data {
    return {
      tab: 0
    };
  },
  methods: {
    logOut() {
      logOut().then(() => {
        this.$router.push('/login');
      });
    }
  }
});
</script>

<style scoped>
header.header {
  z-index: 8;
}

.header::v-deep > div {
  display: grid;
  grid-template-columns: 1fr auto auto;
}

.header-actions {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
}
</style>
