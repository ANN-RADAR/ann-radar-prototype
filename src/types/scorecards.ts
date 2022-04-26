import {AdminLayerType} from './admin-layers';

export enum ScorecardType {
  PLANS = 'plans',
  STAKEHOLDERS = 'stakeholders'
}

export type ScorecardMeasureId = string;

export type Scorecard = Array<{
  objective?: string;
  measures: Array<{id: ScorecardMeasureId; description: string}>;
}>;

export interface ScorecardRating {
  value?: boolean | undefined;
  comment?: string;
}

export type ScorecardRatings = Record<
  AdminLayerType,
  Record<string, Record<ScorecardMeasureId, ScorecardRating>>
>;
