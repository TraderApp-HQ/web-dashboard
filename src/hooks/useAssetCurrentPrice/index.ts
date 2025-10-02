import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";

interface IAssetPrice {
	asset: string;
	quote: string;
	fetch: boolean;
}

// Custom hook to fetch assets current price
const useGetAssetCurrentPrice = ({ asset, quote, fetch }: IAssetPrice) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch asset price
	const fetchAssetCurrentPrice = useCallback(() => {
		return assetsService.getAssetCurrentPrice({ asset, quote });
	}, [asset, quote]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [`${asset}/${quote}`],
		queryFn: fetchAssetCurrentPrice,
		enabled: fetch, // Ensures query only runs when fetch is true
	});
};

export default useGetAssetCurrentPrice;
