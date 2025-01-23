import { ReferralOverview, ReferralRankType } from "~/components/common/ProgressTracker/types";
import { RANK_REQUIREMENTS } from "~/config/constants";

type RankRequirements = Record<
	ReferralRankType,
	{
		title: ReferralRankType;
		text: string;
		milestones: Array<{
			title: string;
			hoverText: string;
			completed: boolean;
		}>;
		completed: boolean;
	}
>;

export const useReferralRank = (overview: ReferralOverview) => {
	const generateRankRequirements = (overview: ReferralOverview): RankRequirements => {
		return Object.entries(RANK_REQUIREMENTS).reduce((acc, [rank, reqs]) => {
			acc[rank as ReferralRankType] = {
				title: rank as ReferralRankType,
				text: reqs.text,
				milestones: [
					{
						title: `Personal ATC ($${reqs.personalATC}+)`,
						hoverText: "Minimum Active Trading Capital in your account",
						completed: overview.personalATC >= reqs.personalATC,
					},
					...(reqs.communityATC > 0
						? [
								{
									title: `Community TTC ($${reqs.communityATC}+)`,
									hoverText: `Minimum cumulative Total Trading Capital of $${reqs.communityATC}`,
									completed: overview.communityATC >= reqs.communityATC,
								},
							]
						: []),
					...(reqs.communityMembers > 0
						? [
								{
									title: `Community Size (${reqs.communityMembers}+)`,
									hoverText: `Grow your community to over ${reqs.communityMembers} active referrals.`,
									completed: overview.communityMembers >= reqs.communityMembers,
								},
							]
						: []),
				],
				completed:
					overview.personalATC >= reqs.personalATC &&
					overview.communityATC >= reqs.communityATC &&
					overview.communityMembers >= reqs.communityMembers,
			};
			return acc;
		}, {} as RankRequirements);
	};

	const rankRequirements = generateRankRequirements(overview);

	return { rankRequirements };
};
