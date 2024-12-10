import { NestedReferralsLayout } from "..";
import CardIcon from "~/components/icons/CardIcon";
import RankIcon from "~/components/icons/RankIcon";
import { UsersService } from "~/apis/handlers/users";
import { useCallback, useEffect, useState } from "react";
import { IReferralStats } from "~/apis/handlers/users/interfaces";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import Toast from "~/components/common/Toast";
import { InviteCode } from "~/components/AccountLayout/Referrals/InviteCode";
import { SendInvite } from "~/components/AccountLayout/Referrals/SendInvite";
import ReferalCard from "~/components/Cards/ReferalCard";
import ProgressTracker from "~/components/common/ProgressTracker";
import { ProgressTrackerProps } from "~/components/common/ProgressTracker/types";

const progressData: ProgressTrackerProps = {
	title: "Referral Progress",
	body: "Move form on step to another by sending an invitation to your friend.",
	tiers: {
		"TA-Recruit": {
			title: "TA-Recruit",
			text: "To finalize your registration and unlock full access, please verify your email address.",
			milestones: [
				{
					title: "Verify Email",
					hoverText: "Please verify your email address to proceed.",
					completed: true,
				},
				{
					title: "Invite 1 Friend",
					hoverText: "Invite one friend to join your community.",
					completed: true,
				},
				{
					title: "Personal ATC $100",
					hoverText: "Invite one friend to join your community.",
					completed: true,
				},
			],
			completed: false,
		},
		"TA-Lieutenant": {
			title: "TA-Lieutenant",
			text: "Build momentum by growing your community size to progress further.",
			milestones: [
				{
					title: "Invite 5 Friends",
					hoverText: "Expand your network by inviting five friends.",
					completed: true,
				},
				{
					title: "Community Size 50+",
					hoverText: "Grow your community to over 50 members.",
					completed: false,
				},
				{
					title: "Personal ATC $200",
					hoverText: "Invite one friend to join your community.",
					completed: false,
				},
			],
			completed: false,
		},
	},
};

const ReferralsOverview = () => {
	const [stats, setStats] = useState<IReferralStats | null>(null);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const usersService = new UsersService();
	const fetchReferralsStats = useCallback(() => usersService.getReferralsStats(), [usersService]);

	const handleError = (err: Error) => {
		setError(err);
	};

	useEffect(() => {
		fetchReferralsStats().then((data) => {
			setStats(data);
		});
	}, []);

	return (
		<div>
			{!stats && <PerformanceSummaryCardLoader />}
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
				title={progressData.title}
				body={progressData.body}
				tiers={progressData.tiers}
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
