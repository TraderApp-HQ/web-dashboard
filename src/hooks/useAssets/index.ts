import { useCallback } from "react";
import { useFetch } from "../useFetch";
import { AssetsService } from "~/apis/handlers/assets";
import { Category } from "~/config/enum";

interface IUseAssets {
	page: number;
	rowsPerPage: number;
	orderBy: "asc" | "desc";
	sortBy: string;
	category: Category;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useGetAssets = ({ page, rowsPerPage, orderBy, sortBy, category }: IUseAssets) => {
	const assetsService = new AssetsService();

	// Memoized function to fetch users
	const fetchAssets = useCallback(() => {
		return assetsService.getAllAssets({ page, rowsPerPage, orderBy, sortBy, category });
	}, [page, rowsPerPage, orderBy, sortBy, category]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, orderBy, sortBy, category],
		queryFn: fetchAssets,
		enabled: !!category, // Ensures query only runs when category is defined
	});
};

export default useGetAssets;
