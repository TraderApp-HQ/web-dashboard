import { ReferralRank } from "~/config/constants";

export interface Milestone {
	title: string;
	hoverText?: string;
	completed: boolean;
}

export interface Tier {
	title: string;
	text: string;
	milestones: Milestone[];
	completed?: boolean;
	actionButton?: boolean;
}

export interface ProgressTrackerProps {
	title: string;
	body: string;
	tiers: Record<string, Tier>;
}

export type ReferralRankType = (typeof ReferralRank)[keyof typeof ReferralRank];

export interface ReferralOverview {
	personalATC: number;
	communityATC: number;
	communityMembers: number;
}
