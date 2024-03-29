<template>
  <div class="laboratory">
    <Map
      showLayerSwitcher
      showStyleSwitcher
      hasDrawingTools
      :drawingOptions="{
        source,
        mode: 'draw',
        type: 'Polygon',
        style: laboratoriesDrawAreaStyle,
        maxNumberOfDrawings: 1
      }"
      :drawingSource="source"
      drawingType="Polygon"
      disableFeatureSelection
    />
    <v-card class="laboratories-data">
      <v-card-title>
        {{
          laboratory
            ? $t(`laboratories.${laboratoryType}.edit`, {name: laboratory.name})
            : $t(`laboratories.${laboratoryType}.add`)
        }}
      </v-card-title>
      <v-card-text class="laboratories-form">
        <form id="laboratories-form" @submit="onSave" ref="form" novalidate>
          <label>{{ $t('laboratories.projectName') }}*</label>
          <v-text-field
            class="laboratory-input"
            outlined
            dense
            hide-details
            name="project-name"
            type="text"
            v-model="laboratoryData.projectName"
            required
          ></v-text-field>

          <label>{{ $t('laboratories.name') }}*</label>
          <v-text-field
            class="laboratory-input"
            outlined
            dense
            hide-details
            name="name"
            type="text"
            v-model="laboratoryData.name"
            required
          ></v-text-field>

          <label>{{ $t('laboratories.runtime') }}</label>
          <v-text-field
            class="laboratory-input"
            outlined
            dense
            hide-details
            name="runtime"
            type="text"
            v-model="laboratoryData.runtime"
          ></v-text-field>

          <label>{{ $t('laboratories.budget') }}</label>
          <v-text-field
            class="laboratory-input"
            outlined
            dense
            hide-details
            name="budget"
            type="text"
            v-model="laboratoryData.budget"
          ></v-text-field>

          <div class="laboratory-input">
            <label>{{ $t('laboratories.location') }}*</label>
            <v-text-field
              outlined
              dense
              hide-details
              name="location"
              type="text"
              v-model="laboratoryData.location"
              required
            ></v-text-field>

            <div class="drawing-wrapper">
              <v-alert class="drawing-hint" dense text type="info">
                {{ $t('laboratories.drawingHint') }}
              </v-alert>

              <input
                class="drawing-hidden-input"
                name="hasFeature"
                type="checkbox"
                :checked="hasFeature"
                required
                ref="featureInput"
              />
            </div>
          </div>

          <label>{{ $t('laboratories.goals') }}</label>
          <v-textarea
            class="laboratory-input"
            outlined
            dense
            hide-details
            name="goals"
            v-model="laboratoryData.goals"
          ></v-textarea>

          <div class="laboratory-input">
            <label class="label-with-add-button">
              {{ $t('laboratories.stakeholders') }}
              <v-btn icon small @click="addStakeholder">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </label>

            <div
              class="laboratory-stakeholder"
              v-for="(stakeholder, index) in laboratoryData.stakeholders"
              :key="`stakeholder-${index}`"
            >
              <v-select
                class="laboratory-stakeholder-type"
                outlined
                dense
                hide-details
                :label="$t('laboratories.stakeholderType')"
                :items="
                  stakeholderTypes.map(type => ({
                    text: $t(`laboratories.stakeholderTypes.${type}`),
                    value: type
                  }))
                "
                v-model="laboratoryData.stakeholders[index].type"
              ></v-select>
              <v-select
                class="laboratory-stakeholder-category"
                outlined
                dense
                hide-details
                :label="$t('laboratories.stakeholderCategory')"
                :items="[
                  ...stakeholderCategories.map(category => ({
                    text: $t(`laboratories.stakeholderCategories.${category}`),
                    value: category
                  })),
                  {text: $t('laboratories.other'), value: 'other'}
                ]"
                @change="onStakeholderCategoryChange($event, index)"
                v-model="laboratoryData.stakeholders[index].category"
              ></v-select>
              <v-text-field
                v-if="laboratoryData.stakeholders[index].category === 'other'"
                class="laboratory-stakeholder-custom-category"
                outlined
                dense
                hide-details
                name="stakeholder-category"
                :placeholder="$t('laboratories.enterStakeholderCategory')"
                type="text"
                v-model="customStakeholderCategory[index]"
              ></v-text-field>
              <v-text-field
                class="laboratory-stakeholder-name"
                outlined
                dense
                hide-details
                name="stakeholder-name"
                :label="$t('laboratories.stakeholderName')"
                type="text"
                v-model="laboratoryData.stakeholders[index].name"
              ></v-text-field>

              <v-btn
                v-if="laboratoryData.stakeholders.length > 1"
                icon
                small
                @click="removeStakeholder(index)"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="laboratory-input">
            <label>{{ $t('laboratories.sectors') }}</label>
            <v-checkbox
              v-for="sector in sectors"
              :key="sector"
              v-model="laboratoryData.sectors"
              dense
              hide-details
              :label="$t(`laboratories.sector.${sector}`)"
              :value="sector"
            ></v-checkbox>

            <div>
              <v-checkbox
                v-model="addCustomSector"
                dense
                hide-details
                :label="$t('laboratories.other')"
              ></v-checkbox>
              <v-text-field
                v-if="addCustomSector"
                class="indent"
                outlined
                dense
                hide-details
                name="custom-sector"
                :placeholder="$t('laboratories.enterSector')"
                type="text"
                v-model="customSector"
              ></v-text-field>
            </div>
          </div>

          <div class="laboratory-input">
            <label>{{ $t('laboratories.experimentalGovernance') }}</label>
            <v-checkbox
              v-for="experimentalGovernance in experimentalGovernanceOptions"
              :key="experimentalGovernance"
              v-model="laboratoryData.experimentalGovernance"
              dense
              hide-details
              :label="
                $t(
                  `laboratories.experimentalGovernanceOptions.${experimentalGovernance}`
                )
              "
              :value="experimentalGovernance"
            ></v-checkbox>

            <div>
              <v-checkbox
                v-model="addCustomExperimentalGovernance"
                dense
                hide-details
                :label="$t('laboratories.other')"
              ></v-checkbox>
              <v-text-field
                v-if="addCustomExperimentalGovernance"
                class="indent"
                outlined
                dense
                hide-details
                name="custom-experimental-governance"
                :placeholder="$t('laboratories.enterExperimentalGovernance')"
                type="text"
              ></v-text-field>
            </div>
          </div>

          <div class="laboratory-input">
            <label class="label-with-add-button">
              {{ $t('laboratories.links') }}
              <v-btn icon small @click="addLink">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </label>

            <div
              class="laboratory-link"
              v-for="(link, index) in laboratoryData.links"
              :key="`link-${index}`"
            >
              <v-text-field
                outlined
                dense
                hide-details
                name="link"
                type="text"
                :placeholder="$t('laboratories.link')"
                v-model="laboratoryData.links[index]"
              ></v-text-field>
              <v-btn
                v-if="laboratoryData.links.length > 1"
                icon
                small
                @click="removeLink(index)"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </div>
          </div>

          <v-alert v-if="error" class="error-message" dense text type="error">
            {{ error }}
          </v-alert>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" form="laboratories-form">{{ $t('save') }}</v-btn>
        <v-btn v-if="laboratoryId" @click="createCopy">{{ $t('copy') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  Laboratory,
  LaboratoryExperimentalGovernance,
  LaboratorySector,
  LaboratoryStakeholderCategory,
  LaboratoryStakeholderType,
  LaboratoryType
} from '@/types/laboratories';
import {MapActionsToMethods, MapStateToComputed} from '@/types/store';

import Style, {StyleFunction} from 'ol/style/Style';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector';
import Vue, {PropType} from 'vue';
import {mapActions, mapState} from 'vuex';

import {laboratoriesDrawAreaStyle} from '@/constants/map-layer-styles';

import Map from './map-component.vue';

interface Data {
  error: string;
  source: VectorSource<Geometry>;
  hasFeature: boolean;
  laboratoryData: Omit<Laboratory, 'type' | 'feature'>;
  stakeholderTypes: Array<LaboratoryStakeholderType>;
  stakeholderCategories: Array<LaboratoryStakeholderCategory>;
  sectors: Array<LaboratorySector>;
  experimentalGovernanceOptions: Array<LaboratoryExperimentalGovernance>;
  customStakeholderCategory: Array<string>;
  addCustomSector: boolean;
  customSector: string;
  addCustomExperimentalGovernance: boolean;
  customExperimentalGovernance: string;
  laboratoriesDrawAreaStyle: StyleFunction | Style;
}

const EMPTY_LABORATORY_DATA = {
  projectName: '',
  name: '',
  location: '',
  stakeholders: [{name: ''}],
  sectors: [],
  experimentalGovernance: [],
  links: ['']
};

const source = new VectorSource({wrapX: false});

export default Vue.extend({
  components: {
    Map
  },
  props: {
    laboratoryType: {
      type: String as PropType<LaboratoryType>,
      required: true
    },
    laboratoryId: {
      type: String,
      required: false
    },
    copiedLaboratoryId: {
      type: String,
      required: false
    },
    basePath: {
      type: String,
      required: false
    },
    returnTo: {
      type: String,
      required: true
    }
  },
  data(): Data {
    return {
      error: '',
      source,
      hasFeature: false,
      laboratoryData: EMPTY_LABORATORY_DATA,
      stakeholderTypes: Object.values(LaboratoryStakeholderType),
      stakeholderCategories: Object.values(LaboratoryStakeholderCategory),
      sectors: Object.values(LaboratorySector),
      experimentalGovernanceOptions: Object.values(
        LaboratoryExperimentalGovernance
      ),
      customStakeholderCategory: [''],
      addCustomSector: false,
      customSector: '',
      addCustomExperimentalGovernance: false,
      customExperimentalGovernance: '',
      laboratoriesDrawAreaStyle
    };
  },
  computed: {
    ...(mapState as MapStateToComputed)('root', ['laboratories']),
    laboratory(): Laboratory | null {
      const id = this.laboratoryId || this.copiedLaboratoryId || null;
      const lab = (id && this.laboratories[id]) || null;

      if (lab && this.copiedLaboratoryId) {
        // Remove location information of copied laboratory
        lab.location = '';
      }

      return lab;
    }
  },
  watch: {
    laboratory(newLaboratory) {
      if (newLaboratory) {
        // Fill form with laboratory data
        this.updateLaboratoryData(newLaboratory);
      } else if (this.laboratoryId) {
        // Return to laboratories list if there's no laboratory with the given id found
        this.$router.push(this.returnTo);
      }
    },
    $route() {
      // Reset drawing source on route change
      this.source.clear();
    },
    addCustomSector(newAddCustomSector: boolean) {
      if (!newAddCustomSector) {
        this.customSector = '';
      }
    },
    addCustomExperimentalGovernance(
      newAddCustomExperimentalGovernance: boolean
    ) {
      if (!newAddCustomExperimentalGovernance) {
        this.customExperimentalGovernance = '';
      }
    }
  },
  methods: {
    ...(mapActions as MapActionsToMethods)('root', ['saveLaboratory']),
    updateLaboratoryData(newLaboratory: Laboratory | null | undefined) {
      if (newLaboratory) {
        // Fill form with laboratory data and add laboratory feature to the map
        const {
          feature,
          stakeholders,
          sectors,
          experimentalGovernance,
          ...data
        } = newLaboratory;

        const stakeholdersWithSelectedCategories = stakeholders.map(
          (stakeholder, index) => {
            if (
              !stakeholder.category ||
              (this.stakeholderCategories as Array<string>).includes(
                stakeholder.category
              )
            ) {
              return stakeholder;
            }

            this.customStakeholderCategory[index] = stakeholder.category;
            return {...stakeholder, category: 'other'};
          }
        );

        this.addCustomSector = false;
        let selectedSectors: Array<LaboratorySector> = [];
        sectors.forEach(sector => {
          if ((this.sectors as Array<string>).includes(sector)) {
            selectedSectors.push(sector as LaboratorySector);
          } else {
            this.addCustomSector = true;
            this.customSector = sector;
          }
        });

        this.addCustomExperimentalGovernance = false;
        let definedExperimentalGovernance: Array<LaboratoryExperimentalGovernance> =
          [];
        experimentalGovernance.forEach(option => {
          if (
            (this.experimentalGovernanceOptions as Array<string>).includes(
              option
            )
          ) {
            definedExperimentalGovernance.push(
              option as LaboratoryExperimentalGovernance
            );
          } else {
            this.addCustomExperimentalGovernance = true;
            this.customExperimentalGovernance = option;
          }
        });

        this.laboratoryData = {
          ...EMPTY_LABORATORY_DATA,
          ...data,
          stakeholders: stakeholdersWithSelectedCategories,
          sectors: selectedSectors,
          experimentalGovernance: definedExperimentalGovernance
        };
        this.source.addFeature(feature.clone());
      } else {
        // Reset form
        this.laboratoryData = EMPTY_LABORATORY_DATA;
        this.customStakeholderCategory = [''];
        this.addCustomSector = false;
        this.customSector = '';
        this.addCustomExperimentalGovernance = false;
        this.customExperimentalGovernance = '';
        this.source.clear();
      }
    },
    validateFeature() {
      const featureInputElement = this.$refs.featureInput as
        | HTMLInputElement
        | undefined;

      if (featureInputElement) {
        const validityState = featureInputElement.validity;

        if (validityState.valueMissing) {
          featureInputElement.setCustomValidity(
            'You must draw an area on the map.'
          );
        } else {
          featureInputElement.setCustomValidity('');
        }
      }
    },
    onSave(event: Event) {
      event.preventDefault();

      // Run custom validations
      this.validateFeature();

      // Run browser form validation
      const formElement = this.$refs.form as HTMLFormElement | undefined;
      const formIsValid = formElement?.reportValidity();

      if (!formIsValid) {
        return;
      }

      const {stakeholders, sectors, experimentalGovernance, links, ...data} =
        this.laboratoryData;

      this.saveLaboratory({
        ...data,
        stakeholders: stakeholders
          .map((stakeholder, index) => {
            const {category, ...data} = stakeholder;
            if (category === 'other') {
              return {...data, category: this.customStakeholderCategory[index]};
            }
            return stakeholder;
          })
          .filter(({name, type, category}) =>
            Boolean(name || type || category)
          ),
        sectors: [...sectors, this.customSector].filter(Boolean),
        experimentalGovernance: [
          ...experimentalGovernance,
          this.customExperimentalGovernance
        ].filter(Boolean),
        links: links.filter(Boolean),
        id: this.laboratoryId,
        type: this.laboratoryType,
        feature: this.source.getFeatures()[0]
      })
        .then(() => {
          this.$router.push(this.returnTo);
        })
        .catch((error: string) => {
          this.error = error;
        });
    },
    addStakeholder() {
      this.laboratoryData.stakeholders.push({name: ''});
      this.customStakeholderCategory.push('');
    },
    removeStakeholder(index: number) {
      this.laboratoryData.stakeholders.splice(index, 1);
      this.customStakeholderCategory.splice(index, 1);
    },
    addLink() {
      this.laboratoryData.links.push('');
    },
    removeLink(index: number) {
      this.laboratoryData.links.splice(index, 1);
    },
    onStakeholderCategoryChange(category: string, index: number) {
      if (category !== 'other') {
        this.customStakeholderCategory[index] = '';
      }
    },
    createCopy() {
      this.$router.push(`${this.basePath}/copy/${this.laboratoryId}`);
    }
  },
  created() {
    if (this.laboratoryId && !this.laboratory) {
      this.$router.push(this.returnTo);
      return;
    }

    // Handle laboratory feature changes
    this.source.on('addfeature', () => {
      this.hasFeature = true;
    });
    this.source.on('clear', () => {
      this.hasFeature = false;
    });
  },
  destroyed() {
    // Reset drawing source
    this.source.clear();
  }
});
</script>

<style scoped>
.laboratory {
  display: grid;
  grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
  grid-template-rows: 100%;
  gap: 1rem;
  min-height: 0;
  height: 100%;
  padding: 1rem;
}

.laboratories-data {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.laboratories-form {
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
}

.laboratory-input {
  padding-bottom: 1rem;
}

.laboratory-stakeholder {
  display: grid;
  grid-auto-columns: 1fr 1fr 28px;
  grid-gap: 0.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.laboratory-stakeholder-custom-category {
  grid-column: 2;
}

.laboratory-stakeholder-name {
  grid-column-start: 1;
  grid-column-end: 3;
}

.laboratory-stakeholder > button {
  grid-column: 3;
  grid-row-start: 1;
  grid-row-end: 3;
}

.laboratory-link {
  display: grid;
  grid-template-columns: 1fr 28px;
  grid-gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.label-with-add-button {
  display: block;
  margin-bottom: 0.25rem;
}

.label-with-add-button > button {
  margin-bottom: 0.125rem;
}

.indent {
  margin-left: 32px;
}

.drawing-wrapper {
  position: relative;
}

.drawing-hint {
  margin-top: 0.5rem;
}

.drawing-hidden-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
}

.error-message {
  margin: 1rem 0;
}
</style>
