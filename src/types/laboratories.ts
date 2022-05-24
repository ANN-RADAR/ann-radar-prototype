import Geometry from 'ol/geom/Geometry';
import {Feature} from 'ol';

export type LaboratoryId = string;

export type Laboratory = {
  id?: LaboratoryId;
  name: string;
  description: string;
  feature: Feature<Geometry>;
};
