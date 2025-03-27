import type { IRecentTransactions } from "~/lib/types";
import type { ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { RecentTransactionsTableHeadItems } from "./constants";
import { renderDisplayItem, renderStatus, renderTransactionType } from "~/helpers";
import { ROUTES } from "~/config/constants";
import { formatCurrency, uniqueDateFormat } from "~/lib/utils";
import { TransactionType } from "~/config/enum";

export function recentTransactionsDataTableSelector(recentTransactions: IRecentTransactions[]) {
	const tableHead = [...RecentTransactionsTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: recentTransactions.map((item) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: item.curency, style: "text-base font-bold" },
						itemSubText: { text: item.shortName },
						itemImage: item.image,
						styles: "md:!justify-start",
					}),
				},
				{
					displayItem: renderTransactionType(item.transaction as TransactionType),
				},
				{
					displayItem: `${formatCurrency(+item.amount)} ${item.shortName}`,
					styles: "text-left",
				},
				{ displayItem: renderStatus(item.status, {}, false) },
				{ displayItem: uniqueDateFormat(item.date), styles: "text-left" },
			],
			actions: [
				{
					label: "View",
					url: `${ROUTES.wallet.homepage.slice(1)}/${item.id}/${ROUTES.wallet.transactionDetails}`,
				},
			],
		})),
	};

	return { tableHead, tableBody };
}

export function recentTransactionsDataTableMobileSelector(
	recentTransactions: IRecentTransactions[],
) {
	const dataMobile: ITableMobile[] = recentTransactions.map((item) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: item.curency, style: "text-base font-normal" },
				itemSubText: { text: item.shortName },
				itemImage: item.image,
			}),
			displayItemValue: "",
		},
		actions: [
			{
				label: "View",
				url: `${ROUTES.wallet.homepage.slice(1)}/${item.id}/${ROUTES.wallet.transactionDetails}`,
			},
		],
		tBody: [
			{
				displayItemTitle: "Transaction Type",
				displayItemValue: renderTransactionType(item.transaction as TransactionType),
			},
			{
				displayItemTitle: "Amount",
				displayItemValue: `${formatCurrency(+item.amount)} ${item.shortName}`,
			},
			{
				displayItemTitle: "Date",
				displayItemValue: uniqueDateFormat(item.date),
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(item.status, { justify: "justify-end" }, false),
			},
		],
	}));

	return dataMobile;
}
