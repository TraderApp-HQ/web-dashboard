import type { SignalHistoryItem } from "~/lib/types";
import type { ISignalPerformance, ITBody, ITableMobile } from "~/components/common/DataTable/config";
import { ActiveSignalsTableHeadItems, SignalsHistoryTableHeadItems } from "./constants";
import { renderDisplayItem, renderStatus, renderTargetProfits } from "~/helpers";
import type { ISignal } from "~/apis/handlers/signals/interfaces";

export function activeSignalsDataTableSelector(activeSignals: ISignal[]) {
  const tableHead = [...ActiveSignalsTableHeadItems];
  const tableBody: ITBody = {
    tBodyRows: activeSignals.map((signal) => ({
      tBodyColumns: [
        {
          displayItem: renderDisplayItem({
            itemText: { text: signal.asset.name, style: "text-base font-normal" },
            itemImage: signal.asset.logo,
            styles: "md:!justify-start",
          }),
        },
        { displayItem: `${signal.currentPrice ?? "-"} USDT` },
        { displayItem: `${signal.currentChange ?? "-"} %` },
        {
          displayItem: renderTargetProfits({
            targetProfits: signal.targetProfits,
            // containerStyles: "!justify-start md:!pl-24",
          }),
        },
        { displayItem: signal.createdAt },
        { displayItem: renderStatus(signal.status) },
      ],
      actions: [
        {
          label: "View",
          url: `${signal.id}/screenshot_chat`,
        },
      ],
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
        url: `${signal.id}/screenshot_chat`,
      },
    ],
    tBody: [
      {
        displayItemTitle: "Current Price",
        displayItemValue: `$${signal.currentPrice}`,
      },
      {
        displayItemTitle: "Targeted Profits",
        displayItemValue: renderTargetProfits({ targetProfits: signal.targetProfits, styles: "text-sm" }),
      },
      {
        displayItemTitle: "Date / Time",
        displayItemValue: signal.createdAt,
      },
      {
        displayItemTitle: "Change",
        displayItemValue: `${signal.currentChange ?? "-"}%`,
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
        { displayItem: signal.startDate },
        { displayItem: signal.endDate },
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
        displayItemTitle: "Start date / Time",
        displayItemValue: signal.startDate,
      },
      {
        displayItemTitle: "End date / Time",
        displayItemValue: signal.endDate,
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
      signal.currentChange = ((signal.currentPrice - signal.entryPrice) / signal.entryPrice) * 100;
    }

    if (
      bestPerformer === undefined ||
      (signal.currentChange !== undefined && signal.currentChange > (bestPerformer.currentChange || -Infinity))
    ) {
      bestPerformer = signal;
    }

    if (
      worstPerformer === undefined ||
      (signal.currentChange !== undefined && signal.currentChange < (worstPerformer.currentChange || Infinity))
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
