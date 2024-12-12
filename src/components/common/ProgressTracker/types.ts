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
