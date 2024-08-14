import data from "~/data/wallet/data.json";
import EmptyTransaction from "../EmptyTransaction";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import {
	recentTransactionsDataTableSelector,
	recentTransactionsDataTableMobileSelector,
} from "~/selectors/wallets";

export default function RecentTransactions() {
	const transactionsResult = data;

	const { tableHead, tableBody } = recentTransactionsDataTableSelector(
		transactionsResult?.transactions,
	);
	const dataMobile = recentTransactionsDataTableMobileSelector(transactionsResult?.transactions);

	return (
		<div>
			<div className="flex justify-between items-center mt-12 font-bold">
				<h4 className="text-slate-900 text-base font-bold leading-7">
					Recent Transactions
				</h4>
			</div>
			{transactionsResult?.transactions.length === 0 ? (
				<EmptyTransaction />
			) : (
				<div className="mt-2 mb-8">
					<div className="hidden md:block p-2 bg-white rounded-2xl relative overflow-x-auto">
						<DataTable tHead={tableHead} tBody={tableBody} />
					</div>
					<div className="md:hidden relative">
						<DataTableMobile data={dataMobile} />
					</div>
				</div>
			)}
		</div>
	);
}
