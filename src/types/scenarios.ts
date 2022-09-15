import {DocumentReference} from 'firebase/firestore';

export interface Scenario {
  id: string;
  name: string;
  baseLayerTypes: Array<string>;
  balancedScorecardsRef: DocumentReference;
  stakeholdersEngagementsRef?: DocumentReference;
  notesRef: DocumentReference;
}

export interface ScenarioMetaData extends Pick<Scenario, 'id' | 'name'> {
  balancedScorecardsId: string;
  stakeholdersEngagementsId?: string;
  notesId: string;
}
