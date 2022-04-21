export enum ScorecardType {
  PLANS = 'plans'
}

export type ScorecardMeasureId = string;

export type Scorecard = Array<{
  objective?: string;
  measures: Array<{id: ScorecardMeasureId; description: string}>;
}>;
