import { NestedReferralsLayout } from "..";
import CardIcon from "~/components/icons/CardIcon";
import RankIcon from "~/components/icons/RankIcon";
import React, { useState } from "react";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import Toast from "~/components/common/Toast";
import { InviteCode } from "~/components/AccountLayout/Referrals/InviteCode";
import { SendInvite } from "~/components/AccountLayout/Referrals/SendInvite";
import ReferalCard from "~/components/Cards/ReferalCard";
import ProgressTracker from "~/components/common/ProgressTracker";
import { useReferralOverview } from "~/hooks/useReferralOverview";
import { useReferralRank } from "~/hooks/useReferralRank";
import { MdRefresh } from "react-icons/md";
import { ProgressTrackerLoader } from "~/components/Loaders/ReferralProgressLoader";

const ReferralsOverview = () => {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const {
		data: stats,
		isLoading,
		error: referralError,
		refetch,
		isRefetching,
	} = useReferralOverview();

	const { rankRequirements } = useReferralRank(stats?.rankData);

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
						subtext={stats?.currentRank ?? "---"}
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

			{stats?.isTestReferralTrackingInProgress ? (
				<section className="mt-5 border border-[#DEE3F6] rounded-md bg-white text-[#3E57BF] px-4 py-4">
					<div className="flex flex-col items-center justify-center p-6">
						<p className="text-[#102477] text-lg font-medium mb-3">
							Referral tracking is in progress...
						</p>

						<p className="text-[#414141] text-sm mb-4">
							This may take a few moments. Please click the refresh button to check
							for updates.
						</p>
						<button
							onClick={() => refetch()}
							disabled={isRefetching}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
								isRefetching
									? "bg-[#E7ECFE]/70 cursor-not-allowed"
									: "bg-[#E7ECFE] hover:bg-[#D9E1FD]"
							}`}
						>
							<MdRefresh
								className={`text-[#1836B2] ${isRefetching ? "animate-spin" : ""}`}
								size={18}
							/>
							<span className="text-[#1836B2] font-medium">Refresh</span>
						</button>
					</div>
				</section>
			) : (
				<ProgressTracker
					title="Referral Progress"
					body="Move from one step to another by sending an invitation to your friend."
					tiers={rankRequirements}
					isLoading={isLoading}
					loadingComponent={ProgressTrackerLoader}
				/>
			)}

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
