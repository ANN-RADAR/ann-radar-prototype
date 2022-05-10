<template>
  <v-dialog v-model="open" max-width="600px">
    <template v-slot:activator="{on, attrs}">
      <v-btn text v-bind="attrs" v-on="on">
        {{ $t('scenarios.loadScenario') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>{{ $t('scenarios.loadScenario') }}</v-card-title>
      <v-card-text>
        <v-list class="scenarios-list" two-line v-if="savedScenarios.length">
          <v-list-item-group
            v-model="selectedScenarioIndex"
            active-class="primary--text"
          >
            <template v-for="(scenario, index) in savedScenarios">
              <v-list-item :key="scenario.name">
                <v-list-item-content>
                  <v-list-item-title v-text="scenario.name"></v-list-item-title>

                  <v-list-item-subtitle
                    v-text="
                      $tc(
                        'scenarios.scenarioLayers',
                        scenario.baseLayerTypes.length
                      )
                    "
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider
                v-if="index < savedScenarios.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>

        <p v-else class="grey--text">
          {{ $t('scenarios.noSavedScenarios') }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="open = false">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="loadScenario()"
          :loading="isLoading"
          :disabled="selectedScenarioIndex == null || isLoading"
        >
          {{ $t('scenarios.loadScenario') }}
          <template v-slot:loader>
            <span>{{ $t('loading') }}</span>
          </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions} from 'vuex';
import {MapActionsToMethods} from '@/types/store';

import {collection, getDocs} from 'firebase/firestore';
import {database} from '../libs/firebase';
import {ANNRadarCollection} from '@/types/firestore';

import {Scenario} from '@/types/scenario';

interface Data {
  open: boolean;
  isLoading: boolean;
  savedScenarios: Scenario[];
  selectedScenarioIndex: number | null;
}
export default Vue.extend({
  data(): Data {
    return {
      open: false,
      isLoading: false,
      savedScenarios: [],
      selectedScenarioIndex: null
    };
  },
  watch: {
    async open(newOpenState: boolean) {
      if (newOpenState) {
        const scenarios = await this.fetchScenarios();
        if (scenarios) {
          this.savedScenarios = scenarios;
        }
      } else {
        // Reset the dialog when it was closed
        this.resetDialog();
      }
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['setScenario']),
    async fetchScenarios(): Promise<Scenario[] | null> {
      try {
        const scenarioRef = collection(database, ANNRadarCollection.SCENARIOS);
        const scenarioSnapshot = await getDocs(scenarioRef);

        return scenarioSnapshot.docs.map(doc => {
          const {name, baseLayerTypes, balancedScorecardsRef, notesRef} =
            doc.data();
          return {
            id: doc.id,
            baseLayerTypes,
            name,
            balancedScorecardsRef,
            notesRef
          };
        });
      } catch (error) {
        console.error('Error loading scenarios:', error);
        return null;
      }
    },
    resetDialog() {
      this.selectedScenarioIndex = null;
      this.isLoading = false;
    },
    loadScenario() {
      this.isLoading = true;
      const scenarioToSet =
        this.selectedScenarioIndex != null &&
        this.savedScenarios[this.selectedScenarioIndex];
      if (!scenarioToSet) {
        this.isLoading = false;
        return;
      }
      this.setScenario(scenarioToSet);
      // Close the dialog
      this.open = false;
    }
  }
});
</script>

<style scoped>
.scenarios-list {
  overflow: auto;
  max-height: 50vh;
}
</style>