<template>
  <v-dialog v-model="open" max-width="600px">
    <template v-slot:activator="{on, attrs}">
      <v-btn v-bind="attrs" v-on="on">
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
              <v-list-item :key="scenario.scenarioTitle">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="scenario.scenarioTitle"
                  ></v-list-item-title>

                  <v-list-item-subtitle
                    v-text="
                      $tc(
                        'scenarios.adminAreasConfigured',
                        Object.values(scenario.adminLayerData).filter(
                          ({selectedFeatureDataKeys, note}) =>
                            selectedFeatureDataKeys.length || note
                        ).length
                      )
                    "
                  ></v-list-item-subtitle>

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
import {mapMutations} from 'vuex';
import {MapMutationsToMethods} from '@/types/store';
import {Scenario} from '@/types/scenario';

interface Data {
  open: boolean;
  isLoading: boolean;
  savedScenarios: Array<Scenario>;
  selectedScenarioIndex: number | null;
}

export default Vue.extend({
  props: {
    scope: {
      type: String,
      required: true
    }
  },
  data(): Data {
    return {
      open: false,
      isLoading: false,
      savedScenarios: [],
      selectedScenarioIndex: null
    };
  },
  watch: {
    open(newOpenState: boolean) {
      if (newOpenState) {
        // Get saved scenarios from local storage when the dialog was opened
        const storageString = localStorage.getItem('scenarios');
        const allSavedScenarios: Record<
          string,
          Array<Scenario>
        > = (storageString && JSON.parse(storageString)) || {};
        this.savedScenarios = allSavedScenarios[this.scope] || [];
      } else {
        // Reset the dialog when it was closed
        this.resetDialog();
      }
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerData',
      'setBaseLayerTypes'
    ]),
    resetDialog() {
      this.selectedScenarioIndex = null;
      this.isLoading = false;
    },
    loadScenario() {
      this.isLoading = true;

      const scenarioToLoad =
        this.selectedScenarioIndex != null &&
        this.savedScenarios[this.selectedScenarioIndex];

      if (!scenarioToLoad) {
        this.isLoading = false;
        return;
      }

      this.setAdminLayerData(scenarioToLoad.adminLayerData);
      this.setBaseLayerTypes(scenarioToLoad.baseLayerTypes);

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
