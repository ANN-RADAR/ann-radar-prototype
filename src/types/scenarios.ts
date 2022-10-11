import {DocumentReference} from 'firebase/firestore';

export interface Scenario {
  id: string;
  name: string;
  baseLayerTypes: Array<string>;
  stakeholdersEngagementsRef?: DocumentReference;
  notesRef: DocumentReference;
}

export interface ScenarioMetaData extends Pick<Scenario, 'id' | 'name'> {
  stakeholdersEngagementsId?: string;
  notesId: string;
}
