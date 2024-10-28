/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import { GetServerSidePropsResult } from "next";
import StatusPill from "~/components/common/StatusPill";
import { ColourTheme, HTMLElements, OperationStatus, UserStatus } from "~/config/enum";
import TargetPill from "~/components/common/TargetPill";
import type { IDisplayItem, TartgetProfit } from "~/lib/types";
import DisplayItem from "~/components/common/DisplayItem";
import {
	TaskCategory,
	TaskStatus,
	UserTaskStatus,
} from "~/components/AdminLayout/taskCenter/taskFormData";
import CategoryPill from "~/components/common/CategoryPill";

export function capitalizeFirstLetter(str: string) {
	return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
}

export function renderDisplayItem({
	itemText,
	itemSubText,
	itemImage,
	styles,
	isAssetItem,
}: IDisplayItem) {
	return React.createElement(DisplayItem, {
		itemText,
		itemSubText,
		itemImage,
		styles,
		isAssetItem,
	});
}

export function renderTargetProfits({
	targetProfits,
	styles,
	containerStyles,
}: {
	targetProfits: TartgetProfit[];
	styles?: string;
	containerStyles?: string;
}) {
	const targetProfitPills = targetProfits.map((tp, index) => {
		const theme = tp.isReached ? ColourTheme.SUCCESS : ColourTheme.SECONDARY;
		return React.createElement(TargetPill, {
			key: index,
			target: `${tp.percent}%`,
			theme,
			styles,
		});
	});
	return React.createElement(
		HTMLElements.div,
		{
			className: `flex items-center gap-1 justify-end flex-wrap sm:flex sm:justify-center sm:gap-1 ${containerStyles}`,
		},
		targetProfitPills,
	);
}

export function renderStatus(status: string, style?: { justify?: string }) {
	let theme: ColourTheme;
	switch (status) {
		case UserTaskStatus.DONE:
		case TaskStatus.STARTED:
		case OperationStatus.ACTIVE:
		case OperationStatus.COMPLETED: {
			theme = ColourTheme.SUCCESS;
			break;
		}
		case UserTaskStatus.PENDING:
		case TaskStatus.NOT_STARTED:
		case OperationStatus.PAUSED:
		case OperationStatus.PROCESSING: {
			theme = ColourTheme.WARNING;
			break;
		}
		case TaskStatus.COMPLETED:
		case UserTaskStatus.IN_REVIEW: {
			theme = ColourTheme.REVIEW;
			break;
		}
		case OperationStatus.FAILED: {
			theme = ColourTheme.DANGER;
			break;
		}
		case UserStatus.INACTIVE: {
			theme = ColourTheme.DANGER;
			break;
		}
		default:
			theme = ColourTheme.PRIMARY;
	}
	return React.createElement(StatusPill, { status, theme, style });
}

export function renderCategory(category: TaskCategory) {
	let theme: string;
	switch (category) {
		case TaskCategory.CONTENT: {
			theme = "bg-[#E7ECFF] text-[#3E57BF]";
			break;
		}
		case TaskCategory.SOCIAL: {
			theme = "bg-[#EDFDF8] text-[#234475]";
			break;
		}
		case TaskCategory.MARKET: {
			theme = "bg-[#FEF6F7] text-[#E02D3C]";
			break;
		}
		case TaskCategory.REFERRAL: {
			theme = "bg-[#EDFDF8] text-[#08875D]";
			break;
		}
		default: {
			theme = "";
		}
	}
	return React.createElement(CategoryPill, { category, theme });
}

export const serverRedirect = (destination: string): GetServerSidePropsResult<{}> => {
	return {
		redirect: {
			destination,
			permanent: false,
		},
	};
};
