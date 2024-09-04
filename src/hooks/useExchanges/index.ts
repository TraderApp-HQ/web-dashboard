import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";
import { TradeStatus } from "~/apis/handlers/assets/enums";

interface IUseExchanges {
	page?: number;
	rowsPerPage?: number;
	orderBy?: "asc" | "desc";
	status?: TradeStatus;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useExchanges = ({ page, rowsPerPage, orderBy, status }: IUseExchanges) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch users
	const fetchExchanges = useCallback(() => {
		return assetsService.getAllExchanges({ page, rowsPerPage, orderBy, status });
	}, [page, rowsPerPage, orderBy, status]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, orderBy, status],
		queryFn: fetchExchanges,
	});
};

export default useExchanges;
