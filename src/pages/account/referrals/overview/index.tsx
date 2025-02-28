import { NestedReferralsLayout } from "..";
import CardIcon from "~/components/icons/CardIcon";
import RankIcon from "~/components/icons/RankIcon";
import React, { useMemo, useState } from "react";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import Toast from "~/components/common/Toast";
import { InviteCode } from "~/components/AccountLayout/Referrals/InviteCode";
import { InviteModal } from "~/components/AccountLayout/Referrals/InviteModal";
import ReferalCard from "~/components/Cards/ReferalCard";
import ProgressTracker from "~/components/common/ProgressTracker";
import { useReferralOverview } from "~/hooks/useReferralOverview";
import { useReferralRank } from "~/hooks/useReferralRank";
import { ProgressTrackerLoader } from "~/components/Loaders/ReferralProgressLoader";
import useUserProfileData from "~/hooks/useUserProfileData";

const ReferralsOverview = () => {
	const INVITE_BUTTON_TEXT = "Invite Friends";

	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { data: stats, isLoading, error: referralError } = useReferralOverview();

	const { rankRequirements } = useReferralRank(stats?.rankData);

	const { isAdmin } = useUserProfileData();

	const isTestReferralTrackingInProgress = useMemo(
		() => stats?.isTestReferralTrackingInProgress && isAdmin,
		[isAdmin, stats?.isTestReferralTrackingInProgress],
	);

	const handleError = (err: Error) => {
		setError(err);
	};

	const handleModalOpen = () => setIsModalOpen(true);
	const handleModalClose = () => setIsModalOpen(false);

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
				<div className="flex flex-col gap-2 relative">
					{/* Mobile Invite Button - Above Cards */}
					<button
						className="md:hidden w-full flex items-center justify-center bg-[#1836B2] hover:bg-[#152b8f] active:bg-[#152b8f] text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 mb-2"
						onClick={handleModalOpen}
					>
						{INVITE_BUTTON_TEXT}
					</button>
					<div className="flex flex-col md:flex-row gap-2 relative">
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
						{/* Desktop Invite Button */}
						<button
							className="hidden md:flex items-center justify-center bg-[#1836B2] hover:bg-[#152b8f] active:bg-[#152b8f] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 absolute right-0 top-0"
							onClick={handleModalOpen}
						>
							{INVITE_BUTTON_TEXT}
						</button>
					</div>
				</div>
			)}

			<InviteModal
				openModal={isModalOpen}
				onClose={handleModalClose}
				onSuccess={setSuccess}
				onError={handleError}
			/>

			<InviteCode code={stats?.referralLink ?? ""} title="Referral Link" />

			<InviteCode code={stats?.referralCode ?? ""} title="Referral Code" />

			<ProgressTracker
				title={
					<div className="flex items-center gap-1">
						<span>Referral Progress</span>
						{isTestReferralTrackingInProgress && (
							<span className="text-sm font-normal text-[#414141]">
								(Referral stats updating, refresh page to check progress)
							</span>
						)}
					</div>
				}
				body="Move from one step to another by sending an invitation to your friend."
				tiers={rankRequirements}
				isLoading={isLoading}
				loadingComponent={ProgressTrackerLoader}
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
