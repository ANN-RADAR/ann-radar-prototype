import {AdminLayerType} from './admin-layers';

export enum ScorecardType {
  PLANS = 'plans'
}

export type ScorecardMeasureId = string;

export type Scorecard = Array<{
  objective?: string;
  measures: Array<{id: ScorecardMeasureId; description: string}>;
}>;

export type ScorecardRatings = Record<
  AdminLayerType,
  Record<string, Record<ScorecardMeasureId, boolean | undefined>>
>;
