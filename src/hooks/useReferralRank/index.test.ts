import { RankRequirements, useReferralRank } from "~/hooks/useReferralRank";
import { ReferralRank } from "~/config/constants";
import type { IRankData } from "~/components/common/ProgressTracker/types";
import { IReferralCommunityStats, IReferralStats } from "~/apis/handlers/users/interfaces";

describe("useReferralRank", () => {
	const baseRankData: IRankData = {
		[ReferralRank.TA_RECRUIT]: {
			personalATC: { minValue: 100, completed: true },
			communityATC: { minValue: 0, completed: true },
			communitySize: { minValue: 0, completed: true },
			hasRequiredRankReferrals: { minValue: 0, completed: true },
		},
	} as unknown as IRankData;

	const makeStats = (isFirstDepositMade: boolean) =>
		({
			rankData: baseRankData,
			isFirstDepositMade,
		}) as IReferralStats & IReferralCommunityStats;

	it("returns empty requirements when referralStats is undefined", () => {
		const { rankRequirements } = useReferralRank(undefined);
		expect(rankRequirements).toEqual({});
	});

	it("gates only the First Deposit milestone by isFirstDepositMade", () => {
		const { rankRequirements } = useReferralRank(makeStats(false));
		const recruit = (rankRequirements as RankRequirements)[ReferralRank.TA_RECRUIT];
		expect(recruit).toBeDefined();
		expect(recruit.milestones.length).toBeGreaterThan(0);

		// Find the First Deposit milestone
		const firstDepositMilestone = recruit.milestones.find((m) =>
			m.title.includes("First Deposit"),
		);
		expect(firstDepositMilestone).toBeDefined();
		expect(firstDepositMilestone?.completed).toBe(false);

		const otherMilestones = recruit.milestones.filter(
			(m) => !m.title.includes("First Deposit"),
		);
		expect(otherMilestones.every((m) => m.completed)).toBe(true);
	});

	it("marks rank as incomplete if deposit is not made even when milestones are done", () => {
		const { rankRequirements } = useReferralRank(makeStats(false));
		const recruit = (rankRequirements as RankRequirements)[ReferralRank.TA_RECRUIT];
		expect(recruit.completed).toBe(false);
	});

	it("marks rank as complete only when milestones and isFirstDepositMade are true", () => {
		const { rankRequirements } = useReferralRank(makeStats(true));
		const recruit = (rankRequirements as RankRequirements)[ReferralRank.TA_RECRUIT];
		expect(recruit.completed).toBe(true);
	});
});
