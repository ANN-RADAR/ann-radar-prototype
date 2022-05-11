import {DocumentReference} from 'firebase/firestore';

export interface Scenario {
  id: string;
  name: string;
  baseLayerTypes: Array<string>;
  balancedScorecardsRef: DocumentReference;
  notesRef: DocumentReference;
}

export interface ScenarioMetaData extends Pick<Scenario, 'id' | 'name'> {
  balancedScorecardsId: string;
  notesId: string;
}
