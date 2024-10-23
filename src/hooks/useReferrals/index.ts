import { useCallback } from "react";
import { UsersService } from "~/apis/handlers/users";
import { useFetch } from "../useFetch";

interface IUseUsers {
	searchKeyword?: string;
	currentPage?: number;
	rowsPerPage?: number;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useReferrals = ({ searchKeyword, currentPage, rowsPerPage }: IUseUsers) => {
	const usersService = new UsersService();

	// Memoized function to fetch users
	const fetchReferrals = useCallback(() => {
		// return usersService.getReferrals({ size: rowsPerPage, page: currentPage, searchKeyword });
		return usersService.getReferrals();
	}, [currentPage, rowsPerPage, searchKeyword, usersService]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, currentPage],
		queryFn: fetchReferrals,
	});
};

export default useReferrals;
