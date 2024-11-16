import { NestedTradeCenterLayout } from "..";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";
import Button from "~/components/AccountLayout/Button";
import MyExchangeCard from "~/components/AccountLayout/TradeCenter/MyExchangeCard";
import { useRouter } from "next/router";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { useFetch } from "~/hooks/useFetch";
import { useCallback } from "react";
import useUserProfileData from "~/hooks/useUserProfileData";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";

const TradeCenterExchanges = () => {
	const tradingEngineService = new TradingEngineService();
	const router = useRouter();

	const { userProfile } = useUserProfileData();
	const userId = userProfile?.id;

	const fetchTradingAccounts = useCallback(
		() => tradingEngineService.getUserTradingAccounts(`${userId}`),
		[userId, tradingEngineService],
	);

	const {
		data: accounts,
		isLoading,
		isSuccess,
		isError,
		refetch,
	} = useFetch({
		queryKey: [TradingEngineQueryId.accounts],
		queryFn: fetchTradingAccounts,
	});

	return (
		<div className="flex flex-col gap-y-8">
			{isLoading && <div>loading ....</div>}
			{isError && <div>Something went wrong, please try again later!</div>}
			{isSuccess && accounts && accounts.length > 0 ? (
				<>
					<div className="flex justify-between flex-col md:flex-row">
						<h1 className="text-slate-900 text-3xl font-semibold mb-4">
							Trading Accounts
						</h1>
						<Button
							onClick={() => {
								router.push("trading-accounts/connect");
							}}
							className="!block"
							innerClassName="px-4 md:px-4 text-xl md:text-sm"
						>
							Connect new Account
						</Button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
						{accounts.map((account) => (
							<MyExchangeCard
								key={account.id}
								{...account}
								refetchAccounts={refetch}
							/>
						))}
					</div>
				</>
			) : (
				<EmptyExchange />
			)}
		</div>
	);
};

TradeCenterExchanges.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default TradeCenterExchanges;
