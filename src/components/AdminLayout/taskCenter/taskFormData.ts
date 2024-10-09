import { ITaskPlatforms } from "~/apis/handlers/users/interfaces";

export enum Platform {
	INSTAGRAM = "Instagram",
	TWITTER = "Twitter",
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

export interface TaskCategoryProps {
	displayText: string;
	value: TaskCategory;
}

interface TaskPlatformProps {
	displayText: string;
	value: Platform;
}

interface TaskTypeProps {
	displayText: string;
	value: TaskType;
}

interface TaskStatusProps {
	displayText: string;
	value: TaskStatus;
}

export type TaskFormProps = {
	onClose: () => void;
	isLoading: boolean;
	platforms: ITaskPlatforms[];
	task?: CreateTaskFormDataProps;
};

export type UpdateTaskFormProps = {
	onClose: () => void;
	isLoading: boolean;
	task: CreateTaskFormDataProps;
};

export interface TaskPlatform {
	_id: string;
	name: Platform;
	logoUrl: string;
	isActive: boolean;
	supportedActions: PlatformActions[];
	categories: TaskCategory[];
}

export interface CreateTaskFormDataProps {
	_id?: string;
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
	status: TaskStatus;
}

export interface TaskFormError {
	title: string;
	description: string;
	taskType: string;
	category: string;
	expectedActions?: string[];
	platform?: string;
	link?: string;
	points: string;
	startDate?: string;
	dueDate?: string;
	status: string;
}

export const taskCategory: TaskCategoryProps[] = [
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

export const taskPlatform: TaskPlatformProps[] = [
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

export const taskType: TaskTypeProps[] = [
	{
		displayText: "Permanent",
		value: TaskType.PERMANENT,
	},
	{
		displayText: "Time Based",
		value: TaskType.TIME_BASED,
	},
];

export const taskStatus: TaskStatusProps[] = [
	{
		displayText: "Not Started",
		value: TaskStatus.NOT_STARTED,
	},
	{
		displayText: "Started",
		value: TaskStatus.STARTED,
	},
	{
		displayText: "Completed",
		value: TaskStatus.COMPLETED,
	},
];
