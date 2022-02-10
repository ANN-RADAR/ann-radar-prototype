import {AdminLevelUnit} from '@/types/admin-levels';
import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import {AdminLevelProperties} from './AdminLevelProperties';

export class Baublock extends AdminLevelProperties implements AdminLevelUnit {
  // Attribute für ID/Name in Geodatenquelle
  static featureIdProp = 'baublockbezeichnung';
  static featureNameProp = 'baublockbezeichnung';

  static nameProp = 'BBZ';

  BBZ: string; // Baublocknummer
  BB_Netto_A: number; // Nettobaublockfläche

  constructor(data: Baublock) {
    super(data);

    this.BBZ = data.BBZ?.toString();
    this.BB_Netto_A = data.BB_Netto_A;
  }

  getId(): string {
    return this.BBZ;
  }

  getName(): string {
    return this.BBZ;
  }

  getFeatureId(feature: Feature<Geometry>): string {
    return feature.get(Baublock.featureIdProp);
  }

  getFeatureName(feature: Feature<Geometry>): string {
    return feature.get(Baublock.featureNameProp);
  }
}
