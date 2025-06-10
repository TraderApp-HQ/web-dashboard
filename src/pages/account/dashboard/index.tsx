import Link from "next/link";
import { useState } from "react";
import { WalletType } from "~/apis/handlers/wallets/enum";
import Button from "~/components/AccountLayout/Button";
import Card from "~/components/AccountLayout/Card";
import IconButton from "~/components/AccountLayout/IconButton";
import AccountLayout from "~/components/AccountLayout/Layout";
import TaskCard from "~/components/AccountLayout/task-center/TaskCard";
import ComponentError from "~/components/Error/ComponentError";
import { Line } from "~/components/Loaders";
import DashboardCardLoader from "~/components/Loaders/DashboardCardLoader";
import PortfolioSummary from "~/components/Portfolio/PorfolioSummary";
import HidenBalance from "~/components/Wallet/HidenBalance";
import EyesIcon from "~/components/icons/EyesIcon";
import NoTransactionIcon from "~/components/icons/NoTransactionIcon";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import TaskIcon from "~/components/icons/TaskIcon";
import { TaskIconLarge } from "~/components/icons/TaskIconLarge";
import TiltedCircledDownRightArrowIcon from "~/components/icons/TiltedCircledDownRightArrowIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { useGetAllPendingTasks } from "~/hooks/useTask";
import useUserProfileData from "~/hooks/useUserProfileData";
import { useGetUserWalletsBalance } from "~/hooks/useWallets";
import { formatCurrency } from "~/lib/utils";
import { redirectTo } from "~/utils/RedirectTo";

