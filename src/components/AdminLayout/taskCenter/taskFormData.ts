export enum Category {
	Social = "social media engagement",
	Content = "content creation",
	Market = "market research",
	Referral = "referral tasks",
}

export enum Platform {
	Instagram = "instagram",
	Twitter = "twitter",
	TikTok = "tiktok",
	Youtube = "youtube",
}

export interface TaskCategoryProps {
	displayText: string;
	value: Category;
}

interface TaskPlatformProps {
	displayText: string;
	value: Platform;
}

export type TaskFormProps = {
	onClose: () => void;
};

export interface FormData {
	title: string;
	description: string;
	objective?: string;
	category: Category;
	platform: Platform;
	link: string | null;
	actions: {
		likePost: boolean;
		followPage: boolean;
		sharePost: boolean;
		commentOnPost: boolean;
	};
	points: number;
	startDate: Date;
	dueDate: Date;
}

export interface TaskFormError {
	title: string | null;
	link: string | null;
	actions: string | null;
	points: string | null;
	startDate: string | null;
	dueDate: string | null;
}

export const taskCategory: TaskCategoryProps[] = [
	{
		displayText: "Social Media Engagement",
		value: Category.Social,
	},
	{
		displayText: "Content Creation",
		value: Category.Content,
	},
	{
		displayText: "Market Research",
		value: Category.Market,
	},
	{
		displayText: "Referral Tasks",
		value: Category.Referral,
	},
];

export const taskPlatform: TaskPlatformProps[] = [
	{
		displayText: "Instagram",
		value: Platform.Instagram,
	},
	{
		displayText: "X - (Twitter)",
		value: Platform.Twitter,
	},
	{
		displayText: "TikTok",
		value: Platform.TikTok,
	},
	{
		displayText: "YouTube",
		value: Platform.Youtube,
	},
];
