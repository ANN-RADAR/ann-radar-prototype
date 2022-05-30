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

// "NEB Pilot Region" Demo Scenario
const TOUR_DEMO_SCENARIO_ID = 'lvRzhEbHfvAyForoGBTv';

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
          header: {title: this.$t('tour.scenarios.title')},
          content: this.$t('tour.scenarios.content.select')
        },
        {
          target: '#tour-create-scenario',
          header: {title: this.$t('tour.scenarios.title')},
          content: this.$t('tour.scenarios.content.create')
        },
        {
          target: '#tour-sustainability-themes',
          header: {title: this.$t('tour.sustainabilityThemes.title')},
          content: this.$t('tour.sustainabilityThemes.content'),
          before: () => {
            if (!this.$route.path.startsWith('/potential')) {
              this.$router.push('/potential');
            }
          }
        },
        {
          target: '#tour-data-layers',
          header: {title: this.$t('tour.dataLayers.title')},
          content: this.$t('tour.dataLayers.content'),
          before: () => {
            if (!this.$route.path.startsWith('/potential')) {
              this.$router.push('/potential');
            }
            document.getElementById('tour-data-layers')?.click();
          }
        },
        {
          target: '#tour-select-urban-areas',
          header: {title: this.$t('tour.urbanAreas.title')},
          content: this.$t('tour.urbanAreas.content.select'),
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
          header: {title: this.$t('tour.urbanAreas.title')},
          content: this.$t('tour.urbanAreas.content.view'),
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
          header: {title: this.$t('tour.results.title')},
          content: this.$t('tour.results.content'),
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
