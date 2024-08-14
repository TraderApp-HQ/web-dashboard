import { useCallback } from "react";
import { UsersService } from "~/apis/handlers/users";
import { useFetch } from "../useFetch";

interface IUseUsers {
	searchKeyword?: string;
	currentPage?: number;
	rowsPerPage?: number;
}

// Custom hook to fetch users data based on search keyword, current page, and rows per page
const useUsers = ({ searchKeyword, currentPage, rowsPerPage }: IUseUsers) => {
	const usersService = new UsersService();

	// Memoized function to fetch users
	const fetchUsers = useCallback(() => {
		return usersService.getAllUsers({ size: rowsPerPage, page: currentPage, searchKeyword });
	}, [currentPage, rowsPerPage, searchKeyword, usersService]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, currentPage],
		queryFn: fetchUsers,
	});
};

export default useUsers;
