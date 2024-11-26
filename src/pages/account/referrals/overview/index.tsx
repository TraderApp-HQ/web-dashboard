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

const ReferralsOverview = () => {
	const [stats, setStats] = useState<IReferralStats | null>(null);
	const [success, setSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const usersService = new UsersService();
	const fetchReferralsStats = useCallback(() => usersService.getReferralsStats(), [usersService]);

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

			<SendInvite onError={setIsError} onSuccess={setSuccess} />

			<section className="mt-5 rounded-md bg-white text-[#3E57BF] px-4 py-4">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Referral Progress </h3>
				<p className="text-[#414141] font-light">
					Move form on step to another by sending an invitation to your friend.
				</p>
				{/* <ProgressBar /> */}
				<div className="progressContainer">
					<div className="barContainer bg-[#EEEDEC] rounded-md my-2">
						<div
							className="bar bg-[#DA7B07] rounded-md"
							style={{ width: "10%", height: "13px" }}
						></div>
					</div>
					<p className="text-right text-[#344054]">10% Completed</p>
				</div>
			</section>

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

			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="Referral Error"
					message={"Failed to send invites to friends"}
					autoVanish
					autoVanishTimeout={10}
					onToastClose={() => setIsError(false)}
				/>
			)}
		</div>
	);
};

ReferralsOverview.getLayout = (page: React.ReactElement) => (
	<NestedReferralsLayout>{page}</NestedReferralsLayout>
);
export default ReferralsOverview;
