import { formatDistanceToNowStrict } from "date-fns";
import { ITableActions, ITableMobile, ITBody } from "~/components/common/DataTable/config";
import { renderDisplayItem, renderPandL, renderStatus } from "~/helpers";
import { OpenTradesTableHeadItems } from "./constants";
import {
	MasterTradeStatus,
	OpenTradesActionType,
	ProfitAndLossStatus,
} from "~/apis/handlers/trading-engine/enums";
import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";

interface IOpenTradesDataTableSelector {
	openTrades: IMasterTrade[];
	isAdmin: boolean;
	handleTradeAction: (params: { tradeId: string; action: OpenTradesActionType }) => void;
}

export function openTradesDataTableSelector({
	openTrades,
	isAdmin,
	handleTradeAction,
}: IOpenTradesDataTableSelector) {
	const tableHead = [...OpenTradesTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: openTrades.map((trade) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemImage: trade.baseAssetLogoUrl,
						itemText: {
							text: `${trade.baseAsset} / ${trade.quoteCurrency}`,
							style: "font-bold",
						},
						isAssetItem: true,
						assetTradeSide: renderStatus(
							trade.side,
							{ justify: "justify-center" },
							false,
							[],
							"uppercase text-[10px] font-semibold",
						),
					}),
				},
				{
					displayItem: `${trade.currentPrice}`,
				},
				{
					displayItem: `${trade.entryPrice}`,
				},
				{
					displayItem: renderPandL({
						price: trade.pnl,
						value: trade.pnlPercentage,
						type: ProfitAndLossStatus.PnL,
					}),
				},
				{
					displayItem: renderPandL({
						price: trade.takeProfitPrice,
						value: 80,
						type: ProfitAndLossStatus.PROFIT,
					}),
				},
				{
					displayItem: renderPandL({
						price: trade.stopLossPrice,
						value: 15,
						type: ProfitAndLossStatus.LOSS,
					}),
				},
				{
					displayItem: formatDistanceToNowStrict(new Date(trade.createdAt), {
						addSuffix: true,
					}),
				},
				{
					displayItem: renderStatus(
						trade.status,
						{ justify: "justify-end sm:justify-center" },
						false,
					),
				},
			],
			actions: [
				{
					label: "View Analysis",
					url: `open-trades/${trade.id}?action=${OpenTradesActionType.VIEW_ANALYSIS}`,
				},
				isAdmin && trade.status === MasterTradeStatus.ACTIVE
					? {
							label: "Set TP/SL",
							onClick: () =>
								handleTradeAction({
									tradeId: trade.id,
									action: OpenTradesActionType.SET_TP_N_SL,
								}),
						}
					: undefined,
				isAdmin && trade.status === MasterTradeStatus.ACTIVE
					? {
							label: "Close Trade",
							onClick: () =>
								handleTradeAction({
									tradeId: trade.id,
									action: OpenTradesActionType.CLOSE_TRADE,
								}),
						}
					: undefined,
				isAdmin && trade.status === MasterTradeStatus.ACTIVE
					? {
							label: "Break Even",
							onClick: () =>
								handleTradeAction({
									tradeId: trade.id,
									action: OpenTradesActionType.BREAK_EVEN,
								}),
						}
					: undefined,
				isAdmin && trade.status === MasterTradeStatus.PENDING
					? {
							label: "Trigger order placement",
							onClick: () =>
								handleTradeAction({
									tradeId: trade.id,
									action: OpenTradesActionType.TRIGGER_ORDER_PLACEMENT,
								}),
						}
					: undefined,
				isAdmin && trade.status === MasterTradeStatus.PENDING
					? {
							label: "Cancel trade",
							onClick: () =>
								handleTradeAction({
									tradeId: trade.id,
									action: OpenTradesActionType.CANCEL_TRADE,
								}),
						}
					: undefined,
			].filter((action) => action !== undefined) as ITableActions[],
		})),
	};

	return { tableHead, tableBody };
}

export function openTradesMobileDataTableSelector({
	openTrades,
	isAdmin,
	handleTradeAction,
}: IOpenTradesDataTableSelector) {
	const dataMobile: ITableMobile[] = openTrades.map((trade) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemImage: trade.baseAssetLogoUrl,
				itemText: {
					text: `${trade.baseAsset} / ${trade.quoteCurrency}`,
					style: "font-bold",
				},
				isAssetItem: true,
				assetTradeSide: renderStatus(
					trade.side,
					{ justify: "justify-center" },
					false,
					[],
					"uppercase text-[10px] font-semibold",
				),
			}),
			displayItemValue: "",
		},
		actions: [
			{
				label: "View Analysis",
				url: `open-trades/${trade.id}?action=${OpenTradesActionType.VIEW_ANALYSIS}`,
			},
			isAdmin && trade.status === MasterTradeStatus.ACTIVE
				? {
						label: "Set TP/SL",
						onClick: () =>
							handleTradeAction({
								tradeId: trade.id,
								action: OpenTradesActionType.SET_TP_N_SL,
							}),
					}
				: undefined,
			isAdmin && trade.status === MasterTradeStatus.ACTIVE
				? {
						label: "Close Trade",
						onClick: () =>
							handleTradeAction({
								tradeId: trade.id,
								action: OpenTradesActionType.CLOSE_TRADE,
							}),
					}
				: undefined,
			isAdmin && trade.status === MasterTradeStatus.ACTIVE
				? {
						label: "Break Even",
						onClick: () =>
							handleTradeAction({
								tradeId: trade.id,
								action: OpenTradesActionType.BREAK_EVEN,
							}),
					}
				: undefined,
			isAdmin && trade.status === MasterTradeStatus.PENDING
				? {
						label: "Trigger order placement",
						onClick: () =>
							handleTradeAction({
								tradeId: trade.id,
								action: OpenTradesActionType.TRIGGER_ORDER_PLACEMENT,
							}),
					}
				: undefined,
			isAdmin && trade.status === MasterTradeStatus.PENDING
				? {
						label: "Cancel trade",
						onClick: () =>
							handleTradeAction({
								tradeId: trade.id,
								action: OpenTradesActionType.CANCEL_TRADE,
							}),
					}
				: undefined,
		].filter((action) => action !== undefined) as ITableActions[],
		tBody: [
			{
				displayItemTitle: "Current Price",
				displayItemValue: `${trade.currentPrice}` || "-",
			},
			{
				displayItemTitle: "Entry Price",
				displayItemValue: `${trade.entryPrice}` || "-",
			},
			{
				displayItemTitle: "P&L(USDT)",
				displayItemValue: renderPandL({
					price: trade.pnl,
					value: trade.pnlPercentage,
					type: ProfitAndLossStatus.PnL,
				}),
			},
			{
				displayItemTitle: "TP / Est. PnL",
				displayItemValue: renderPandL({
					price: trade.takeProfitPrice,
					value: 80,
					type: ProfitAndLossStatus.PROFIT,
				}),
			},
			{
				displayItemTitle: "SL / Est. PnL",
				displayItemValue: renderPandL({
					price: trade.stopLossPrice,
					value: 15,
					type: ProfitAndLossStatus.LOSS,
				}),
			},
			{
				displayItemTitle: "Date",
				displayItemValue: formatDistanceToNowStrict(new Date(trade.createdAt), {
					addSuffix: true,
				}),
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(
					trade.status,
					{ justify: "justify-end sm:justify-center" },
					false,
				),
			},
		],
	}));

	return dataMobile;
}
