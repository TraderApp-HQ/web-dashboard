import type { KeyboardEvent } from "react";
import type { OpenTrade, Signal } from "./types";
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

export const formatCurrency = (value: number) =>
	new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: true, // Ensures thousand separators
	}).format(value);

export const uniqueDateFormat = (dateString: string | number | Date, includeTime: boolean = true) =>
	format(new Date(dateString), includeTime ? "MMM dd, yyyy, h:mma" : "do MMMM, yyyy");
