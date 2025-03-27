import data from "~/data/wallet/data.json";
import EmptyTransaction from "../EmptyTransaction";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import {
	recentTransactionsDataTableSelector,
	recentTransactionsDataTableMobileSelector,
} from "~/selectors/wallets";
import { useEffect, useState } from "react";
import { IRecentTransactions } from "~/lib/types";

export default function RecentTransactions() {
	// Pagination
	const transactionsResult = data;
	const totalDocs = transactionsResult?.transactions.length;

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = useState<number>(totalDocs > 10 ? 10 : totalDocs);
	const [tableData, setTableData] = useState<IRecentTransactions[]>([]);
	const paginationData = {
		currentPage: currentPage,
		totalPages: Math.round(totalDocs / rowsPerPage),
		totalRecord: totalDocs,
		rowsPerPage: rowsPerPage,
		setRowsPerPage: (rows: number) => {
			setRowsPerPage(rows);
			setCurrentPage(1);
		},
		onNext: (page: number) => setCurrentPage(page),
		onPrev: (page: number) => setCurrentPage(page),
	};

	// Selectors
	const { tableHead, tableBody } = recentTransactionsDataTableSelector(tableData);
	const dataMobile = recentTransactionsDataTableMobileSelector(tableData);

	useEffect(() => {
		const start = rowsPerPage * (currentPage - 1);
		const end = start + (rowsPerPage - 1);
		setTableData(transactionsResult?.transactions.slice(start, end));
	}, [currentPage, rowsPerPage]);

	return (
		<section className="space-y-5">
			<h4 className="text-textColor text-base font-semibold leading-7">
				Recent Transactions
			</h4>
			{transactionsResult?.transactions.length === 0 ? (
				<EmptyTransaction />
			) : (
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
			)}
		</section>
	);
}
