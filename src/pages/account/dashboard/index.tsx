import Link from "next/link";
import { useState } from "react";
import { FaRegSquareCheck } from "react-icons/fa6";
import { NotificationChannel, VerificationType } from "~/apis/handlers/users/enums";
import { IFetchOnboardingTasks, IUserProfile } from "~/apis/handlers/users/interfaces";
import { WalletType } from "~/apis/handlers/wallets/enum";
import Button from "~/components/AccountLayout/Button";
import Card from "~/components/AccountLayout/Card";
import IconButton from "~/components/AccountLayout/IconButton";
import AccountLayout from "~/components/AccountLayout/Layout";
import TaskCard from "~/components/AccountLayout/task-center/TaskCard";
import VerificationModal from "~/components/AuthLayout/Modal/VerificationModal";
import ComponentError from "~/components/Error/ComponentError";
import { Line } from "~/components/Loaders";
import DashboardCardLoader from "~/components/Loaders/DashboardCardLoader";
import { ProgressTrackerLoader } from "~/components/Loaders/ReferralProgressLoader";
import WalletBalanceCardLoader from "~/components/Loaders/WalletBalanceCardLoader";
import Modal from "~/components/Modal";
import PortfolioSummary from "~/components/Portfolio/PorfolioSummary";
import HidenBalance from "~/components/Wallet/HidenBalance";
import InputField from "~/components/common/InputField";
import ProgressTracker from "~/components/common/ProgressTracker";
import Toast from "~/components/common/Toast";
import EyesIcon from "~/components/icons/EyesIcon";
import NoTransactionIcon from "~/components/icons/NoTransactionIcon";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import TaskIcon from "~/components/icons/TaskIcon";
import { TaskIconLarge } from "~/components/icons/TaskIconLarge";
import TiltedCircledDownRightArrowIcon from "~/components/icons/TiltedCircledDownRightArrowIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { useGetAllPendingTasks, useGetOnboardingTasks } from "~/hooks/useTask";
import { useGetUserOnboardingFlowData } from "~/hooks/useUserOnboardingTask";
import useUserProfileData from "~/hooks/useUserProfileData";
import { useGetUserWalletsBalance } from "~/hooks/useWallets";
import { formatCurrency } from "~/lib/utils";
import { redirectTo } from "~/utils/RedirectTo";
import CheckIcon from "~/components/icons/CheckIcon";
import CompleteIcon from "~/components/icons/CompleteIcon";

