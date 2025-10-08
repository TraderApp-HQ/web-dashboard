import { useCallback } from "react";
import { IPaginationQuery } from "~/apis/handlers/interfaces";
import { WalletsService } from "~/apis/handlers/wallets";
import { useFetch } from "../useFetch";

export const useGetOutstandingUserInvoices = ({ currentPage, rowsPerPage }: IPaginationQuery) => {
	const walletsService = new WalletsService();
	const fetchOutstandingInvoices = useCallback(
		() => walletsService.getOutstandingUserInvoices({ currentPage, rowsPerPage }),
		[currentPage, rowsPerPage],
	);

	const { data, error, isLoading, isSuccess, isError, refetch } = useFetch({
		queryKey: ["outstanding-user-invoices", currentPage, rowsPerPage],
		queryFn: fetchOutstandingInvoices,
	});

	return { data, error, isLoading, isSuccess, isError, refetch };
};
