<template>
  <v-tour name="demo-tour" :steps="steps"></v-tour>
</template>

<script lang="ts">
import {AdminLayerType} from '@/types/admin-layers';
import {ScenarioMetaData} from '@/types/scenarios';
import {
  MapGettersToComputed,
  MapMutationsToMethods,
  MapStateToComputed
} from '@/types/store';
import Vue from 'vue';
import {mapGetters, mapMutations, mapState} from 'vuex';

// TODO: replace with the id of the demo scenario created by the HCU
const TOUR_DEMO_SCENARIO_ID = 'tzWIt9gWFDVKG0B0CYU3';

export default Vue.extend({
  computed: {
    ...(mapState as MapStateToComputed)('root', [
      'scenarioMetaData',
      'adminLayerType'
    ]),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ]),
    steps(): Array<unknown> {
      return [
        {
          target: '#tour-load-scenario',
          header: {title: '1 – Scenarios'},
          content: 'Select a predefined scenario ...'
        },
        {
          target: '#tour-create-scenario',
          header: {title: '1 – Scenarios'},
          content: '... or build your own scenario.'
        },
        {
          target: '#tour-sustainability-themes',
          header: {title: '2 – Sustainability Themes'},
          content: 'Sustainability Themes',
          before: () => {
            if (!this.$route.path.startsWith('/potential')) {
              this.$router.push('/potential');
            }
          }
        },
        {
          target: '#tour-data-layers',
          header: {title: '3 – Data layers'},
          content: 'Choose relevant data layers',
          before: () => {
            if (!this.$route.path.startsWith('/potential')) {
              this.$router.push('/potential');
            }
            document.getElementById('tour-data-layers')?.click();
          }
        },
        {
          target: '#tour-select-urban-areas',
          header: {title: '4 – Urban Areas'},
          content: 'Select functional urban areas',
          before: () => {
            if (!this.$route.path.startsWith('/potential')) {
              this.$router.push('/potential');
            }
            if (!this.adminLayerType) {
              this.setAdminLayerType(AdminLayerType.BOROUGH);
            }
          }
        },
        {
          target: '#map',
          header: {title: '4 – Urban Areas'},
          content: 'Data-based view of urban areas',
          params: {placement: 'right'},
          before: () => {
            if (!this.$route.path.startsWith('/potential')) {
              this.$router.push('/potential');
            }
            if (!this.adminLayerType) {
              this.setAdminLayerType(AdminLayerType.BOROUGH);
            }
          }
        },
        {
          target: '#tour-results',
          header: {title: '5 – View & Discuss Results'},
          content:
            'Select data layers<br/>Balanced Scorecards per area<br/>Sustainability thematic potentials',
          params: {placement: 'left'},
          before: () => {
            this.setAdminLayerType(AdminLayerType.BOROUGH);
            this.setSelectedFeatureIdsOfAdminLayer({
              adminLayerType: AdminLayerType.BOROUGH,
              featureIds: ['Altona', 'Eimsbüttel', 'Hamburg-Mitte']
            });
            this.$router.push('/potential/solar/results');
          }
        }
      ];
    }
  },
  watch: {
    scenarioMetaData(newScenarioMetaData: ScenarioMetaData) {
      if (newScenarioMetaData.id === TOUR_DEMO_SCENARIO_ID) {
        this.$tours['demo-tour'].start();
      }
    }
  },
  methods: {
    ...(mapMutations as MapMutationsToMethods)('root', [
      'setAdminLayerType',
      'setSelectedFeatureIdsOfAdminLayer'
    ])
  }
});
</script>
