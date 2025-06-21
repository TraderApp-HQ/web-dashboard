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

export enum TaskMode {
	GENERAL = "General",
	ON_BOARDING = "On Boarding",
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

export enum UserOnboardingTaskField {
	IS_EMAIL_VERIFIED = "isEmailVerified",
	IS_FIRST_DEPOSIT_MADE = "isFirstDepositMade",
	IS_TRADING_ACCOUNT_CONNECTED = "isTradingAccountConnected",
	IS_SOCIAL_ACCOUNT_CONNECTED = "isSocialAccountConnected",
	IS_ONBOARDING_TASK_DONE = "isOnboardingTaskDone",
	SHOW_ONBOARDING_STEPS = "showOnboardingSteps",
	IS_PHONE_VERIFIED = "isPhoneVerified",
	IS_ID_VERIFIED = "isIdVerified",
}
