import type { OpenTrade, Orders, TradeHistoryData } from "~/lib/types";
import type { ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { OpenTradesTableHeadItems, TradeHistoryTableHeadItems } from "./constants";
import { renderDisplayItem } from "~/helpers";
import { ROUTES } from "~/config/constants";

export function openTradesDataTableSelector(openTrades: OpenTrade[]) {
	const tableHead = [...OpenTradesTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: openTrades.map((trades) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: {
							text: `${trades.asset.name} ${trades.pair}`,
							style: "text-base font-normal",
						},
						itemSubText: { text: trades.asset.shortName! },
						itemImage: trades.asset.image,
					}),
				},
				{ displayItem: `${trades.price} USDT` },
				{
					displayItem: renderDisplayItem({
						itemText: { text: `${trades.profitLoss!} ${trades.pair}` },
						itemSubText: {
							text: `${trades.percent}%`,
							style:
								parseFloat(trades.percent!) < 0
									? "text-rose-700"
									: "text-emerald-700",
						},
					}),
				},
				{
					displayItem: renderDisplayItem({
						itemText: { text: `${trades.holdings} ${trades.pair}` },
						itemSubText: { text: trades.holdingComp! },
					}),
				},
				{ displayItem: `$${trades.avgBuy}` },
				{ displayItem: trades.date },
			],
			actions: [
				{
					label: "View",
					url: `open-trades/${trades.id}`,
				},
				{
					label: "Manage Trade",
					url: `open-trades/${trades.id}/${ROUTES.tradeCenter.manageTrade}`,
				},
			],
		})),
	};

	return { tableHead, tableBody };
}

export function openTradesDataTableMobileSelector(openTrades: OpenTrade[]) {
	const dataMobile: ITableMobile[] = openTrades.map((trades) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: trades.asset.name, style: "text-base font-normal" },
				itemSubText: { text: trades.asset.shortName! },
				itemImage: trades.asset.image,
			}),
			displayItemValue: "",
		},
		actions: [
			{
				label: "View",
				url: `open-trades/${trades.id}`,
			},
			{
				label: "Manage Trade",
				url: `open-trades/${trades.id}/${ROUTES.tradeCenter.manageTrade}`,
			},
		],
		tBody: [
			{
				displayItemTitle: "Price",
				displayItemValue: `${trades.price} USDT`,
			},
			{
				displayItemTitle: "Profit/Loss",
				displayItemValue: renderDisplayItem({
					itemText: { text: `${trades.profitLoss!} ${trades.pair}` },
					itemSubText: {
						text: `${trades.percent}%`,
						style:
							parseFloat(trades.percent!) < 0 ? "text-rose-700" : "text-emerald-700",
					},
				}),
			},
			{
				displayItemTitle: "Holdings",
				displayItemValue: renderDisplayItem({
					itemText: { text: `${trades.holdings} ${trades.pair}` },
					itemSubText: { text: trades.holdingComp! },
				}),
			},
			{
				displayItemTitle: "Avg.buy price",
				displayItemValue: `$${trades.avgBuy}`,
			},
			{
				displayItemTitle: "End Date / Time",
				displayItemValue: trades.date,
			},
		],
	}));

	return dataMobile;
}

export function tradeHistoryDataTableSelector(openTrades: TradeHistoryData[]) {
	const tableHead = [...TradeHistoryTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: openTrades.map((trades) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: `${trades.type}`, style: "text-base font-normal" },
						itemImage: trades.type === "Buy" ? "/images/buy.png" : "/images/sell.png",
					}),
				},
				{ displayItem: `${trades.price} USDT` },
				{ displayItem: `${trades.units} USDT` },
				{ displayItem: `${trades.total} USDT` },
				{ displayItem: trades.date },
			],
			actions: [],
		})),
	};

	return { tableHead, tableBody };
}

export function tradeHistoryDataTableMobileSelector(openTrades: TradeHistoryData[]) {
	const dataMobile: ITableMobile[] = openTrades.map((trades) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: `${trades.type}`, style: "text-base font-normal" },
				itemImage: trades.type === "Buy" ? "/images/buy.png" : "/images/sell.png",
			}),
			displayItemValue: "",
		},
		actions: [],
		tBody: [
			{
				displayItemTitle: "Price",
				displayItemValue: `${trades.price} USDT`,
			},
			{
				displayItemTitle: "Unit",
				displayItemValue: `${trades.units} USDT`,
			},
			{
				displayItemTitle: "Total",
				displayItemValue: `${trades.total} USDT`,
			},
			{
				displayItemTitle: "Date",
				displayItemValue: trades.date,
			},
		],
	}));

	return dataMobile;
}

export function orderDataTableSelector(openTrades: Orders[]) {
	const tableHead = [...TradeHistoryTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: openTrades.map((trades) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: `${trades.type}`, style: "text-base font-normal" },
						itemImage: trades.type === "Buy" ? "/images/buy.png" : "/images/sell.png",
					}),
				},
				{ displayItem: `${trades.price} USDT` },
				{ displayItem: `${trades.units} USDT` },
				{ displayItem: `${trades.total} USDT` },
				{ displayItem: trades.date },
			],
			actions: [],
		})),
	};

	return { tableHead, tableBody };
}

export function orderDataTableMobileSelector(openTrades: Orders[]) {
	const dataMobile: ITableMobile[] = openTrades.map((trades) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: `${trades.type}`, style: "text-base font-normal" },
				itemImage: trades.type === "Buy" ? "/images/buy.png" : "/images/sell.png",
			}),
			displayItemValue: "",
		},
		actions: [],
		tBody: [
			{
				displayItemTitle: "Price",
				displayItemValue: `${trades.price} USDT`,
			},
			{
				displayItemTitle: "Unit",
				displayItemValue: `${trades.units} USDT`,
			},
			{
				displayItemTitle: "Total",
				displayItemValue: `${trades.total} USDT`,
			},
			{
				displayItemTitle: "Date / Time",
				displayItemValue: trades.date,
			},
		],
	}));

	return dataMobile;
}
