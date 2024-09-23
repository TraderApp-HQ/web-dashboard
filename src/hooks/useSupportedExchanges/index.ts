import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";

interface IUseExchanges {
	coinId: number;
	currencyId: number;
}

// Custom hook to fetch Supported Exchanges data based on coinId and currencyId
const useSupportedExchanges = ({ coinId, currencyId }: IUseExchanges) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch Supported Exchanges
	const fetchSupportedExchanges = useCallback(() => {
		return assetsService.getSupportedExchanges({ coinId, currencyId });
	}, [coinId, currencyId]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [coinId, currencyId],
		queryFn: fetchSupportedExchanges,
	});
};

export default useSupportedExchanges;
