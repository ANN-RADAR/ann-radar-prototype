export enum ScorecardType {
  PLANS = 'plans'
}

export type Scorecard = Array<{
  objective?: string;
  measures: Array<string>;
}>;
