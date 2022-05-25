import Geometry from 'ol/geom/Geometry';
import {Feature} from 'ol';

export type LaboratoryId = string;

export enum LaboratoryType {
  MODEL_QUARTER = 'model-quarters',
  URBAN_TESTBED = 'urban-testbeds'
}

export type Laboratory = {
  id?: LaboratoryId;
  type: LaboratoryType;
  name: string;
  description: string;
  feature: Feature<Geometry>;
};
