import { Platform, PlatformAction, TaskCategory } from "~/apis/handlers/users/enums";
import { IFetchAllActiveTasks, ITaskPlatforms } from "~/apis/handlers/users/interfaces";

export const platformsMockData: ITaskPlatforms[] = [
	{
		_id: "123",
		name: Platform.INSTAGRAM,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/instagram.jpeg",
		isActive: true,
		supportedActions: [
			PlatformAction.LIKE,
			PlatformAction.FOLLOW,
			PlatformAction.COMMENT,
			PlatformAction.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		_id: "456",
		name: Platform.TWITTER,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/twitter.png",
		isActive: true,
		supportedActions: [
			PlatformAction.LIKE,
			PlatformAction.FOLLOW,
			PlatformAction.COMMENT,
			PlatformAction.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		_id: "789",
		name: Platform.TIKTOK,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/tiktok.png",
		isActive: false,
		supportedActions: [
			PlatformAction.LIKE,
			PlatformAction.FOLLOW,
			PlatformAction.COMMENT,
			PlatformAction.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		_id: "abc",
		name: Platform.FACEBOOK,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/facebook.png",
		isActive: true,
		supportedActions: [
			PlatformAction.LIKE,
			PlatformAction.FOLLOW,
			PlatformAction.COMMENT,
			PlatformAction.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		_id: "def",
		name: Platform.WHATSAPP,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/whatsapp.jpeg",
		isActive: true,
		supportedActions: [PlatformAction.SHARE],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		_id: "ghi",
		name: Platform.YOUTUBE,
		logoUrl: "https://aws-s3-dev-users-service.s3.eu-west-1.amazonaws.com/youtube.jpeg",
		isActive: false,
		supportedActions: [
			PlatformAction.LIKE,
			PlatformAction.FOLLOW,
			PlatformAction.COMMENT,
			PlatformAction.SHARE,
		],
		categories: [TaskCategory.SOCIAL, TaskCategory.CONTENT],
	},
	{
		_id: "jkl",
		name: Platform.OTHERS,
		logoUrl: "",
		isActive: true,
		supportedActions: [],
		categories: [TaskCategory.CONTENT, TaskCategory.MARKET, TaskCategory.REFERRAL],
	},
];

export const activeTasksTest: IFetchAllActiveTasks = {
	allTask: [],
	userTask: [],
};
