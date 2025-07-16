import { useEffect, useState } from "react";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import {
	recentTransactionsDataTableMobileSelector,
	recentTransactionsDataTableSelector,
} from "~/selectors/wallets";
import EmptyTransaction from "../EmptyTransaction";
import { useGetUserWalletsRecentTransactions } from "~/hooks/useWallets";
import WalletTransactionsLoader from "~/components/Loaders/WalletTransactionsLoader";
import { useRouter } from "next/router";
import ComponentError from "~/components/Error/ComponentError";
import useUserProfileData from "~/hooks/useUserProfileData";

export default function RecentTransactions() {
	const { isAdmin } = useUserProfileData(); // Check if user is an admin

	const router = useRouter();
	const { page, limit } = router.query;

	const params = new URLSearchParams();

	// Pagination
	const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState<number>(Number(limit) || 10);

	const {
		data: transactionHistorydata,
		isError,
		isLoading,
		isSuccess,
		refetch,
	} = useGetUserWalletsRecentTransactions({ currentPage, rowsPerPage });

	// Selectors
	const { tableHead, tableBody } = recentTransactionsDataTableSelector({
		recentTransactions: transactionHistorydata?.docs ?? [],
		isAdmin,
	});
	const dataMobile = recentTransactionsDataTableMobileSelector({
		recentTransactions: transactionHistorydata?.docs ?? [],
		isAdmin,
	});

	useEffect(() => {
		if (currentPage) {
			params.set("page", currentPage.toString());
		}
		if (rowsPerPage) {
			params.set("limit", rowsPerPage.toString());
		}
	}, [currentPage, rowsPerPage]);

	const paginationData = {
		currentPage,
		totalPages: transactionHistorydata?.totalPages ?? 0,
		rowsPerPage: transactionHistorydata?.limit ?? rowsPerPage,
		totalRecord: transactionHistorydata?.totalDocs ?? 0,
		hasNextPage: transactionHistorydata?.hasNextPage,
		hasPrevPage: transactionHistorydata?.hasPrevPage,
		setRowsPerPage: (rows: number) => {
			if (rows !== rowsPerPage) {
				setRowsPerPage(rows);
				setCurrentPage(1); // Resets current page back to 1 anytime rowsPerPage is changed
			}
		},
		onNext: () => setCurrentPage((prev) => prev + 1),
		onPrev: () => setCurrentPage((prev) => prev - 1),
	};

	// Refetch wallet balance every 2 minutes
	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 120000); // 2 minutes

		return () => clearInterval(interval);
	}, [refetch]);

	return (
		<section className="space-y-5">
			{isLoading ? (
				/////////////////// Loading State ///////////////
				<WalletTransactionsLoader />
			) : (
				<>
					<h4 className="text-textColor text-base font-semibold leading-7">
						Recent Transactions
					</h4>
					{isError ? (
						/////////////////// Error State ///////////////////
						<ComponentError />
					) : isSuccess &&
					  transactionHistorydata &&
					  transactionHistorydata.totalDocs > 0 ? (
						<section className="mt-2 mb-8">
							<section className="hidden md:block py-4 px-8 bg-white rounded-2xl relative overflow-x-auto">
								<DataTable
									tHead={tableHead}
									tBody={tableBody}
									tableHeadItemStyles="text-left"
									showPagination
									paginationProps={paginationData}
								/>
							</section>
							<section className="md:hidden relative">
								<DataTableMobile
									data={dataMobile}
									showPagination
									paginationProps={paginationData}
								/>
							</section>
						</section>
					) : (
						/////////////// Empty State /////////////////////
						<EmptyTransaction />
					)}
				</>
			)}
		</section>
	);
}
