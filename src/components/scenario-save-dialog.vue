<template>
  <v-dialog v-model="open" max-width="600px">
    <template v-slot:activator="{on, attrs}">
      <v-btn
        v-bind="attrs"
        v-on="on"
        :disabled="
          !Object.values(adminLayerData).some(
            ({selectedFeatureIds, note}) => selectedFeatureIds.length || note
          ) && !baseLayerTypes.length
        "
      >
        {{ $t('scenarios.saveScenario') }}
      </v-btn>
    </template>

    <v-card>
      <v-form v-model="isFormValid">
        <v-card-title>{{ $t('scenarios.saveScenario') }}</v-card-title>
        <v-card-text>
          <v-text-field
            :label="$t('scenarios.scenarioTitle')"
            v-model="scenarioTitle"
            :rules="scenarioTitleRules"
            filled
          ></v-text-field>

          <p>
            {{
              $tc(
                'scenarios.adminAreasConfigured',
                Object.values(adminLayerData).filter(
                  ({selectedFeatureIds, note}) =>
                    selectedFeatureIds.length || note
                ).length
              )
            }}
            <br />
            {{ $tc('scenarios.scenarioLayers', baseLayerTypes.length) }}
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
            @click="saveScenario()"
            :loading="isSaving"
            :disabled="!isFormValid || isSaving"
          >
            {{ $t('scenarios.saveScenario') }}
            <template v-slot:loader>
              <span>{{ $t('saving') }}</span>
            </template>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState} from 'vuex';
import {MapStateToComputed} from '@/types/store';
import {Scenario} from '@/types/scenario';

interface Data {
  open: boolean;
  isFormValid: boolean;
  isSaving: boolean;
  scenarioTitle: string;
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
      isFormValid: false,
      isSaving: false,
      scenarioTitle: ''
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'adminLayerData',
      'baseLayerTypes'
    ]),
    scenarioTitleRules(): Array<(() => boolean | string) | boolean | string> {
      // Get saved scenarios
      const storageString = localStorage.getItem('scenarios');
      const allSavedScenarios: Record<
        string,
        Array<Scenario>
      > = (storageString && JSON.parse(storageString)) || {};
      const savedScenarios = allSavedScenarios[this.scope] || [];

      // Check if scenario title already exists
      const scenarioTitleAlreadyExists = savedScenarios.some(
        scenario => scenario.scenarioTitle === this.scenarioTitle
      );
      const scenarioTitleValidation = scenarioTitleAlreadyExists
        ? this.$t('scenarios.error.scenarioTitleAlreadyExists')
        : true;

      return [scenarioTitleValidation];
    }
  },
  watch: {
    open(newOpenState: boolean) {
      // Reset the dialog when it was closed
      if (!newOpenState) {
        this.resetDialog();
      }
    }
  },
  methods: {
    resetDialog() {
      this.scenarioTitle = '';
      this.isSaving = false;
    },
    saveScenario() {
      this.isSaving = true;

      // Get saved scenarios
      const storageString = localStorage.getItem('scenarios');
      const allSavedScenarios: Record<
        string,
        Array<Scenario>
      > = (storageString && JSON.parse(storageString)) || {};

      // Add current scenario
      const scenario: Scenario = {
        scenarioTitle: this.scenarioTitle,
        adminLayerData: this.adminLayerData,
        baseLayerTypes: this.baseLayerTypes
      };
      allSavedScenarios[this.scope] = [
        ...allSavedScenarios[this.scope],
        scenario
      ];

      // Save scenarios in local storage
      localStorage.setItem('scenarios', JSON.stringify(allSavedScenarios));

      // Close the dialog
      this.open = false;
    }
  }
});
</script>
