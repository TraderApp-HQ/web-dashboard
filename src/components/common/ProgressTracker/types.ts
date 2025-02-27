import React from "react";
import { ReferralRank } from "~/config/constants";

export interface Milestone {
	title: string;
	hoverText?: string;
	completed: boolean;
}

export interface TierBase {
	title: ReferralRankType;
	text: string;
	milestones: Milestone[];
	completed?: boolean;
}

export interface TierWithAction extends TierBase {
	actionButton: true;
	buttonText: string;
}

export interface TierNoAction extends TierBase {
	actionButton?: false;
}

export type Tier = TierWithAction | TierNoAction;

export interface ProgressTrackerProps {
	title: string;
	body: string;
	tiers: Record<ReferralRankType, Tier> | Record<string, never>;
	isLoading?: boolean;
	loadingComponent?: React.ComponentType;
	error?: Error | null;
	errorComponent?: React.ComponentType<{ error: Error }>;
}

export type ReferralRankType = (typeof ReferralRank)[keyof typeof ReferralRank];

export interface ReferralOverview {
	personalATC: number;
	communityATC: number;
	communitySize: number;
}

export interface IRankCriteriaStatus {
	completed: boolean;
	minValue: number;
}

export type IRankData = {
	[rank in ReferralRankType]: {
		personalATC: IRankCriteriaStatus;
		communityATC: IRankCriteriaStatus;
		communitySize: IRankCriteriaStatus;
	};
};