const Dashbaord = () => {
	const [showBalance, handleShowBalance] = useState(true);

	const chartData = [
		{ name: "Group A", value: 400 },
		{ name: "Group B", value: 100 },
	];

	const COLORS = ["#414141", "#DA7B07"];

	const { userProfile, isUserProfileLoading, userProfileError } = useUserProfileData();
	const {
		isLoading: pendingTasksLoading,
		isSuccess: pendingTasksSuccess,
		error: pendingTasksError,
		isError: isPendingTasksError,
		pendingTasks,
	} = useGetAllPendingTasks();
	const {
		data: walletData,
		isLoading: isWalletLoading,
		isSuccess: isWalletSuccess,
	} = useGetUserWalletsBalance(WalletType.MAIN);

	return (
		<div className="space-y-12">
			<section className="space-y-12">
				<section>
					{isUserProfileLoading ? (
						<div className="space-y-1">
							<Line width="sm" height="lg" />
							<Line width="md" height="sm" />
						</div>
					) : !isUserProfileLoading && userProfileError ? (
						<ComponentError errorMessage={userProfileError.message} />
					) : (
						!isUserProfileLoading &&
						userProfile && (
							<div className="space-y-4">
								<h1 className="text-[#000000] font-bold text-[32px] capitalize">
									👋 Hey {userProfile.firstName}!
								</h1>
								<p className="text-base text-[#545050]">
									Let's catch you up — here's what's been happening on your
									TraderApp dashboard!
								</p>
							</div>
						)
					)}
				</section>

				{/* <Card className="py-5 px-3 md:p-5 flex flex-col md:flex-row justify-between items-start gap-5 !rounded-2xl bg-[url(/images/card-bg.png)] bg-cover bg-no-repeat bg-center !h-[220px] md:!h-[180px]"> */}
				<Card className="py-5 px-3 md:p-5 flex flex-col md:flex-row justify-between items-start gap-5 !rounded-2xl bg-[url(/images/dashboard-banner.png)] bg-cover bg-no-repeat bg-center !h-[220px] md:!h-[180px]">
					<div className="flex flex-col justify-center w-full space-y-5 text-white">
						<div className="flex items-center space-x-2">
							<h4 className="text-base font-medium">Wallet Overview</h4>

							<span
								onClick={() => handleShowBalance(!showBalance)}
								className="cursor-pointer"
							>
								{showBalance ? (
									<EyesIcon color="#FFFFFF" />
								) : (
									<OpenEyesIcon color="#FFFFFF" />
								)}
							</span>
						</div>
						<h3 className="text-4xl font-bold">
							{isWalletLoading ? (
								<Line width="md" height="lg" />
							) : showBalance && isWalletSuccess && walletData ? (
								<>
									<small className="text-2xl">
										{
											walletData.exchangeRateTotalBalances.find(
												(bal) => bal.currency === "USD",
											)?.currency
										}
									</small>{" "}
									{formatCurrency(
										walletData.exchangeRateTotalBalances.find(
											(bal) => bal.currency === "USD",
										)?.balance || 0,
									)}
								</>
							) : (
								<HidenBalance className="mt-4 mb-2" iconBgColor="#FFFFFF" />
							)}
						</h3>
					</div>
					<IconButton
						Icon={TiltedCircledDownRightArrowIcon}
						btnClass="w-48 h-12 bg-buttonColor text-zinc-50 font-semibold text-base text-nowrap px-4 py-2 gap-2 rounded-lg"
						aria-label="Make a Deposit"
						onClick={() => redirectTo(ROUTES.wallet.deposit)}
					>
						Make a Deposit
					</IconButton>
				</Card>
			</section>

			<section className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-start justify-between w-full lg:h-[500px] 2xl:h-[400px]">
				<section className="space-y-4 w-full lg:w-[49%] h-full">
					<section className="flex items-center gap-3 h-[10%]">
						<h2 className="text-[#08123B] font-bold text-xl">My Tasks</h2>
						<div className="flex items-center justify-center size-12 rounded-full bg-[#EEEEEE] border-[5px] border-white relative">
							<TaskIcon />

							{pendingTasksSuccess && pendingTasks!.pendingTasks.length > 0 && (
								<div
									className={`absolute -top-2 -right-2 size-5 rounded-full bg-[#FF0808] font-semibold text-white text-[11px] flex justify-center items-center`}
								>
									{pendingTasks!.pendingTasks.length}
								</div>
							)}
						</div>
					</section>

					{pendingTasksLoading ? (
						<DashboardCardLoader />
					) : pendingTasksSuccess && pendingTasks ? (
						pendingTasks.pendingTasks.length > 0 ? (
							<Card className="p-5 border-2 border-[#D1D7F0] flex flex-col items-center gap-4 h-[85%]">
								{pendingTasks.pendingTasks.slice(0, 2).map((task) => (
									<TaskCard
										key={`${task.id}-${task.title}`}
										title={`${task.title}`}
										link={`${LAYOUT_ROUTES.account}${ROUTES.rewardHub}${ROUTES.taskcenter.home}/${task.id}`}
									/>
								))}

								<Link
									href={`${LAYOUT_ROUTES.account}${ROUTES.rewardHub}${ROUTES.taskcenter.home}?task=all`}
									className="text-[#102477] font-bold text-base underline underline-offset-2 cursor-pointer mt-10"
								>
									Visit Task Center
								</Link>
							</Card>
						) : (
							<Card className="p-5 border-2 border-[#D1D7F0] flex flex-col items-center justify-center gap-6 h-[85%]">
								{/* <div className="border"> */}
								<TaskIconLarge />
								{/* </div> */}
								<p className="text-[#414141] font-medium">
									No pending tasks available
								</p>
								<Button
									onClick={() =>
										redirectTo(
											`${LAYOUT_ROUTES.account}${ROUTES.rewardHub}${ROUTES.taskcenter.home}?task=all`,
										)
									}
									innerClassName="!px-12"
								>
									Visit Task Center
								</Button>
							</Card>
						)
					) : (
						!pendingTasksLoading &&
						isPendingTasksError && (
							<ComponentError errorMessage={pendingTasksError?.message} />
						)
					)}
				</section>

				<section className="space-y-4 w-full lg:w-[49%] h-full">
					<h2 className="text-[#08123B] font-bold text-xl h-[10%]">Portfolio Summary</h2>
					<div className="border-2 border-[#D1D7F0] rounded-lg h-[85%]">
						<PortfolioSummary chartData={chartData} colors={COLORS} />
					</div>
				</section>
			</section>

			<div className="py-6 space-y-6">
				<h2 className="text-textColor text-xl font-bold">Recent Activites</h2>
				<Card className="flex flex-col justify-center items-center h-[330px]">
					<NoTransactionIcon />
					<div className="text-textGray text-center mt-4">
						<h3 className="font-extrabold text-base">No transaction made yet</h3>
						<p className="font-normal text-sm ">
							All your transaction history will appear here
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

Dashbaord.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Dashbaord;
