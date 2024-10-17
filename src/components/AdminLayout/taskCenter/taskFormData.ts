import { ITaskPlatforms } from "~/apis/handlers/users/interfaces";

export enum Platform {
	INSTAGRAM = "Instagram",
	TWITTER = "X - (Twitter)",
	TIKTOK = "Tiktok",
	FACEBOOK = "Facebook",
	WHATSAPP = "Whatsapp",
	YOUTUBE = "Youtube",
	OTHERS = "Others",
}

export enum PlatformActions {
	LIKE = "Like",
	FOLLOW = "Follow",
	COMMENT = "Comment",
	SHARE = "Share",
	POST = "Post",
}

export enum TaskCategory {
	SOCIAL = "Social Media Engagement",
	CONTENT = "Content Creation",
	MARKET = "Market Research",
	REFERRAL = "Referral Tasks",
}

export enum TaskType {
	PERMANENT = "Permanent",
	TIME_BASED = "Time Based",
}

export enum TaskStatus {
	NOT_STARTED = "Not Started",
	STARTED = "Started",
	COMPLETED = "Completed",
}

export enum UserTaskStatus {
	PENDING = "Pending",
	IN_REVIEW = "In Review",
	DONE = "Done",
}

export interface ITaskCategory {
	displayText: string;
	value: TaskCategory;
}

interface ITaskPlatform {
	displayText: string;
	value: Platform;
}

interface ITaskType {
	displayText: string;
	value: TaskType;
}

export interface ITaskForm {
	onClose: () => void;
	isLoading: boolean;
	platforms: ITaskPlatforms[];
	task?: ICreateTaskFormData;
}

export interface IUpdateTaskFormProps {
	onClose: () => void;
	isLoading: boolean;
	task: ICreateTaskFormData;
}

export interface ICreateTaskFormData {
	id?: string;
	title: string;
	description: string;
	objective?: string;
	taskType: TaskType;
	category: TaskCategory;
	platformId?: string;
	platformName?: Platform;
	link?: string;
	expectedActions?: PlatformActions[];
	points: number;
	startDate?: Date;
	dueDate?: Date;
	status?: TaskStatus;
}

export interface ITaskFormError {
	startDate?: string;
	dueDate?: string;
}

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
