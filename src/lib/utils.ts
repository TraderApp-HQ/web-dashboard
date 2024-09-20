import type { KeyboardEvent } from "react";
import type { IRecentTransactions, OpenTrade, Signal } from "./types";
import type SignalsData from "./types";
import { format } from "date-fns";
import { ISelectBoxOption } from "~/components/interfaces";

export async function getAsset(id: string | undefined, data: SignalsData) {
	const res = data.signals.signals.filter((signal: Signal) => signal.id === id);
	return res[0];
}

export async function getTrade(id: string | undefined, data: OpenTrade[]) {
	const res = data.filter((trade: OpenTrade) => trade.id === id);
	return res[0];
}

export async function getTransaction(id: string | undefined, data: IRecentTransactions[]) {
	const res = data.filter((transaction: IRecentTransactions) => transaction.id === id);
	return res[0];
}

export const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
	// Noticed that using 'event.key === "e"' here prevents letter "e" from being usable when filling forms
	if (event.key === "e" || event.key === "E" || event.key === "-" || event.key === "+") {
		event.preventDefault();
	}
};

export const formattedDate = (date: string | number | Date) =>
	format(new Date(date), "MMMM dd, yyyy, hh:mma");

// Convert enum to options
export const convertEnumToOptions = <T extends Record<string, string>>(
	enumObject: T,
): ISelectBoxOption[] => {
	return Object.values(enumObject).map((value) => ({
		value,
		displayText: value,
	}));
};
