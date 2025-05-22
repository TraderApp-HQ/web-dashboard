export enum UserRole {
	USER = "USER",
	SUBSCRIBER = "SUBSCRIBER",
	ADMIN = "ADMIN",
	SUPER_ADMIN = "SUPER_ADMIN",
}

export enum NotificationChannel {
	EMAIL = "EMAIL",
	SMS = "SMS",
	WHATSAPP = "WHATSAPP",
}

export enum VerificationType {
	VERIFY = "VERIFY",
	UPDATE = "UPDATE",
	AUTHENTICATE = "AUTHENTICATE",
}

export enum Platform {
	INSTAGRAM = "Instagram",
	TWITTER = "X - (Twitter)",
	TIKTOK = "Tiktok",
	FACEBOOK = "Facebook",
	WHATSAPP = "Whatsapp",
	YOUTUBE = "Youtube",
	OTHERS = "Others",
}

export enum PlatformAction {
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

export enum UserTaskPageTab {
	ALL = "all",
	PENDING = "pending",
	COMPLETED = "completed",
}
