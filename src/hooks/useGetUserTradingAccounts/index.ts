import { useCallback } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";
import { useFetch } from "~/hooks/useFetch";

export const useGetUserTradingAccounts = ({
	userId,
	enabled,
}: {
	userId: string;
	enabled?: boolean;
}) => {
	const tradingEngineService = new TradingEngineService();

	const fetchTradingAccounts = useCallback(() => {
		return tradingEngineService.getUserTradingAccounts(userId);
	}, [userId]);

	const {
		data: userTradingAccounts,
		isError: isUserTradingAccountsError,
		refetch: refetchUserTradingAccounts,
		isLoading: isUserTradingAccountsLoading,
		isSuccess: isUserTradingAccountsSuccess,
	} = useFetch({
		queryKey: [TradingEngineQueryId.tradingAccounts],
		queryFn: fetchTradingAccounts,
		enabled,
	});

	return {
		userTradingAccounts,
		refetchUserTradingAccounts,
		isUserTradingAccountsError,
		isUserTradingAccountsLoading,
		isUserTradingAccountsSuccess,
	};
};
