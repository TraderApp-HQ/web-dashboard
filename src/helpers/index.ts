/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import { GetServerSidePropsResult } from "next";
import StatusPill from "~/components/common/StatusPill";
import {
	ColourTheme,
	HTMLElements,
	OperationStatus,
	TransactionStatus,
	TransactionType,
	UserStatus,
} from "~/config/enum";
import TargetPill from "~/components/common/TargetPill";
import type { IDisplayItem, TartgetProfit } from "~/lib/types";
import DisplayItem from "~/components/common/DisplayItem";
import {
	PlatformAction,
	TaskCategory,
	TaskStatus,
	UserTaskStatus,
} from "~/apis/handlers/users/enums";
import { ReferralRankType, Tier } from "~/components/common/ProgressTracker/types";
import DisplayChange from "~/components/common/DisplayChange";
import RankDisplay from "~/components/common/RankDisplay";
import DisplayTransaction from "~/components/common/DisplayTransaction";

export function capitalizeFirstLetter(str: string) {
	return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
}

export function renderDisplayItem({
	itemText,
	itemSubText,
	itemImage,
	styles,
	isAssetItem,
	useAvatar,
	avatarInitials,
}: IDisplayItem) {
	return React.createElement(DisplayItem, {
		itemText,
		itemSubText,
		itemImage,
		styles,
		isAssetItem,
		useAvatar,
		avatarInitials,
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

export function renderPercentageChange(currentChange?: number) {
	return React.createElement(DisplayChange, { currentChange });
}

export function renderTransactionType(transaction: TransactionType) {
	return React.createElement(DisplayTransaction, {
		transaction,
		textStyles: "capitalize",
	});
}

export function renderStatus(status: string, style?: { justify?: string }, bullet?: boolean) {
	let theme: ColourTheme;
	switch (status) {
		case TransactionStatus.SUCCESS:
		case TaskCategory.REFERRAL:
		case UserTaskStatus.DONE:
		case TaskStatus.STARTED:
		case OperationStatus.ACTIVE:
		case OperationStatus.COMPLETED: {
			theme = ColourTheme.SUCCESS;
			break;
		}
		case TransactionStatus.PENDING:
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
		case TransactionStatus.FAILED:
		case OperationStatus.FAILED: {
			theme = ColourTheme.DANGER;
			break;
		}
		case TaskCategory.MARKET:
		case UserStatus.INACTIVE: {
			theme = ColourTheme.DANGER;
			break;
		}
		case TaskCategory.CONTENT: {
			theme = ColourTheme.TERTIARY;
			break;
		}
		case TaskCategory.SOCIAL: {
			theme = ColourTheme.TERTIARY2;
			break;
		}
		default:
			theme = ColourTheme.PRIMARY;
	}
	return React.createElement(StatusPill, { status, theme, style, bullet });
}

export function renderRank(rank: ReferralRankType | null) {
	return React.createElement(RankDisplay, { rank });
}

export const serverRedirect = (destination: string): GetServerSidePropsResult<{}> => {
	return {
		redirect: {
			destination,
			permanent: false,
		},
	};
};

export const renderActionStatement = (action: PlatformAction | TaskCategory) => {
	switch (action) {
		case PlatformAction.LIKE:
			return "Like post.";
		case PlatformAction.COMMENT:
			return "Comment on post.";
		case PlatformAction.SHARE:
			return "Share post.";
		case PlatformAction.FOLLOW:
			return "Follow our page";
		case PlatformAction.POST:
			return "Make a post about TraderApp on any social media platform.";
		case TaskCategory.REFERRAL:
			return "Refer a new user to TrapperApp.";
		case TaskCategory.MARKET:
			return "Create awareness about TraderApp on any social media platform.";
		default:
			return "";
	}
};

export const isTierCompleted = (tier: Tier): boolean => {
	return tier.milestones.length
		? tier.milestones.every((milestone) => milestone.completed)
		: !!tier.completed;
};
