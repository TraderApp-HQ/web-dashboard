import { useCallback } from "react";
import { IPaginationQuery } from "~/apis/handlers/interfaces";
import { InvoicesService } from "~/apis/handlers/invoices";
import { useFetch } from "../useFetch";

export const useGetOutstandingUserInvoices = ({ currentPage, rowsPerPage }: IPaginationQuery) => {
	const invoicesService = new InvoicesService();
	const fetchOutstandingInvoices = useCallback(
		() => invoicesService.getOutstandingUserInvoices({ currentPage, rowsPerPage }),
		[currentPage, rowsPerPage],
	);

	const { data, error, isLoading, isSuccess, isError, refetch } = useFetch({
		queryKey: ["outstanding-user-invoices", currentPage, rowsPerPage],
		queryFn: fetchOutstandingInvoices,
	});

	return { data, error, isLoading, isSuccess, isError, refetch };
};