const Dashbaord = () => {
	const [showBalance, handleShowBalance] = useState(true);

	const chartData = [
		{ name: "Group A", value: 400 },
		{ name: "Group B", value: 100 },
	];

	const COLORS = ["#414141", "#DA7B07"];

	// Get user profile data
	const {
		userProfile,
		isUserProfileLoading,
		userProfileError,
		isUserProfileError,
		refetchUserProfile,
	} = useUserProfileData();
	// Get pending tasks
	const {
		isLoading: pendingTasksLoading,
		isSuccess: pendingTasksSuccess,
		error: pendingTasksError,
		isError: isPendingTasksError,
		pendingTasks,
	} = useGetAllPendingTasks();

	// Get wallet data
	const {
		data: walletData,
		isLoading: isWalletLoading,
		isSuccess: isWalletSuccess,
		isError: isWalletError,
	} = useGetUserWalletsBalance(WalletType.MAIN);

	// Get onboarding Tasks
	const { onboardingTasks, isLoading: isOnboardingTasksLoading } = useGetOnboardingTasks();

	// Get tailored onbording flow data
	const {
		showOnboardingStepsPanel,
		showDismissOnboardingPanelBtn,
		handleOnboardingPanelDisplay,
		tasks,
		optionalTasks,
		showFirstDepositModal,
		handleFirstDepositModalDisplay,
		showSocialAccountsModal,
		handleSocialAccountsModalDisplay,
		socialAccountsFormData,
		updateSocialAccountsFormData,
		handleSocialAccountsUpdate,
		isUpdatePending,
		showVerifyEmailOtpModal,
		handleEmailOtpModalDisplay,
		toastData,
	} = useGetUserOnboardingFlowData({
		userProfile: userProfile as IUserProfile,
		onboardingTasks: onboardingTasks as IFetchOnboardingTasks,
		refetchUserProfile,
	});

	return (
		<>
			<div className="space-y-12 overflow-x-hidden">
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

					{isWalletLoading ? (
						<WalletBalanceCardLoader />
					) : isWalletSuccess && walletData ? (
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
									{showBalance ? (
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
								btnClass="w-48 h-12 bg-zinc-50 text-buttonColor font-semibold text-base text-nowrap px-4 py-2 gap-2 rounded-lg"
								aria-label="Make a Deposit"
								onClick={() => redirectTo(ROUTES.wallet.deposit)}
							>
								Make a Deposit
							</IconButton>
						</Card>
					) : (
						!isWalletLoading &&
						isWalletError && (
							<ComponentError
								errorMessage={"Error fetching wallet balance. Please try again."}
							/>
						)
					)}
				</section>

				{/* Onboarding Section */}
				{userProfile && showOnboardingStepsPanel && (
					<ProgressTracker
						title="Finish setting up your account"
						body="Complete the following onboarding steps below to complete your account setup."
						tiers={tasks}
						hasOptionalTiers={true}
						optionalTiersTitle="Optional Task"
						optionalTiers={optionalTasks}
						isLoading={isUserProfileLoading || isOnboardingTasksLoading}
						loadingComponent={ProgressTrackerLoader}
						isError={isUserProfileError}
						errorComponent={({ error }) => (
							<ComponentError errorMessage={error?.message} />
						)}
						hasDismissBtn={showDismissOnboardingPanelBtn}
						dismissBtn={() => (
							<p
								className="text-[#102477] font-semibold text-base text-nowrap cursor-pointer"
								aria-label="Dismiss Button"
								onClick={handleOnboardingPanelDisplay}
							>
								Dismiss
							</p>
						)}
					/>
				)}

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
									<TaskIconLarge />
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
						<h2 className="text-[#08123B] font-bold text-xl h-[10%]">
							Portfolio Summary
						</h2>
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

			{/* Verify Email Modal */}
			<VerificationModal
				openModal={showVerifyEmailOtpModal}
				setOpenModal={handleEmailOtpModalDisplay}
				notificationChannel={NotificationChannel.EMAIL}
				verificationType={[VerificationType.UPDATE]}
				redirectTo={LAYOUT_ROUTES.account}
			/>

			{/* First Deposit Modal */}
			{showFirstDepositModal && (
				<Modal
					openModal={showFirstDepositModal}
					width="max-w-[349px] md:max-w-[636px]"
					onClose={handleFirstDepositModalDisplay}
					title="Payment Summary"
					headerDivider={true}
				>
					{
						<section className="mt-10 space-y-5">
							<section className="flex items-center justify-between gap-3">
								<h3 className="text-textBlack text-base font-semibold">
									Activation fee
								</h3>
								<p className="text-[#373F50] font-bold text-3xl line-through">
									$100.0
								</p>
							</section>
							<hr />
							<section className=" items-center justify-evenly gap-3 p-3  bg-[#f9fbff] rounded-md">
								<h3 className="text-textBlack p-1 text-sm font-medium">
									Promo code
								</h3>
								<div className="flex items-center gap-3">
									<button className=" p-2 text-sm border border-gray-300 rounded-lg">
										WELCOME90
									</button>
									<CheckIcon />
								</div>
							</section>
							<section className="flex items-center justify-evenly border-green-400 border gap-3 px-2 py-4 rounded-lg bg-green-50">
								<CompleteIcon />
								<p className=" text-[#08123B] text-base">
									A 90% discount has been auto applied to your activation fees.
								</p>
							</section>
							<section className="flex items-center justify-between gap-3">
								<h3 className="text-textBlack text-sm font-medium">Total</h3>
								<p className="text-[#373F50] font-bold text-3xl">$10.00</p>
							</section>
							<section className="space-y-3 pb-5">
								<h3 className="text-textBlack text-base font-bold">
									Payment Method
								</h3>
								<p className="text-[#344054] font-medium text-sm flex items-center gap-2">
									<FaRegSquareCheck size={20} color="#1836B2" />
									Crypto (On-Chain)
								</p>
							</section>
							<Button
								className="tracking-widest h-12"
								fluid={true}
								onClick={() => {
									redirectTo(`${ROUTES.wallet.deposit}?first_deposit=true`);
									handleFirstDepositModalDisplay();
								}}
							>
								Pay Now
							</Button>
						</section>
					}
				</Modal>
			)}

			{/* Social Accounts Modal */}
			{showSocialAccountsModal && (
				<Modal
					openModal={showSocialAccountsModal}
					width="max-w-[349px] md:max-w-[636px]"
					onClose={handleSocialAccountsModalDisplay}
					title="Add social media accounts"
					description="Enter any social media handle that you have"
				>
					<section className="mt-5 space-y-5 px-2">
						<InputField
							type="text"
							labelText="Facebook"
							placeholder="Enter facebook handle"
							className="no-spin-buttons"
							value={socialAccountsFormData.facebookUsername || ""}
							onChange={(value) =>
								updateSocialAccountsFormData("facebookUsername", value)
							}
						/>
						<InputField
							type="text"
							labelText="X (Twitter)"
							placeholder="Enter X handle"
							className="no-spin-buttons"
							value={socialAccountsFormData.twitterUsername || ""}
							onChange={(value) =>
								updateSocialAccountsFormData("twitterUsername", value)
							}
						/>
						<InputField
							type="text"
							labelText="Instagram"
							placeholder="Enter instagram handle"
							className="no-spin-buttons"
							value={socialAccountsFormData.instagramUsername || ""}
							onChange={(value) =>
								updateSocialAccountsFormData("instagramUsername", value)
							}
						/>
						<InputField
							type="text"
							labelText="Tiktok"
							placeholder="Enter tiktok handle"
							className="no-spin-buttons"
							value={socialAccountsFormData.tiktokUsername || ""}
							onChange={(value) =>
								updateSocialAccountsFormData("tiktokUsername", value)
							}
						/>

						<Button
							className="tracking-widest h-12"
							fluid={true}
							onClick={() => handleSocialAccountsUpdate()}
							disabled={
								(!socialAccountsFormData.facebookUsername &&
									!socialAccountsFormData.instagramUsername &&
									!socialAccountsFormData.tiktokUsername &&
									!socialAccountsFormData.twitterUsername) ||
								isUpdatePending
							}
							isLoading={isUpdatePending}
						>
							Submit
						</Button>
					</section>
				</Modal>
			)}

			{toastData.showToast && (
				<Toast
					type={toastData.type}
					variant="filled"
					title={toastData.title}
					message={toastData.message}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
};

Dashbaord.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Dashbaord;
