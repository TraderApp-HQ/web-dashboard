import data from "~/data/wallet/data.json";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import {
	currenciesDataTableMobileSelector,
	currenciesDataTableSelector,
} from "~/selectors/wallets/currencies";

export default function Currencies() {
	const transactionsResult = data;

	const { tableHead, tableBody } = currenciesDataTableSelector(transactionsResult?.currencies);
	const dataMobile = currenciesDataTableMobileSelector(transactionsResult?.currencies);

	return (
		<>
			<div className="flex justify-between mt-12 font-bold">
				<h4 className="text-slate-900 text-base font-bold leading-7">Funding</h4>
			</div>
			<div className="bg-white rounded-2xl">
				<div className="mt-2 px-4 pt-4">
					<div className="hidden md:block md:overflow-hidden overflow-x-auto p-2 bg-white rounded-2xl relative">
						<DataTable hasMenueItems tHead={tableHead} tBody={tableBody} />
					</div>
					<div className="md:hidden relative">
						<DataTableMobile data={dataMobile} />
					</div>
				</div>
			</div>
		</>
	);
}
