<template>
  <v-app-bar app elevation="2" dense class="header">
    <div class="header-top-row">
      <v-app-bar-title class="header-title">
        {{ $t('annRadar') }}
      </v-app-bar-title>

      <ScenarioCreateDialog
        v-if="showScenarioCreateDialog"
        @close="showScenarioCreateDialog = false"
      />
      <ScenarioLoadDialog
        v-if="showScenarioLoadDialog"
        @close="showScenarioLoadDialog = false"
      />

      <span class="scenario-name" v-if="scenarioMetaData">
        {{ $t('scenarios.scenario') }}: {{ scenarioMetaData.name }}
      </span>
      <div class="header-actions">
        <v-menu open-on-hover bottom offset-y>
          <template v-slot:activator="{on, attrs}">
            <v-btn text active-class="primary--text" v-bind="attrs" v-on="on">
              <span>{{ $t('scenarios.scenario') }}</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              @click="showScenarioCreateDialog = true"
              :disabled="!canCreate"
            >
              <v-list-item-title>
                {{ $t('scenarios.createScenario') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="showScenarioLoadDialog = true">
              <v-list-item-title>
                {{ $t('scenarios.loadScenario') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="saveScenario" :disabled="!canSave">
              <v-list-item-title>
                {{ $t('scenarios.saveScenario') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu open-on-hover bottom offset-y>
          <template v-slot:activator="{on, attrs}">
            <v-btn
              text
              active-class="primary--text"
              v-bind="attrs"
              v-on="on"
              :disabled="!currentLayerSelectedFeatureIds.length"
            >
              <span>{{ $t('results.show') }}</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-item to="/potential/solar/results">
              <v-list-item-title>
                {{ $t('navigation.solar') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/potential/energy-efficiency/results">
              <v-list-item-title>
                {{ $t('navigation.energyEfficiency') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/potential/mobility/results">
              <v-list-item-title>
                {{ $t('navigation.mobility') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

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
    </div>

    <div class="logos">
      <img class="iclei-logo" :src="`assets/iclei-logo.png`" />
      <img class="iclei-logo" :src="`assets/hcu-logo.svg`" />
    </div>

    <template v-slot:extension>
      <v-tabs :value="tab" optional>
        <v-menu
          open-on-hover
          bottom
          offset-y
          :close-on-content-click="false"
          content-class="navigation-menu"
        >
          <template v-slot:activator="{on, attrs}">
            <span
              :class="{'v-tab': true, 'v-tab--active': tab === 0}"
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('navigation.sustainabilityDomains') }}
            </span>
          </template>

          <v-list>
            <v-list-item color="primary" to="/potential/solar">
              <v-list-item-title>
                {{ $t('navigation.solar') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item color="primary" to="/potential/energy-efficiency">
              <v-list-item-title>
                {{ $t('navigation.energyEfficiency') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item color="primary" to="/potential/mobility">
              <v-list-item-title>
                {{ $t('navigation.mobility') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Visible assessment tab -->
        <v-menu
          open-on-hover
          bottom
          offset-y
          :close-on-content-click="false"
          min-width="300"
          content-class="navigation-menu"
        >
          <template v-slot:activator="{on, attrs}">
            <span
              :class="{'v-tab': true, 'v-tab--active': tab === 1}"
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('navigation.assessment') }}
            </span>
          </template>

          <v-list>
            <v-list-item color="primary" to="/plans">
              <v-list-item-title>
                {{ $t('navigation.plans') }}
              </v-list-item-title>
            </v-list-item>

            <v-list-group :value="true" no-action prepend-icon>
              <template v-slot:activator>
                <v-list-item-title>
                  {{ $t('navigation.stakeholders') }}
                </v-list-item-title>
              </template>

              <v-list-item to="/stakeholders">
                <v-list-item-title>
                  {{ $t('navigation.stakeholders') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item to="/stakeholders/organizations">
                <v-list-item-title>
                  {{ $t('navigation.stakeholdersOrganizations') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item to="/stakeholders/citizens">
                <v-list-item-title>
                  {{ $t('navigation.citizens') }}
                </v-list-item-title>
              </v-list-item>
            </v-list-group>

            <v-list-item color="primary" to="/urban-data">
              <v-list-item-title>
                {{ $t('navigation.urbanData') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item color="primary" to="/governance">
              <v-list-item-title>
                {{ $t('navigation.governance') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Visible laboratories tab -->
        <v-menu
          open-on-hover
          bottom
          offset-y
          :close-on-content-click="false"
          content-class="navigation-menu"
        >
          <template v-slot:activator="{on, attrs}">
            <span
              :class="{'v-tab': true, 'v-tab--active': tab === 2}"
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('navigation.urbanTestbeds') }}
            </span>
          </template>

          <v-list>
            <v-list-item color="primary" to="/urban-testbeds/model-quarters">
              <v-list-item-title>
                {{ $t('navigation.modelQuarters') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item color="primary" to="/urban-testbeds/urban-testbeds">
              <v-list-item-title>
                {{ $t('navigation.urbanTestbeds') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-tabs>

      <div
        class="admin-area-selection"
        v-if="!$route.path.startsWith('/urban-testbeds')"
      >
        <AdminAreaSelector />
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import {logOut} from '@/libs/firebase';
import {mapActions, mapGetters, mapState} from 'vuex';
import {
  MapActionsToMethods,
  MapGettersToComputed,
  MapStateToComputed
} from '@/types/store';

import ScenarioCreateDialog from './create-scenario-dialog.vue';
import ScenarioLoadDialog from './scenario-load-dialog.vue';
import AdminAreaSelector from './admin-area-selector.vue';

interface Data {
  tab: number;
  showScenarioCreateDialog: boolean;
  showScenarioLoadDialog: boolean;
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
    ScenarioLoadDialog,
    AdminAreaSelector
  },
  data(): Data {
    return {
      tab: 0,
      showScenarioCreateDialog: false,
      showScenarioLoadDialog: false
    };
  },
  watch: {
    $route(to) {
      this.tab = to.path.startsWith('/urban-testbeds')
        ? 2
        : to.path.startsWith('/potential')
        ? 0
        : 1;
    }
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['scenarioMetaData']),
    ...(mapState as MapStateToComputed)('user', ['roles']),
    ...(mapGetters as MapGettersToComputed)('root', [
      'currentLayerSelectedFeatureIds'
    ]),
    canSave(): boolean {
      const isWriter = this.roles.includes('WRITER');
      const hasScenarioMetaData = Boolean(this.scenarioMetaData);

      return hasScenarioMetaData && isWriter;
    },
    canCreate(): boolean {
      return this.roles.includes('WRITER');
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
  display: flex;
}

.header-top-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  flex-grow: 1;
}

.header-title {
  display: flex;
  align-items: center;
}

.header-actions {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 4px;
}

.scenario-name {
  display: flex;
  align-items: center;
  padding: 0 32px;
}

.navigation-menu {
  margin-top: -2px;
}

.navigation-menu-button {
  transform: translateX(-100%);
  opacity: 0;
}

.iclei-logo {
  height: 2.5rem;
}

.iclei-logo:first-child {
  margin-bottom: 0.25rem;
}

.logos {
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0.5rem -0.5rem 0 0;
  flex-direction: column;
}

.admin-area-selection {
  position: absolute;
  top: 100%;
  right: 0;
  padding: 0.5rem 1rem;
  width: 16rem;
}
</style>
