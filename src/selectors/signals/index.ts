// import type { SignalHistoryItem } from "~/lib/types";
import type {
	ISignalPerformance,
	ITBody,
	ITableActions,
	ITableMobile,
} from "~/components/common/DataTable/config";
import { ActiveSignalsTableHeadItems, SignalsHistoryTableHeadItems } from "./constants";
import {
	renderDisplayItem,
	renderPercentageChange,
	renderStatus,
	renderTargetProfits,
} from "~/helpers";
import type { ISignal } from "~/apis/handlers/assets/interfaces";
import { SignalStatus } from "~/apis/handlers/assets/enums";
import { format } from "date-fns";

export function activeSignalsDataTableSelector(
	activeSignals: ISignal[],
	isAdmin: boolean,
	handleSetToggleDeleteModal?: (id: string) => void,
	handleResumeSignal?: (id: string, currentStatus: SignalStatus) => void,
) {
	const tableHead = [...ActiveSignalsTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: activeSignals.map((signal) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: signal.asset.name, style: "text-base font-normal" },
						itemSubText: { text: signal.asset.symbol },
						itemImage: signal.asset.logo,
						isAssetItem: true,
					}),
				},
				{ displayItem: `${signal.currentPrice ?? "-"} USDT` },
				{ displayItem: renderPercentageChange(signal.currentChange) },
				{
					displayItem: renderTargetProfits({
						targetProfits: signal.targetProfits,
						// containerStyles: "!justify-start md:!pl-24",
					}),
				},
				{ displayItem: new Date(signal.createdAt).toDateString() },
				{ displayItem: renderStatus(signal.status) },
			],
			actions: [
				{
					label: "View",
					url: `active/${signal.id}/screenshot_chat`,
				},
				handleSetToggleDeleteModal && isAdmin
					? {
							label: "Delete signal",
							onClick: () => handleSetToggleDeleteModal(signal.id),
						}
					: undefined,
				handleResumeSignal
					? {
							label:
								signal.status === SignalStatus.ACTIVE
									? "Active signal"
									: "Paused signal",
							isToggle: signal.status === SignalStatus.ACTIVE,
							setToggle: () => handleResumeSignal(signal.id, signal.status),
							id: signal.id,
						}
					: undefined,
			].filter((action) => action !== undefined) as ITableActions[],
		})),
	};

	return { tableHead, tableBody };
}

export function activeSignalsDataTableMobileSelector(activeSignals: ISignal[]) {
	const dataMobile: ITableMobile[] = activeSignals.map((signal) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: signal.asset.name, style: "text-base font-normal" },
				itemSubText: { text: signal.asset.symbol },
				itemImage: signal.asset.logo,
			}),
			displayItemValue: "",
		},
		actions: [
			{
				label: "View",
				url: `active/${signal.id}/screenshot_chat`,
			},
		],
		tBody: [
			{
				displayItemTitle: "Current Price",
				displayItemValue: `$${signal.currentPrice}`,
			},
			{
				displayItemTitle: "Targeted Profits",
				displayItemValue: renderTargetProfits({
					targetProfits: signal.targetProfits,
					styles: "text-sm",
				}),
			},
			{
				displayItemTitle: "Date / Time",
				displayItemValue: new Date(signal.createdAt).toDateString(),
			},
			{
				displayItemTitle: "Change",
				displayItemValue: renderPercentageChange(signal.currentChange),
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(signal.status),
			},
		],
	}));

	return dataMobile;
}

export function signalsHistoryDataTableSelector(data: ISignal[]) {
	const tableHead = [...SignalsHistoryTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: data.map((signal) => ({
			tBodyColumns: [
				{
					displayItem: renderDisplayItem({
						itemText: { text: signal.asset.name, style: "text-base font-normal" },
						itemImage: signal.asset.logo,
						isAssetItem: true,
					}),
				},
				{ displayItem: signal.maxGain },
				{ displayItem: format(signal.createdAt, "dd MMM h:mm a") },
				{ displayItem: signal.endedAt ? format(signal.endedAt, "dd MMM h:mm a") : "" },
			],
		})),
	};

	return { tableHead, tableBody };
}

export function signalsHistoryDataTableMobileSelector(data: ISignal[]) {
	const dataMobile: ITableMobile[] = data.map((signal) => ({
		tHead: {
			displayItemTitle: renderDisplayItem({
				itemText: { text: signal.asset.name, style: "text-base font-normal" },
				itemSubText: { text: signal.asset.symbol },
				itemImage: signal.asset.logo,
			}),
			displayItemValue: "",
		},
		tBody: [
			{
				displayItemTitle: "Win/loss",
				displayItemValue: `${signal.risk} USDT`,
			},
			{
				displayItemTitle: "Start date / Time",
				displayItemValue: signal.createdAt,
			},
			{
				displayItemTitle: "End date / Time",
				displayItemValue: signal.endedAt,
			},
		],
	}));

	return dataMobile;
}

export function activeSignalsPerfomanceSumary(signals: ISignal[]): ISignalPerformance[] {
	if (signals.length === 0) return [];

	let bestPerformer: ISignal | undefined;
	let worstPerformer: ISignal | undefined;

	for (const signal of signals) {
		if (signal.currentPrice !== undefined) {
			signal.currentChange = parseFloat(
				(((signal.currentPrice - signal.entryPrice) / signal.entryPrice) * 100).toFixed(2),
			);
		}

		if (
			bestPerformer === undefined ||
			(signal.currentChange !== undefined &&
				signal.currentChange > (bestPerformer.currentChange || -Infinity))
		) {
			bestPerformer = signal;
		}

		if (
			worstPerformer === undefined ||
			(signal.currentChange !== undefined &&
				signal.currentChange < (worstPerformer.currentChange || Infinity))
		) {
			worstPerformer = signal;
		}
	}

	if (bestPerformer === undefined || worstPerformer === undefined) {
		return signals.slice(0, 2).map((signal, index) => ({
			id: signal.id,
			label: index === 0 ? "Best performer" : "Worst performer",
			asset: {
				id: signal.asset.id,
				logo: signal.asset.logo,
				name: signal.asset.name,
				symbol: signal.asset.symbol,
			},
			price: signal.currentPrice,
			percentage: signal.currentChange,
		}));
	}

	if (bestPerformer.id === worstPerformer.id) {
		return signals.slice(0, 2).map((signal, index) => ({
			id: signal.id,
			label: index === 0 ? "Best performer" : "Worst performer",
			asset: {
				id: signal.asset.id,
				logo: signal.asset.logo,
				name: signal.asset.name,
				symbol: signal.asset.symbol,
			},
			price: signal.currentPrice,
			percentage: signal.currentChange,
		}));
	}

	return [
		{
			id: bestPerformer.id,
			label: "Best performer",
			asset: {
				id: bestPerformer.asset.id,
				logo: bestPerformer.asset.logo,
				name: bestPerformer.asset.name,
				symbol: bestPerformer.asset.symbol,
			},
			price: bestPerformer.currentPrice,
			percentage: bestPerformer.currentChange,
		},
		{
			id: worstPerformer.id,
			label: "Worst performer",
			asset: {
				id: worstPerformer.asset.id,
				logo: worstPerformer.asset.logo,
				name: worstPerformer.asset.name,
				symbol: worstPerformer.asset.symbol,
			},
			price: worstPerformer.currentPrice,
			percentage: worstPerformer.currentChange,
		},
	];
}
