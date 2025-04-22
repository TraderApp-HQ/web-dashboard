import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "~/components/AccountLayout/Button";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";
import TradingAccountCard from "~/components/AccountLayout/TradeCenter/TradingAccountCard";
import Toast from "~/components/common/Toast";
import ComponentError from "~/components/Error/ComponentError";
import TradeCenterLoader from "~/components/Loaders/TradeCenterLoader";
import { useUserTradingAccounts } from "~/contexts/UserTradingAccountsContext";
import { useGetUserTradingAccounts } from "~/hooks/useGetUserTradingAccounts";
import useUserProfileData from "~/hooks/useUserProfileData";
import { NestedTradeCenterLayout } from "..";

const TradeCenterExchanges = () => {
	const router = useRouter();
	const { userProfile } = useUserProfileData();
	const userId = userProfile?.id;
	const { success, update, platform_error } = router.query;
	const [isConnectionSuccess, setIsConnectionSuccess] = useState(false);
	const [isUpdateMode, setIsUpdateMode] = useState(false);
	const [isPlatformValid, setIsPlatformValid] = useState(true);
	const { setUserTradingAccounts } = useUserTradingAccounts();

	// get query params
	useEffect(() => {
		if (success === "true") setIsConnectionSuccess(true);
		if (update === "true") setIsUpdateMode(true);
		if (platform_error === "true") setIsPlatformValid(false);

		if (success === "true" || update === "true" || platform_error === "true") {
			const url = window.location.pathname; // Retain the current path
			window.history.replaceState(null, "", url); // Clear the query params
		}
	}, [success, update, platform_error]);

	const {
		userTradingAccounts,
		isUserTradingAccountsLoading,
		isUserTradingAccountsError,
		isUserTradingAccountsSuccess,
		refetchUserTradingAccounts,
	} = useGetUserTradingAccounts({ userId: userId ?? "", enabled: !!userId });

	useEffect(() => {
		if (userTradingAccounts) {
			setUserTradingAccounts(userTradingAccounts);
		}
	}, [userTradingAccounts]);

	return (
		<div className="flex flex-col gap-y-8">
			{isUserTradingAccountsSuccess &&
			userTradingAccounts &&
			userTradingAccounts.length > 0 ? (
				<>
					<div className="flex justify-between flex-col md:flex-row">
						<h1 className="text-slate-900 text-2xl font-semibold mb-4 max-md:hidden">
							Trading Accounts
						</h1>
						<Button
							onClick={() => {
								router.push("trading-accounts/connect");
							}}
							fluid
							className="!block md:w-auto"
							innerClassName="px-4 md:px-4 text-xl md:text-sm"
						>
							Connect new Account
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-8">
						{userTradingAccounts.map((account) => (
							<TradingAccountCard
								key={account.accountId}
								tradingAccount={account}
								refetchTradingAccounts={refetchUserTradingAccounts}
							/>
						))}
					</div>
				</>
			) : isUserTradingAccountsSuccess &&
			  userTradingAccounts &&
			  userTradingAccounts.length === 0 ? (
				////////////////// - Empty State - ////////////////////////
				<EmptyExchange />
			) : !isUserTradingAccountsLoading && isUserTradingAccountsError ? (
				////////////////// - Error Component - ////////////////////////
				<ComponentError errorMessage="Failed to fetch trading accounts. Please try again later." />
			) : (
				////////////////// - Loader Component - ////////////////////////
				<TradeCenterLoader />
			)}

			{isConnectionSuccess && (
				<Toast
					type="success"
					variant="filled"
					title={isUpdateMode ? "Update Success" : "Connection Success"}
					message={
						isUpdateMode
							? "Your account connection has been updated."
							: "Your account is now linked."
					}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
			{!isPlatformValid && (
				<Toast
					type="error"
					variant="filled"
					title={"Invalid Platform"}
					message="The platform selected is invalid"
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</div>
	);
};

TradeCenterExchanges.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default TradeCenterExchanges;
