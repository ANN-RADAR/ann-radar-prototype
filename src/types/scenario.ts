import {DocumentReference} from 'firebase/firestore';

export interface Scenario {
  id: string;
  name: string;
  baseLayerTypes: Array<string>;
  balancedScorecardsRef: DocumentReference;
  notesRef: DocumentReference;
}
