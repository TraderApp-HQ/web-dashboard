import { IRankData, ReferralRankType } from "~/components/common/ProgressTracker/types";
import { RANK_REQUIREMENTS, ReferralRank } from "~/config/constants";

type RankRequirements = Record<
	ReferralRankType,
	{
		title: ReferralRankType | string;
		icon: string;
		text: string;
		milestones: Array<{
			title: string;
			hoverText: string;
			completed: boolean;
		}>;
		completed: boolean;
	}
>;

export const useReferralRank = (rankData: IRankData | undefined) => {
	if (!rankData) return { rankRequirements: {} };
	const generateRankRequirements = (rankData: IRankData): RankRequirements => {
		return Object.entries(rankData).reduce((acc, [_rank, value]) => {
			const rank = _rank as ReferralRankType;
			acc[rank] = {
				title: rank,
				icon: rank,
				text: RANK_REQUIREMENTS[rank].text,
				milestones: [
					{
						title: `Personal ATC ($${value.personalATC.minValue}+)`,
						hoverText: "Minimum Active Trading Capital in your account",
						completed: value.personalATC.completed,
					},
					...(value.communityATC.minValue > 0
						? [
								{
									title: `Community ATC ($${value.communityATC.minValue}+)`,
									hoverText: `Minimum cumulative Total Trading Capital of $${value.communityATC.minValue}`,
									completed: value.communityATC.completed,
								},
							]
						: []),
					...(value.communitySize.minValue > 0
						? [
								{
									title: `Community Size (${value.communitySize.minValue}+)`,
									hoverText: `Grow your community to over ${value.communitySize.minValue} active referrals.`,
									completed: value.communitySize.completed,
								},
							]
						: []),
					// Exclude TA_RECRUIT from the referral check as it does not require qualified referrals
					...(value.hasRequiredRankReferrals.minValue > 0 &&
					rank !== ReferralRank.TA_RECRUIT
						? [
								{
									title: `Qualified Referrals (${value.hasRequiredRankReferrals.minValue}+)`,
									hoverText: `Have at least ${value.hasRequiredRankReferrals.minValue} active referrals with equal or higher ranks`,
									completed: value.hasRequiredRankReferrals.completed,
								},
							]
						: []),
				],
				completed:
					rankData[rank].personalATC.completed &&
					rankData[rank].communityATC.completed &&
					rankData[rank].communitySize.completed &&
					rankData[rank].hasRequiredRankReferrals.completed,
			};
			return acc;
		}, {} as RankRequirements);
	};

	const rankRequirements = generateRankRequirements(rankData as IRankData);

	return { rankRequirements };
};
