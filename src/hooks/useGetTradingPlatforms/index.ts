import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";
import { TradeStatus } from "~/apis/handlers/assets/enums";

interface IUseGetTradingPlatformsInput {
	page?: number;
	rowsPerPage?: number;
	orderBy?: "asc" | "desc";
	status?: TradeStatus;
	enabled?: boolean;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useGetTradingPlatforms = ({
	page,
	rowsPerPage,
	orderBy,
	status,
	enabled,
}: IUseGetTradingPlatformsInput) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch users
	const fetchExchanges = useCallback(() => {
		return assetsService.getAllTradingPlatforms({ page, rowsPerPage, orderBy, status });
	}, [page, rowsPerPage, orderBy, status]);

	// Using custom useFetch hook to fetch data
	const {
		data: tradingPlatforms,
		isSuccess: isTradingPlatformsSuccess,
		isError: isTradingPlatformsError,
		error: tradingPlatformsError,
		isLoading: isTradingPlatformsLoading,
	} = useFetch({
		queryKey: [rowsPerPage, orderBy, status],
		queryFn: fetchExchanges,
		enabled,
	});

	return {
		tradingPlatforms,
		isTradingPlatformsSuccess,
		isTradingPlatformsError,
		isTradingPlatformsLoading,
		tradingPlatformsError,
	};
};

export default useGetTradingPlatforms;
