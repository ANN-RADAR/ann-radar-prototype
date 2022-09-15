import {AdminLayerType} from './admin-layers';

export enum StakeholdersEngagementType {
  ORGANIZATIONS = 'organizations',
  CITIZENS = 'citizens'
}

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
