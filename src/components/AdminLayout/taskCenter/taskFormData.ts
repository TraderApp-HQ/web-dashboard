import { Platform, TaskCategory, TaskMode, TaskType } from "~/apis/handlers/users/enums";
import {
	ITaskCategory,
	ITaskMode,
	ITaskPlatform,
	ITaskType,
} from "~/apis/handlers/users/interfaces";

export const taskCategory: ITaskCategory[] = [
	{
		displayText: "Social Media Engagement",
		value: TaskCategory.SOCIAL,
	},
	{
		displayText: "Content Creation",
		value: TaskCategory.CONTENT,
	},
	{
		displayText: "Market Research",
		value: TaskCategory.MARKET,
	},
	{
		displayText: "Referral Tasks",
		value: TaskCategory.REFERRAL,
	},
];

export const taskPlatform: ITaskPlatform[] = [
	{
		displayText: "Instagram",
		value: Platform.INSTAGRAM,
	},
	{
		displayText: "X - (Twitter)",
		value: Platform.TWITTER,
	},
	{
		displayText: "TikTok",
		value: Platform.TIKTOK,
	},
	{
		displayText: "YouTube",
		value: Platform.YOUTUBE,
	},
];

export const taskType: ITaskType[] = [
	{
		displayText: "Permanent",
		value: TaskType.PERMANENT,
	},
	{
		displayText: "Time Based",
		value: TaskType.TIME_BASED,
	},
];

export const taskMode: ITaskMode[] = [
	{
		displayText: "General",
		value: TaskMode.GENERAL,
	},
	{
		displayText: "On Boarding",
		value: TaskMode.ON_BOARDING,
	},
];
