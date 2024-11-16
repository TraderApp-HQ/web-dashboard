import { NestedTradeCenterLayout } from "..";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";
import Button from "~/components/AccountLayout/Button";
import MyExchangeCard from "~/components/AccountLayout/TradeCenter/MyExchangeCard";
import { useRouter } from "next/router";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { useFetch } from "~/hooks/useFetch";
import { useCallback, useEffect, useState } from "react";
import useUserProfileData from "~/hooks/useUserProfileData";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";
import { IUserAccountWithBalance } from "~/apis/handlers/trading-engine/interfaces";

const TradeCenterExchanges = () => {
	const [tradingAccounts, setTradingAccounts] = useState<IUserAccountWithBalance[] | undefined>();
	const [loading, setLoading] = useState<boolean>(true);
	const tradingEngineService = new TradingEngineService();
	const router = useRouter();

	const { userProfile } = useUserProfileData();
	const userId = userProfile?.id;

	const fetchTradingAccounts = useCallback(() => {
		return tradingEngineService.getUserTradingAccounts(userId as string);
	}, [userId]);

	const {
		data: accounts,
		isError,
		refetch,
	} = useFetch({
		queryKey: [TradingEngineQueryId.accounts],
		queryFn: fetchTradingAccounts,
		enabled: !!userId,
	});

	useEffect(() => {
		if (userId && accounts) {
			setTradingAccounts(accounts);
			setLoading(false);
		}
	}, [userId, accounts]);

	if (isError) {
		return <div>Failed to load trading accounts. Please try again later.</div>;
	}

	if (loading) {
		return <div>loading ....</div>;
	}

	return (
		<div className="flex flex-col gap-y-8">
			{tradingAccounts && tradingAccounts.length > 0 ? (
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
						{tradingAccounts.map((account) => (
							<MyExchangeCard
								key={account.id}
								{...account}
								refetchAccounts={refetch}
							/>
						))}
					</div>
				</>
			) : (
				!loading && <EmptyExchange />
			)}
		</div>
	);
};

TradeCenterExchanges.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default TradeCenterExchanges;
