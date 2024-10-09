import ReferalRankCard from "~/components/Cards/ReferalRankCard";
import { NestedReferralsLayout } from "..";
import CardIcon from "~/components/icons/CardIcon";
import RankIcon from "~/components/icons/RankIcon";
import { UsersService } from "~/apis/handlers/users";
import { useCallback, useEffect, useState } from "react";
import { IReferralStats } from "~/apis/handlers/users/interfaces";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import { Polygon } from "~/components/Loaders";
import InputField from "~/components/common/InputField";
import Toast from "~/components/common/Toast";

const ReferralsOverview = () => {
	const [stats, setStats] = useState<IReferralStats | null>(null);
	const [emails, setEmails] = useState<string>("");
	const [success, setSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const usersService = new UsersService();
	const fetchReferralsStats = useCallback(() => usersService.getReferralsStats(), [usersService]);

	useEffect(() => {
		fetchReferralsStats().then((data) => {
			setStats(data);
		});
	}, []);

	const sendInvites = async () => {
		try {
			await usersService.inviteFriends(emails.split(","));
			setSuccess(true);
			setEmails("");
		} catch (err) {
			setIsError(true);
		}
	};

	return (
		<div>
			{!stats && <PerformanceSummaryCardLoader />}
			{stats && (
				<div className="flex flex-col md:flex-row gap-2">
					<ReferalRankCard
						title="Current Rank"
						subtext={stats?.currentRank ?? ""}
						Icon={RankIcon}
					/>
					<ReferalRankCard
						title="Current Earnings"
						subtext={`$ ${stats?.currentEarning ?? 0}`}
						Icon={CardIcon}
					/>
				</div>
			)}

			<section className="mt-5">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Referral Link</h3>
				<p className="text-[#414141] font-light">
					Send your referral link to your friends.
				</p>

				<div className="rounded-md flex justify-between border border-[#DEE3F6] bg-white text-[#3E57BF] px-3 py-4 mt-3">
					{!stats && <Polygon size="sm" variant="rounded" className="min-w-[60%]" />}
					{stats && (
						<>
							<p>{stats?.referralLink}</p>
							<button
								onClick={() => navigator.clipboard.writeText(stats?.referralLink)}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M14 7C14 6.068 14 5.602 13.848 5.235C13.7475 4.99218 13.6001 4.77155 13.4143 4.58572C13.2284 4.3999 13.0078 4.25251 12.765 4.152C12.398 4 11.932 4 11 4H8C6.114 4 5.172 4 4.586 4.586C4 5.172 4 6.114 4 8V11C4 11.932 4 12.398 4.152 12.765C4.25251 13.0078 4.3999 13.2284 4.58572 13.4143C4.77155 13.6001 4.99218 13.7475 5.235 13.848C5.602 14 6.068 14 7 14"
										stroke="#08123B"
										strokeWidth="1.5"
									/>
									<path
										d="M18 10H12C10.8954 10 10 10.8954 10 12V18C10 19.1046 10.8954 20 12 20H18C19.1046 20 20 19.1046 20 18V12C20 10.8954 19.1046 10 18 10Z"
										stroke="#08123B"
										strokeWidth="1.5"
									/>
								</svg>
							</button>
						</>
					)}
				</div>
			</section>

			<section className="mt-5">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Referral Code</h3>
				<p className="text-[#414141] font-light">
					Send your Referral code to your friends.
				</p>

				<div className="rounded-md flex justify-between border border-[#DEE3F6] bg-white text-[#3E57BF] px-3 py-4 mt-3">
					{stats ? (
						<>
							<p>{stats?.referralCode}</p>
							<button
								onClick={() => navigator.clipboard.writeText(stats?.referralCode)}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M14 7C14 6.068 14 5.602 13.848 5.235C13.7475 4.99218 13.6001 4.77155 13.4143 4.58572C13.2284 4.3999 13.0078 4.25251 12.765 4.152C12.398 4 11.932 4 11 4H8C6.114 4 5.172 4 4.586 4.586C4 5.172 4 6.114 4 8V11C4 11.932 4 12.398 4.152 12.765C4.25251 13.0078 4.3999 13.2284 4.58572 13.4143C4.77155 13.6001 4.99218 13.7475 5.235 13.848C5.602 14 6.068 14 7 14"
										stroke="#08123B"
										strokeWidth="1.5"
									/>
									<path
										d="M18 10H12C10.8954 10 10 10.8954 10 12V18C10 19.1046 10.8954 20 12 20H18C19.1046 20 20 19.1046 20 18V12C20 10.8954 19.1046 10 18 10Z"
										stroke="#08123B"
										strokeWidth="1.5"
									/>
								</svg>
							</button>
						</>
					) : (
						<Polygon size="sm" variant="rounded" className="min-w-[60%]" />
					)}
				</div>
			</section>

			<section className="mt-5">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Invite Your friends </h3>
				<p className="text-[#414141] font-light">
					Insert your friends email addresses and send them an invitation to join
					TraderApp
				</p>

				<div className="rounded-md flex justify-between border border-[#DEE3F6] bg-white text-[#3E57BF] pl-3 mt-3">
					<div className="py-0.5 flex items-center grow">
						<InputField
							type="text"
							className="py-1"
							placeholder="Enter email addresses"
							onChange={(text) => setEmails(text)}
						/>
					</div>

					<button
						onClick={sendInvites}
						className="bg-[#465ec1] flex gap-0.5 items-center justify-center px-3 py-2 text-nowrap text-white rounded-md"
					>
						<span>Send invite</span>
						<svg
							width="33"
							height="33"
							viewBox="0 0 33 33"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_5856_31235)">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M7.52981 21.1734C5.3902 20.2053 5.14334 17.264 7.09228 15.9522L18.0555 8.5711C20.1549 7.15675 22.9545 8.81916 22.7175 11.3394L21.4851 24.4986C21.2661 26.8377 18.566 28.0279 16.6914 26.6135L13.2151 23.9911L17.3599 17.0109C17.4953 16.7829 17.5346 16.5104 17.4691 16.2534C17.4036 15.9964 17.2386 15.7759 17.0106 15.6405C16.7826 15.5051 16.5101 15.4658 16.2531 15.5313C15.9961 15.5968 15.7756 15.7617 15.6402 15.9898L11.4959 22.9691L7.52981 21.1734Z"
									fill="white"
								/>
							</g>
							<defs>
								<clipPath id="clip0_5856_31235">
									<rect
										width="24"
										height="24"
										fill="white"
										transform="translate(0.0551758 20.6914) rotate(-59.2982)"
									/>
								</clipPath>
							</defs>
						</svg>
					</button>
				</div>
			</section>

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
				/>
			)}
		</div>
	);
};

ReferralsOverview.getLayout = (page: React.ReactElement) => (
	<NestedReferralsLayout>{page}</NestedReferralsLayout>
);
export default ReferralsOverview;
