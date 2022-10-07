<template>
  <div class="notes">
    <v-tabs-items v-model="tab" class="notes-content">
      <v-tab-item class="notes-list">
        <v-card-title>
          <span class="overline">
            {{ $t('notes') }}
          </span>
        </v-card-title>

        <v-list>
          <v-list-item
            v-for="[p, name] in Object.entries(nameByPath)"
            :key="p"
            @click="path = p"
          >
            {{ name }}
          </v-list-item>
        </v-list>
      </v-tab-item>

      <v-tab-item class="note">
        <v-card-title>
          <v-btn icon @click="tab = Number(!tab)">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <span class="overline">
            {{ $t('notes') }}
            <template v-if="path"> / {{ nameByPath[path] }}</template>
          </span>
        </v-card-title>

        <v-card-text>
          <v-textarea
            class="note-textarea"
            :value="note"
            @input="onNoteChange"
            outlined
            hide-details
            no-resize
          ></v-textarea>
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import {MapMutationsToMethods, MapStateToComputed} from '@/types/store';
import Vue from 'vue';
import {Route} from 'vue-router';
import {mapMutations, mapState} from 'vuex';

interface Data {
  tab: number;
  path: string | null;
  nameByPath: Record<string, string>;
}

export default Vue.extend({
  data(): Data {
    return {
      tab: 0,
      path: null,
      nameByPath: {
        potential_solar: `${this.$t(
          'navigation.sustainabilityDomains'
        )} / ${this.$t('navigation.solar')}`,
        'potential_energy-efficiency': `${this.$t(
          'navigation.sustainabilityDomains'
        )} / ${this.$t('navigation.energyEfficiency')}`,
        potential_mobility: `${this.$t(
          'navigation.sustainabilityDomains'
        )} / ${this.$t('navigation.mobility')}`,
        assessment_plans: `${this.$t('navigation.assessment')} / ${this.$t(
          'navigation.plans'
        )}`,
        assessment_stakeholders_: `${this.$t(
          'navigation.assessment'
        )} / ${this.$t('navigation.stakeholders')}`,
        'assessment_urban-data': `${this.$t(
          'navigation.assessment'
        )} / ${this.$t('navigation.urbanData')}`,
        assessment_governance: `${this.$t('navigation.assessment')} / ${this.$t(
          'navigation.governance'
        )}`
      }
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['notes']),
    note(): string {
      return (this.path && this.notes[this.path]) || '';
    }
  },
  watch: {
    tab(newTab: number) {
      if (newTab === 0) {
        this.path = null;
      }
    },
    path(newPath: string) {
      if (newPath) {
        this.tab = 1;
      }
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', ['setNote']),
    onNoteChange(note: string) {
      if (!this.path) {
        return;
      }

      this.setNote({path: this.path, note});
    }
  },
  created() {
    const matchedPath = Object.keys(this.nameByPath).find(path =>
      this.$route.matched.some((match: Route) =>
        match.path.replaceAll('/', '_').includes(path)
      )
    );

    if (matchedPath) {
      this.path = matchedPath;
    }

    this.tab = Number(Boolean(matchedPath));
  }
});
</script>

<style scoped>
.notes,
.notes-content,
.notes-content::v-deep > div,
.notes-list,
.note,
.note-textarea,
.note-textarea >>> .v-input__control,
.note-textarea >>> .v-input__slot {
  height: 100%;
}

.note {
  display: grid;
  grid-template-rows: auto 1fr;
}
</style>
