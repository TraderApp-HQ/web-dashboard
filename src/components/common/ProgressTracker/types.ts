import React from "react";
import { ReferralRank } from "~/config/constants";

export interface Milestone {
	title: string;
	hoverText?: string;
	completed: boolean;
}

export interface TierBase {
	title: ReferralRankType | string;
	icon: string;
	text: string;
	milestones: Milestone[];
	completed?: boolean;
}

interface TierAction {
	text: string;
	buttonText: string;
	buttonAction: () => void;
	disableActionButton?: boolean;
	taskPill?: string;
}

export interface TierWithAction extends Omit<TierBase, "text"> {
	actionButton: true;
	action: TierAction[];
}

export interface TierNoAction extends TierBase {
	actionButton?: false;
}

export type Tier = TierWithAction | TierNoAction;

export interface ProgressTrackerProps {
	title: string | React.ReactElement;
	body: string;
	tiers: Record<ReferralRankType | string, Tier> | Record<string, never>;
	hasOptionalTiers?: boolean;
	optionalTiersTitle?: string;
	optionalTiers?: Record<string, Tier> | Record<string, never>;
	hasDismissBtn?: boolean;
	dismissBtn?: React.ComponentType;
	isLoading?: boolean;
	loadingComponent?: React.ComponentType;
	error?: Error | null;
	errorComponent?: React.ComponentType<{ error?: Error }>;
	isError?: boolean;
	progressBgColor?: string;
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
