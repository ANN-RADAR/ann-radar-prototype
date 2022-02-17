import {AdminLevelUnit} from '@/types/admin-layers';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import {AdminLevelProperties} from './AdminLevelProperties';

export class StatGebiet extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = 'statgebiet';
  static featureNameProp = 'statgebiet';

  static nameProp = 'STATGEB';

  STATGEB: string; // amtliche Gebietsnummer
  Soz_Status: string; // Wert Statusindex aus Sozialmonitoring 2020

  constructor(data: StatGebiet) {
    super(data);

    this.STATGEB = data.STATGEB?.toString();
    this.Soz_Status = data.Soz_Status;
  }

  getId(): string {
    return this.STATGEB;
  }

  getName(): string {
    return this.STATGEB;
  }

  getFeatureId(feature: Feature<Geometry>): string {
    return feature.get(StatGebiet.featureIdProp);
  }

  getFeatureName(feature: Feature<Geometry>): string {
    return feature.get(StatGebiet.featureNameProp);
  }
}
