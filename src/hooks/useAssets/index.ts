import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";

interface IUseAssets {
	page: number;
	rowsPerPage: number;
	orderBy: "asc" | "desc";
	sortBy: string;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useAssets = ({ page, rowsPerPage, orderBy, sortBy }: IUseAssets) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch users
	const fetchAssets = useCallback(() => {
		return assetsService.getAllAssets({ page, rowsPerPage, orderBy, sortBy });
	}, [page, rowsPerPage, orderBy, sortBy]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, orderBy, sortBy],
		queryFn: fetchAssets,
	});
};

export default useAssets;
