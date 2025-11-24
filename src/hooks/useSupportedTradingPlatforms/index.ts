import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";

interface IUseTradingPlatform {
	baseAssetId: number;
	quoteCurrencyId: number;
}

// Custom hook to fetch Supported Trading Platforms data based on baseAssetId and quoteCurrencyId
const useSupportedTradingPlatforms = ({ baseAssetId, quoteCurrencyId }: IUseTradingPlatform) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch Supported Trading Platforms
	const fetchSupportedTradingPlatforms = useCallback(() => {
		return assetsService.getSupportedTradingPlatforms({ baseAssetId, quoteCurrencyId });
	}, [baseAssetId, quoteCurrencyId]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [baseAssetId, quoteCurrencyId],
		queryFn: fetchSupportedTradingPlatforms,
		enabled: !!(baseAssetId && quoteCurrencyId),
	});
};

export default useSupportedTradingPlatforms;
