// import type { SignalHistoryItem } from "~/lib/types";
// import type { SignalHistoryItem } from "~/lib/types";
import type {
	IPerformanceData,
	IPerformanceSummaryData,
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
						itemText: { text: signal.baseAsset.name, style: "text-base font-normal" },
						itemSubText: { text: signal.baseAsset.symbol },
						itemImage: signal.baseAsset.logo,
						isAssetItem: true,
					}),
				},
				{
					displayItem:
						signal.status !== SignalStatus.PENDING
							? `${signal.currentPrice ?? "-"} USDT`
							: "-",
				},
				{
					displayItem:
						signal.status !== SignalStatus.PENDING
							? renderPercentageChange(signal.currentChange)
							: "-",
				},
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
				itemText: { text: signal.baseAsset.name, style: "text-base font-normal" },
				itemSubText: { text: signal.baseAsset.symbol },
				itemImage: signal.baseAsset.logo,
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
				displayItemValue:
					signal.status !== SignalStatus.PENDING ? `$${signal.currentPrice}` : "-",
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
				displayItemValue:
					signal.status !== SignalStatus.PENDING
						? renderPercentageChange(signal.currentChange)
						: "-",
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
						itemText: { text: signal.baseAsset.name, style: "text-base font-normal" },
						itemImage: signal.baseAsset.logo,
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
				itemText: { text: signal.baseAsset.name, style: "text-base font-normal" },
				itemSubText: { text: signal.baseAsset.symbol },
				itemImage: signal.baseAsset.logo,
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

export function signalsPerfomanceSummary(signals: ISignal[]): IPerformanceSummaryData {
	let bestPerformer: ISignal = signals[0];
	let worstPerformer: ISignal = signals[0];

	signals.forEach((signal) => {
		bestPerformer =
			signal.maxGain > (bestPerformer?.maxGain || -Infinity) ? signal : bestPerformer;
		worstPerformer =
			signal.maxGain < (worstPerformer?.maxGain || Infinity) ? signal : worstPerformer;
	});

	const bestSignal: IPerformanceData | undefined = bestPerformer
		? {
				itemLogo: bestPerformer.baseAsset.logo,
				itemName: bestPerformer.baseAsset.name,
				itemPercentageChange: bestPerformer.maxGain,
			}
		: undefined;
	const worstSignal: IPerformanceData | undefined = worstPerformer
		? {
				itemLogo: worstPerformer.baseAsset.logo,
				itemName: worstPerformer.baseAsset.name,
				itemPercentageChange: worstPerformer.maxGain,
			}
		: undefined;

	return { bestSignal, worstSignal };
}
