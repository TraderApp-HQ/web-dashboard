import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";

interface IUseExchanges {
	page?: number;
	rowsPerPage?: number;
	orderBy?: "asc" | "desc";
	isTradingActive?: boolean;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useExchanges = ({ page, rowsPerPage, orderBy, isTradingActive }: IUseExchanges) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch users
	const fetchExchanges = useCallback(() => {
		return assetsService.getAllExchanges({ page, rowsPerPage, orderBy, isTradingActive });
	}, [page, rowsPerPage, orderBy, isTradingActive]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, orderBy, isTradingActive],
		queryFn: fetchExchanges,
	});
};

export default useExchanges;
