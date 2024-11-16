import AccountConnection from "~/components/AccountLayout/TradeCenter/AccountConnection";
import { NestedTradeCenterLayout } from "../../..";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { useFetch } from "~/hooks/useFetch";

const UpdateTradingAccount = () => {
	const router = useRouter();
	const { id } = router.query;
	const tradingEngineService = new TradingEngineService();

	const fetchUser = useCallback(
		() => tradingEngineService.getUserTradingAccountsById(id as string),
		[id, tradingEngineService],
	);
	const { data: fetchAccount, isSuccess: fetchSuccess } = useFetch({
		queryKey: [id],
		queryFn: fetchUser,
		enabled: id !== undefined,
	});

	return (
		<AccountConnection
			categoryName={fetchAccount?.category ?? ""}
			platformName={fetchAccount?.platformName ?? ""}
			platformId={`${fetchAccount?.platformId}`}
			imgUrl={fetchAccount?.platformLogo ?? ""}
			id={id as string}
			fetchAccount={fetchAccount}
			fetchSuccess={fetchSuccess}
		/>
	);
};

UpdateTradingAccount.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default UpdateTradingAccount;
