import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "~/lib/types";

export interface ITHead {
	displayItem: string | JSX.Element | ReactNode;
	styles?: string;
	isAssetItem?: boolean;
	tooltip?: {
		text: string;
		icon?: JSX.Element | ReactNode;
	};
}

export interface ITBody {
	tBodyRows: ITBodyRow[];
}

export interface ITableActions {
	label: string;
	url?: string;
	styles?: string;
	isToggle?: boolean;
	onClick?: () => void;
	setToggle?: () => void;
	icon?: ComponentType<IconProps>;
	deleteAction?: boolean;
}

interface ITBodyRow {
	tBodyColumns: ITBodyColumns[];
	actions?: ITableActions[];
}

interface ITBodyColumns {
	displayItem: string | JSX.Element | ReactNode;
	styles?: string;
}

export interface ITableMobileItem {
	displayItemTitle: string | JSX.Element | ReactNode;
	displayItemValue: string | JSX.Element | ReactNode;
	styles?: string;
	tooltip?: {
		text: string;
		icon?: JSX.Element | ReactNode;
	};
}

export interface ITableMobile {
	tHead: ITableMobileItem;
	tBody: ITableMobileItem[];
	actions?: ITableActions[];
}

export interface IPerformanceData {
	itemLogo: string;
	itemName: string;
	itemPercentageChange: number;
}

export interface IPerformanceSummaryData {
	bestSignal: IPerformanceData | undefined;
	worstSignal: IPerformanceData | undefined;
}

export interface IActiveSignalCardProps {
	summary: IPerformanceSummaryData | undefined;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
}
