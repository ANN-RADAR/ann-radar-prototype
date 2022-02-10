import {AdminLevelUnit} from '@/types/admin-levels';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import {AdminLevelProperties} from './AdminLevelProperties';

export class Stadt extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = 'fhh';
  static featureNameProp = 'fhh';

  static nameProp = 'name';

  name: string;

  constructor(data: Stadt) {
    super(data);

    this.name = data.name;
  }

  getId(): string {
    return this.name;
  }

  getName(): string {
    return this.name;
  }

  getFeatureId(feature: Feature<Geometry>): string {
    return feature.get(Stadt.featureIdProp);
  }

  getFeatureName(feature: Feature<Geometry>): string {
    return feature.get(Stadt.featureNameProp);
  }
}
