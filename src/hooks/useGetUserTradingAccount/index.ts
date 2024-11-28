import { useCallback } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";
import { TradingPlatform } from "~/apis/handlers/trading-engine/enums";
import { useFetch } from "~/hooks/useFetch";

interface IUseGetUserTradingAccountInput {
	userId: string;
	platformName: TradingPlatform;
	enabled?: boolean;
}

export const useGetUserTradingAccount = ({
	userId,
	platformName,
	enabled,
}: IUseGetUserTradingAccountInput) => {
	const tradingEngineService = new TradingEngineService();
	const fetchTradingAccount = useCallback(() => {
		if (platformName) {
			return tradingEngineService.getUserTradingAccount({ userId, platformName });
		}
	}, [userId, platformName]);

	const {
		data: userTradingAccount,
		isError: isUserTradingAccountError,
		refetch: refetchUserTradingAccount,
		isLoading: isUserTradingAccountLoading,
		isSuccess: isUserTradingAccountSuccess,
	} = useFetch({
		queryKey: [TradingEngineQueryId.tradingAccount],
		queryFn: fetchTradingAccount,
		enabled,
	});

	return {
		userTradingAccount,
		refetchUserTradingAccount,
		isUserTradingAccountError,
		isUserTradingAccountLoading,
		isUserTradingAccountSuccess,
	};
};
