import { useState } from "react";
import Card from "~/components/AccountLayout/Card";
import HidenBalance from "~/components/Wallet/HidenBalance";
import EyesIcon from "~/components/icons/EyesIcon";
import data from "~/data/wallet/data.json";
import IconButton from "~/components/AccountLayout/IconButton";
import DepositIcon from "~/components/icons/DepositIcon";
import { useRouter } from "next/router";
import WithdrawIcon from "~/components/icons/WithdrawIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { Line } from "~/components/Loaders";
import Link from "next/link";
import AccountLayout from "~/components/AccountLayout/Layout";
import Image from "next/image";
import MessageIcon from "~/components/icons/messageIcon";
import PortfolioSummary from "~/components/Portfolio/PorfolioSummary";
import NoTransactionIcon from "~/components/icons/NoTransactionIcon";
import { useGetAllPendingTasksCount } from "~/hooks/useTask";
import useUserProfileData from "~/hooks/useUserProfileData";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import { formatCurrency } from "~/lib/utils";

const Dashbaord = () => {
	const router = useRouter();
	const [showBalance, handleShowBalance] = useState(true);

	const chartData = [
		{ name: "Group A", value: 400 },
		{ name: "Group B", value: 300 },
		{ name: "Group C", value: 300 },
		{ name: "Group D", value: 200 },
	];

	const COLORS = ["#808080", "#808080", "#808080", "#808080"];

	const supportedOperations = [
		{
			label: "Deposit",
			url: ROUTES.wallet.deposit,
			icon: DepositIcon,
		},
		{
			label: "Withdraw",
			url: ROUTES.wallet.withdraw,
			icon: WithdrawIcon,
		},
	];

	const { userProfile, isUserProfileLoading, userProfileError } = useUserProfileData();
	const {
		isLoading: pendingCountLoading,
		isSuccess,
		pendingTasksCount,
	} = useGetAllPendingTasksCount();

	return (
		<div>
			<Card className="flex p-5 justify-between mb-5 items-center">
				<div className="flex-col justify-center w-full">
					{isUserProfileLoading && (
						<div className="space-y-1 mb-2">
							<Line width="md" height="lg" />
							<Line width="lg" height="sm" />
						</div>
					)}
					{userProfileError && (
						<div className="text-danger">{userProfileError.message}</div>
					)}
					{userProfile && (
						<div className="pb-5">
							<h3 className="text-[#102477] font-bold text-[32px]">
								Hello {userProfile.firstName} !
							</h3>
						</div>
					)}
					<div className="flex items-center space-x-2">
						<h4 className="text-sm text-[#08123B] font-medium">Wallet Overview</h4>

						<span
							onClick={() => handleShowBalance(!showBalance)}
							className="cursor-pointer"
						>
							{showBalance ? <EyesIcon /> : <OpenEyesIcon />}
						</span>
					</div>
					<h3 className="mt-1 text-xl font-bold">
						{isUserProfileLoading ? (
							<Line width="md" height="lg" />
						) : showBalance ? (
							`${formatCurrency(data?.wallet?.totalBalance)} USD`
						) : (
							<HidenBalance className="mt-6 mb-2" />
						)}
					</h3>
					<div className="flex flex-col md:flex-row flex-wrap max-sm:gap-4 md:flex-nowrap md:space-x-2 py-4 text-xs">
						{supportedOperations.map((item, index) => (
							<IconButton
								key={index}
								Icon={item.icon}
								btnClass="bg-stone-50 px-4 text-zinc-500 gap-2 flex justify-center"
								onClick={() => router.push(item.url)}
								disabled={false}
							>
								{item.label}
							</IconButton>
						))}
					</div>
				</div>
				<div className="md:block hidden">
					<Image src="/images/dashboard-image.png" alt="" width={350} height={197.56} />
				</div>
			</Card>

			<Card className="p-5">
				<h3 className="font-semibold text-xl">For you Today </h3>
				<div className="mt-8 flex justify-between">
					<div className="flex gap-6">
						<div className="flex gap-0.5">
							<MessageIcon />

							{isSuccess && pendingTasksCount!.pendingTasksCount > 0 && (
								<div
									className={`-mt-2.5 w-[19px] h-[19px] bg-[#FF0808] rounded-full flex justify-center items-center font-semibold text-white text-[10px] ${pendingCountLoading ? "animate-pulse" : ""}`}
								>
									{pendingTasksCount?.pendingTasksCount}
								</div>
							)}
						</div>
						<p className="text-base font-normal -mt-1">Tasks</p>
					</div>
					<div
						onClick={() =>
							router.push({
								pathname: `${LAYOUT_ROUTES.account}${ROUTES.rewardHub}${ROUTES.taskcenter.home}`,
								query: { task: "all" },
							})
						}
						className="-mt-4 bg-[#F3F5F6] w-[40%] md:w-[20%] h-[49px] flex justify-center items-center rounded cursor-pointer"
					>
						View Tasks
					</div>
				</div>
			</Card>
			<div className="my-6">
				<h2 className="text-[#08123B] font-bold py-3">Portfolio Summary</h2>
				<PortfolioSummary chartData={chartData} colors={COLORS} />
			</div>

			<div className="flex justify-between py-6 font-bold">
				<h4 className="text-[#08123B] text-base">Recent Activites</h4>
				<span className="text-[#1836B2] text-xs">
					<Link href="./transactions">see more</Link>
				</span>
			</div>
			<Card className="flex flex-col justify-center items-center h-[330px]">
				<NoTransactionIcon />
				<div className="text-[#414141] text-center mt-4">
					<h3 className="font-extrabold text-base">No transaction made yet</h3>
					<p className="font-normal text-sm ">
						All your transaction history will appear here
					</p>
				</div>
			</Card>
		</div>
	);
};

Dashbaord.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Dashbaord;
