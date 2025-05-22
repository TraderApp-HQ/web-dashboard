import type { Signal, SignalHistoryItem } from "~/lib/types";
import type { ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { ActiveSignalsTableHeadItems, SignalsHistoryTableHeadItems } from "./constants";
import type { Dispatch, SetStateAction } from "react";
import { renderDisplayItem, renderStatus, renderTargetProfits } from "~/helpers";
import { format } from "date-fns";

export function activeSignalsDataTableSelector(
	activeSignals: Signal[],
	setToggleDeleteModal: Dispatch<SetStateAction<boolean>>,
	toggleDeleteModal: boolean,
	isToggle: boolean,
	setToggle: Dispatch<SetStateAction<boolean>>,
) {
	const tableHead = [...ActiveSignalsTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: activeSignals.map((signal) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: signal.shortName, style: "text-base font-normal" },
						itemImage: signal.logoUrl,
					}),
				},
				{ displayItem: `${signal.currentPrice} USDT` },
				{ displayItem: `${signal.change} %` },
				{ displayItem: renderTargetProfits({ targetProfits: signal.targetProfits }) },
				{ displayItem: format(signal.created, "do MMMM yyyy") },
				{ displayItem: renderStatus(signal.status) },
			],
			actions: [
				{
					label: "View more",
					url: `#`,
				},
				{
					label: "Delete signal",
					onClick: () => setToggleDeleteModal(!toggleDeleteModal),
				},
				{
					label: "Resume signal",
					isToggle: isToggle,
					setToggle: () => setToggle(!isToggle),
				},
			],
		})),
	};

	return { tableHead, tableBody };
}

export function activeSignalsDataTableMobileSelector(
	activeSignals: Signal[],
	setToggleDeleteModal: Dispatch<SetStateAction<boolean>>,
	toggleDeleteModal: boolean,
	isToggle: boolean,
	setToggle: Dispatch<SetStateAction<boolean>>,
) {
	const dataMobile: ITableMobile[] = activeSignals.map((signal) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: signal.shortName, style: "text-base font-normal" },
				itemImage: signal.logoUrl,
			}),
			displayItemValue: "",
		},
		actions: [
			{
				label: "View more",
				url: `#`,
			},
			{
				label: "Delete signal",
				onClick: () => setToggleDeleteModal(!toggleDeleteModal),
			},
			{
				label: "Resume signal",
				isToggle: isToggle,
				setToggle: () => setToggle(!isToggle),
			},
		],
		tBody: [
			{
				displayItemTitle: "Current Price",
				displayItemValue: `$${signal.currentPrice}`,
			},
			{
				displayItemTitle: "Change",
				displayItemValue: `${signal.change}%`,
			},
			{
				displayItemTitle: "Target Profits",
				displayItemValue: renderTargetProfits({
					targetProfits: signal.targetProfits,
					styles: "text-sm",
				}),
			},
			{
				displayItemTitle: "Created",
				displayItemValue: format(signal.created, "do MMMM yyyy"),
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(signal.status),
			},
		],
	}));

	return dataMobile;
}

export function signalsHistoryDataTableSelector(data: SignalHistoryItem[]) {
	const tableHead = [...SignalsHistoryTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: data.map((signal) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: signal.asset, style: "text-base font-normal" },
						itemImage: signal.image,
					}),
				},
				{ displayItem: `${signal.winLoss} USDT` },
				{ displayItem: format(signal.startDate, "do MMMM yyyy") },
				{ displayItem: format(signal.endDate, "do MMMM yyyy") },
			],
		})),
	};

	return { tableHead, tableBody };
}

export function signalsHistoryDataTableMobileSelector(data: SignalHistoryItem[]) {
	const dataMobile: ITableMobile[] = data.map((signal) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: signal.asset, style: "text-base font-normal" },
				itemSubText: { text: signal.shortName },
				itemImage: signal.image,
			}),
			displayItemValue: "",
		},
		tBody: [
			{
				displayItemTitle: "Win/loss",
				displayItemValue: `${signal.winLoss} USDT`,
			},
			{
				displayItemTitle: "Start date",
				displayItemValue: format(signal.startDate, "do MMMM yyyy"),
			},
			{
				displayItemTitle: "End date",
				displayItemValue: format(signal.endDate, "do MMMM yyyy"),
			},
		],
	}));

	return dataMobile;
}
