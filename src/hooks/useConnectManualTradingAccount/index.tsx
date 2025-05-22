import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { useCreate } from "../useCreate";

export const useConnectManualTradingAccount = () => {
	const tradingEngineService = new TradingEngineService();
	const {
		mutate: connectManualTradingAccount,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: tradingEngineService.connectManualTradingAccount.bind(tradingEngineService),
	});

	return {
		connectManualTradingAccount,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	};
};
