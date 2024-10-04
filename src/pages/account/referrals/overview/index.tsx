import ReferalRankCard from "~/components/Cards/ReferalRankCard";
import { NestedReferralsLayout } from "..";
import CardIcon from "~/components/icons/CardIcon";
import RankIcon from "~/components/icons/RankIcon";
import CheckIcon from "~/components/icons/CheckIcon";

const ReferralsOverview = () => {
	return (
		<div>
			<div className="flex flex-col md:flex-row gap-2">
				<ReferalRankCard title="Current Rank" subtext={"TA-Recruit"} Icon={RankIcon} />
				<ReferalRankCard title="Current Earnings" subtext={"$ 24,000"} Icon={CardIcon} />
			</div>

			<section className="mt-5">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Referral stages</h3>
				<p className="text-[#414141] font-light">
					Move form on step to another by sending an invitation to your friend.
				</p>

				<div className="bg-white rounded-md px-3 py-6 flex gap-4 mt-4">
					{Array(7)
						.fill(0)
						.map((x) => (
							<div key={x} className="flex items-center gap-2 text-[#000030]">
								TA-Recruit
							</div>
						))}
				</div>

				<div className="bg-white rounded-md px-3 py-6 mt-4">
					<div className="flex gap-3 items-center">
						<span className="rounded-full bg-[#ecf0fe] p-2">
							<svg
								width="21"
								height="20"
								viewBox="0 0 21 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M16.182 1.5H5.68201C3.47287 1.5 1.68201 3.29086 1.68201 5.5V14.5C1.68201 16.7091 3.47287 18.5 5.68201 18.5H16.182C18.3911 18.5 20.182 16.7091 20.182 14.5V5.5C20.182 3.29086 18.3911 1.5 16.182 1.5Z"
									stroke="black"
									strokeWidth="1.5"
								/>
								<path
									d="M1.729 5.58984L8.934 9.71984C9.53765 10.0706 10.2234 10.2553 10.9215 10.2553C11.6197 10.2553 12.3054 10.0706 12.909 9.71984L20.134 5.58984"
									stroke="black"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span className="text-[#000030]">TA-Lieutenant</span>
					</div>

					<p className="text-[#414141] my-5 font-light">
						To finalise your registration and unlock full access of your account, please
						verify your email address.
					</p>

					<div className="flex items-center gap-6 text-[#414141]">
						<div className="flex items-center gap-3">
							<CheckIcon /> <span>Personal ATC $100</span>
						</div>
						<div className="flex items-center gap-3">
							<CheckIcon /> <span>Community ATC</span>
						</div>
						<div className="flex items-center gap-3">
							<CheckIcon /> <span>Community size 20+</span>
						</div>
					</div>
				</div>
			</section>

			<section className="mt-5">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Referral Link</h3>
				<p className="text-[#414141] font-light">
					Send your referral link to your friends.
				</p>

				<div className="rounded-md border border-[#DEE3F6] bg-white text-[#3E57BF] px-3 py-4 mt-3">
					https://dashbord.traderapp.finance/auth/signup?ref=GOODY
				</div>
			</section>

			<section className="mt-5">
				<h3 className="font-bold text-lg mb-1 text-[#102477]">Invite Your friends </h3>
				<p className="text-[#414141] font-light">
					Insert your friends email addresses and send them an invitation to join
					TraderApp
				</p>

				<div className="rounded-md border border-[#DEE3F6] bg-white text-[#3E57BF] px-3 py-4 mt-3">
					<input
						type="text"
						name="email"
						id="email"
						placeholder="Enter email addresses"
						className="bg-[#F9FAFF] rounded-md p-2"
					/>
				</div>
			</section>
		</div>
	);
};

ReferralsOverview.getLayout = (page: React.ReactElement) => (
	<NestedReferralsLayout>{page}</NestedReferralsLayout>
);
export default ReferralsOverview;
