import Geometry from 'ol/geom/Geometry';
import {Feature} from 'ol';

export type LaboratoryId = string;

export enum LaboratoryType {
  MODEL_QUARTER = 'model-quarters',
  URBAN_TESTBED = 'urban-testbeds'
}

export enum LaboratoryStakeholderType {
  PROJECT_PARTNER = 'project-partner',
  ASSOCIATE = 'associate'
}

export enum LaboratoryStakeholderCategory {
  MUNICIPAL = 'municipal',
  ACADEMIC = 'academic',
  CIVIC = 'civic',
  BUSINESS = 'business'
}

export enum LaboratorySector {
  SOLAR = 'solar',
  ENERGY_EFFICIENCY = 'energy-efficiency',
  MOBILITY = 'mobility',
  INTEGRATED_PLANNING = 'integrated-planning'
}

export enum LaboratoryExperimentalGovernance {
  EXCEPTIONS_TO_LEGAL_REGULATIONS = 'exceptions-to-legal-regulations',
  CITIZEN_DRIVEN_LOCATION_BASED_URBAN_DEVELOPMENT = 'citizen-driven-location-based-urban-development'
}

export type Laboratory = {
  id?: LaboratoryId;
  type: LaboratoryType;
  projectName: string;
  name: string;
  runtime?: string;
  budget?: string;
  location: string;
  goals?: string;
  stakeholders: Array<{
    name: string;
    type?: LaboratoryStakeholderType;
    category?: LaboratoryStakeholderCategory | string;
  }>;
  sectors: Array<LaboratorySector | string>;
  experimentalGovernance: Array<LaboratoryExperimentalGovernance | string>;
  links: Array<string>;
  feature: Feature<Geometry>;
};
