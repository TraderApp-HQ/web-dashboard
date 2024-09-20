import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";

// Custom hook to fetch currencies data
const useCurrencies = () => {
	const assetsService = new AssetsService();

	// Memoized function to fetch users
	const fetchCurrencies = useCallback(() => {
		return assetsService.getAllCurrencies();
	}, []);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [AssetsQueryId.currencies],
		queryFn: fetchCurrencies,
	});
};

export default useCurrencies;
