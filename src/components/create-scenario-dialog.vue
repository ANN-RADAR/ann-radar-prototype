<template>
  <div>
    <ConfirmCreateDialog
      v-if="showConfirm"
      :title="$t('scenarios.createScenario')"
      :content="$t('scenarios.createScenarioWarning')"
      :confirmText="$t('scenarios.createScenario')"
      @onConfirm="createAndLoad()"
      @onCancel="showConfirm = false"
    />
    <v-dialog v-model="open" max-width="600px">
      <template v-slot:activator="{on, attrs}">
        <v-btn text v-bind="attrs" v-on="on" :disabled="disabled">
          {{ $t('scenarios.createScenario') }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{ $t('scenarios.createScenario') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Name" v-model="name"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="!scenarioMetaData ? createAndLoad() : (showConfirm = true)"
            :disabled="!name"
          >
            {{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {database} from '@/libs/firebase';
import {ANNRadarCollection} from '@/types/firestore';
import {MapActionsToMethods, MapStateToComputed} from '@/types/store';
import {addDoc, collection} from 'firebase/firestore';
import {Vue} from 'vue-property-decorator';
import {mapActions, mapState} from 'vuex';

import ConfirmCreateDialog from './confirm-dialog.vue';

interface Data {
  open: boolean;
  name: string;
  showConfirm: boolean;
}
export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data(): Data {
    return {
      open: false,
      name: '',
      showConfirm: false
    };
  },
  components: {
    ConfirmCreateDialog
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['scenarioMetaData'])
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['fetchScenarioDetails']),
    async createAndLoad() {
      const note = await addDoc(
        collection(database, ANNRadarCollection.NOTES),
        {}
      );
      const balanceScorecard = await addDoc(
        collection(database, ANNRadarCollection.BALANCED_SCORECARDS),
        {}
      );
      const scenario = {
        name: this.name,
        baseLayerTypes: [],
        balancedScorecardsRef: balanceScorecard,
        notesRef: note
      };

      const {id} = await addDoc(
        collection(database, ANNRadarCollection.SCENARIOS),
        scenario
      );

      this.fetchScenarioDetails({id, ...scenario});

      this.close();
    },
    close() {
      this.name = '';
      this.open = false;
    }
  }
});
</script>