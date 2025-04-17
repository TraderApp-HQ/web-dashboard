import type { ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { RecentTransactionsTableHeadItems } from "./constants";
import { renderDisplayItem, renderStatus, renderTransactionType } from "~/helpers";
import { ROUTES } from "~/config/constants";
import { formatCurrency, uniqueDateFormat } from "~/lib/utils";
import { TransactionType } from "~/config/enum";
import { ITransactionsHistory } from "~/apis/handlers/wallets/interface";

export function recentTransactionsDataTableSelector(recentTransactions: ITransactionsHistory[]) {
	const tableHead = [...RecentTransactionsTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: recentTransactions.map((item) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: {
							text: item.assetLogo.name,
							style: "text-base font-bold",
						},
						itemSubText: { text: item.assetLogo.symbol },
						itemImage: item.assetLogo.logoUrl,
						styles: "md:!justify-start",
					}),
				},
				{
					displayItem: renderTransactionType(item.transactionType as TransactionType),
				},
				{
					displayItem: `${formatCurrency(+item.amount)} ${item.currency}`,
					styles: "text-left",
				},
				{ displayItem: renderStatus(item.status, {}, false) },
				{ displayItem: uniqueDateFormat(item.createdAt), styles: "text-left" },
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
	recentTransactions: ITransactionsHistory[],
) {
	const dataMobile: ITableMobile[] = recentTransactions.map((item) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: item.assetLogo.name, style: "text-base font-normal" },
				itemSubText: { text: item.assetLogo.symbol },
				itemImage: item.assetLogo.logoUrl,
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
				displayItemValue: renderTransactionType(item.transactionType as TransactionType),
			},
			{
				displayItemTitle: "Amount",
				displayItemValue: `${formatCurrency(+item.amount)} ${item.currency}`,
			},
			{
				displayItemTitle: "Date",
				displayItemValue: uniqueDateFormat(item.createdAt),
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(item.status, { justify: "justify-end" }, false),
			},
		],
	}));

	return dataMobile;
}
