import {AdminLayerType} from './admin-layers';

export enum StakeholdersEngagementType {
  ORGANIZATIONS = 'organizations',
  CITIZENS = 'citizens'
}

export type StakeholdersEngagementTemplate = Array<{
  objective?: string;
  measures: Array<{id: StakeholdersEngagementMeasureId; description: string}>;
}>;

export interface StakeholdersEngagementRating {
  value?: boolean | undefined;
  comment?: string;
}

export type StakeholdersEngagementMeasureId = string;

export type StakeholdersEngagement = {
  ratings: Record<
    StakeholdersEngagementMeasureId,
    StakeholdersEngagementRating
  >;
  links: string;
};

export type StakeholdersEngagementRatings = Record<
  AdminLayerType,
  Record<string /* feature id */, StakeholdersEngagement>
>;
