import type { IRecentTransactions } from "~/lib/types";
import type { ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { RecentTransactionsTableHeadItems } from "./constants";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { ROUTES } from "~/config/constants";

export function recentTransactionsDataTableSelector(recentTransactions: IRecentTransactions[]) {
	const tableHead = [...RecentTransactionsTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: recentTransactions.map((item) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: item.curency, style: "text-base font-normal" },
						itemSubText: { text: item.shortName },
						itemImage: item.image,
					}),
				},
				{ displayItem: item.transaction },
				{ displayItem: item.wallet },
				{ displayItem: item.amount },
				{ displayItem: renderStatus(item.status) },
				{ displayItem: item.date },
			],
			actions: [
				{
					label: "View",
					url: `${item.id}/${ROUTES.wallet.transactionDetails}`,
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
				url: `${item.id}/${ROUTES.wallet.transactionDetails}`,
			},
		],
		tBody: [
			{
				displayItemTitle: "Transaction",
				displayItemValue: item.transaction,
			},
			{
				displayItemTitle: "Wallet",
				displayItemValue: item.wallet,
			},
			{
				displayItemTitle: "Date / Time",
				displayItemValue: item.date,
			},
			{
				displayItemTitle: "Amount",
				displayItemValue: item.amount,
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(item.status),
			},
		],
	}));

	return dataMobile;
}
