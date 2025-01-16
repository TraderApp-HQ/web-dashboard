import { NestedReferralsLayout } from "..";
import CardIcon from "~/components/icons/CardIcon";
import RankIcon from "~/components/icons/RankIcon";
import { useState } from "react";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import Toast from "~/components/common/Toast";
import { InviteCode } from "~/components/AccountLayout/Referrals/InviteCode";
import { SendInvite } from "~/components/AccountLayout/Referrals/SendInvite";
import ReferalCard from "~/components/Cards/ReferalCard";
import ProgressTracker from "~/components/common/ProgressTracker";
import { useReferralOverview } from "~/hooks/useReferralOverview";
import { useReferralRank } from "~/hooks/useReferralRank";

const ReferralsOverview = () => {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const { data: stats, isLoading, error: referralError } = useReferralOverview();
	const { rankRequirements } = useReferralRank({
		personalATC: stats?.currentEarning ?? 0,
		communityATC: stats?.communityATC ?? 0,
		communityMembers: stats?.communityMembers ?? 0,
	});

	const handleError = (err: Error) => {
		setError(err);
	};

	return (
		<div>
			{isLoading && <PerformanceSummaryCardLoader />}
			{referralError && (
				<Toast
					type="error"
					variant="filled"
					title="Referral Data Error"
					message={referralError.message || "Could not load referral data"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
			{stats && (
				<div className="flex flex-col md:flex-row gap-2">
					<ReferalCard
						title="Current Rank"
						subtext={stats?.currentRank ?? ""}
						Icon={RankIcon}
					/>
					<ReferalCard
						title="Current Earnings"
						subtext={`$ ${stats?.currentEarning ?? 0}`}
						Icon={CardIcon}
					/>
				</div>
			)}

			<InviteCode code={stats?.referralLink ?? ""} title="Referral Link" />

			<InviteCode code={stats?.referralCode ?? ""} title="Referral Code" />

			<SendInvite onError={handleError} onSuccess={setSuccess} />

			<ProgressTracker
				title="Referral Progress"
				body="Move from one step to another by sending an invitation to your friend."
				tiers={rankRequirements}
			/>

			{success && (
				<Toast
					type="success"
					variant="filled"
					title="Referral sent"
					message={"Invites have been successfully sent out"}
					autoVanish
					autoVanishTimeout={10}
					onToastClose={() => setSuccess(false)}
				/>
			)}

			{error && (
				<Toast
					type="error"
					variant="filled"
					title="Referral Error"
					message={error.message || "Failed to send invites to friends"}
					autoVanish
					autoVanishTimeout={10}
					onToastClose={() => setError(null)}
				/>
			)}
		</div>
	);
};

ReferralsOverview.getLayout = (page: React.ReactElement) => (
	<NestedReferralsLayout>{page}</NestedReferralsLayout>
);
export default ReferralsOverview;
