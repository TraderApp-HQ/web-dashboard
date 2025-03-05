import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "~/lib/types";

export interface ITHead {
	displayItem: string | JSX.Element | ReactNode;
	styles?: string;
	isAssetItem?: boolean;
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
}

export interface ITableMobile {
	tHead: ITableMobileItem;
	tBody: ITableMobileItem[];
	actions?: ITableActions[];
}

export interface ISignalPerformance {
	logo: string;
	name: string;
	maxGain: number;
}

export interface ISignalPerformanceSummary {
	bestSignal: ISignalPerformance | undefined;
	worstSignal: ISignalPerformance | undefined;
}

export interface IActiveSignalCardProps {
	summary: ISignalPerformanceSummary | undefined;
	isLoading: boolean;
}
