import type { UserStatus } from "~/config/enum";
import type {
	NotificationChannel,
	Platform,
	PlatformAction,
	TaskCategory,
	TaskMode,
	TaskStatus,
	TaskType,
	UserRole,
	UserTaskStatus,
	VerificationType,
} from "./enums";
import { IRankData, ReferralRankType } from "~/components/common/ProgressTracker/types";

export interface IUserProfile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	countryId: number;
	countryName: string;
	isEmailVerified: boolean;
	isFirstDepositMade: boolean;
	isTradingAccountConnected: boolean;
	isSocialAccountConnected: boolean;
	isOnboardingTaskDone: boolean;
	showOnboardingSteps: boolean;
	facebookUsername: string;
	twitterUsername: string;
	tiktokUsername: string;
	instagramUsername?: string;
	isPhoneVerified: boolean;
	isIdVerified: boolean;
	role: UserRole[];
	referralRank: ReferralRankType;
	status: UserStatus;
	createdAt: string;
	updatedAt: string;
}

export interface IUserLoginInput {
	email: string;
	password: string;
}

export interface IGetUsersInput {
	page?: number;
	size?: number;
	searchKeyword?: string;
}

export interface IUserSignupInput {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	countryId: number;
	countryName?: string;
	referralCode?: string;
}
export interface IResetPasswordInput {
	verificationToken: string;
	password: string;
	userId: string;
}
export interface ICreateUserInput {
	firstName: string;
	lastName: string;
	email: string;
	role: UserRole[];
	countryId?: number;
	countryName?: string;
}

export interface ICreateUserInput {
	firstName: string;
	lastName: string;
	email: string;
	role: UserRole[];
	countryId?: number;
	countryName?: string;
}

export interface IUpdateUserInput {
	id: string;
	firstName: string;
	lastName: string;
	role: UserRole[];
	countryId?: number;
	countryName?: string;
}

export interface IPasswordResetInput {
	password: string;
	verificationToken: string | null;
	userId: string | null;
}

export interface IUserAuth {
	accessToken: string;
	tokenType: string;
	expires: number;
}
export interface IDecodedToken {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isPhoneVerified: string;
	isEmailVerified: string;
	isIdVerified: string;
	role: UserRole[];
}

export interface IOtpBody {
	otp: string;
	channel: NotificationChannel;
}
export interface IVerifyOtp {
	userId: string;
	data: IOtpBody[];
	verificationType?: VerificationType[];
}

export interface ICountry {
	_id: number;
	name: string;
	code: string;
	flag: string;
	capital: string;
	dial_code: string;
	currency: { name: string; code: string; symbol: string };
	continent: string;
}

export interface IDisableUserInput {
	userId: string;
}

export interface PaginatedResult<T> {
	docs: T[];
	hasNextPage: boolean;
	hasPrevPage: boolean;
	limit: number;
	nextPage: number;
	page: number;
	pagingCounter: number;
	prevPage?: number;
	totalDocs: number;
	totalPages: number;
}

export interface IReferralStats {
	referralCode: string;
	referralLink: string;
	currentRank: null | string;
	currentEarning: number;
	rankProgress: number;
	personalATC: number;
	rankData: IRankData;
	isTestReferralTrackingInProgress: boolean;
}

export interface IReferralCommunityStats {
	communitySize: number;
	communityATC: number;
	referralTreeLevels: number;
}

export interface IReferrals {
	userId: IUserProfile;
	parentId: IUserProfile;
	level: number;
	createdAt: Date;
}

export interface IInviteCodeProps {
	code: string;
	title: string;
	isError?: boolean;
}

export interface ITaskPlatforms {
	_id: string;
	name: string;
	logoUrl: string;
	isActive: boolean;
	supportedActions: string[];
	categories: string[];
}

export interface ITask {
	id: string;
	title: string;
	description: string;
	objective?: string;
	taskMode: TaskMode;
	taskType: string;
	category: string;
	platformId?: string;
	platformName?: string;
	link?: string;
	expectedActions?: string[];
	points: number;
	startDate?: Date;
	dueDate?: Date;
	status: string;
}

export interface ITaskWithPopulate {
	id: string;
	title: string;
	description: string;
	objective?: string;
	taskMode: TaskMode;
	taskType: string;
	category: string;
	platformId?: ITaskPlatforms;
	platformName?: string;
	link?: string;
	expectedActions?: PlatformAction[];
	points: number;
	startDate?: Date;
	dueDate?: Date;
	status: string;
}

export interface ICreateUserTask {
	userId: string;
	taskId: string;
	taskPoints: number;
	expectedActions?: PlatformAction[];
	status: UserTaskStatus;
}

export interface IGetTasksInput {
	page?: number;
	rows?: number;
	search?: string;
}

export interface ITaskTableData {
	id: string;
	title: string;
	points: number;
	taskType: TaskType;
	dueDate?: Date;
	status: UserTaskStatus | TaskStatus;
}

interface IUserTableData {
	id: string;
	taskId: string;
	status: UserTaskStatus;
}

export interface IFetchAllActiveTasks {
	allTask: ITaskTableData[];
	userTask: IUserTableData[];
}

export interface IFetchAllPendingTasks {
	pendingTasks: IPendingTask[];
}

export interface IPendingTask {
	id: string;
	title: string;
}

export interface IFetchOnboardingTasks {
	onboardingTasks: IOnboardingTask[];
}

export interface IOnboardingTask extends IPendingTask {
	status: UserTaskStatus;
}
export interface ITaskCategory {
	displayText: string;
	value: TaskCategory;
}

export interface ITaskPlatform {
	displayText: string;
	value: Platform;
}

export interface ITaskType {
	displayText: string;
	value: TaskType;
}

export interface ITaskMode {
	displayText: string;
	value: TaskMode;
}

export interface ITaskForm {
	onClose: () => void;
	isLoading: boolean;
	platforms: ITaskPlatforms[];
	task?: ITaskData;
}

export interface IUpdateTaskFormProps {
	onClose: () => void;
	isLoading: boolean;
	task: ITaskData;
}

export interface ITaskData {
	id?: string;
	title: string;
	description: string;
	objective?: string;
	taskMode: TaskMode;
	taskType: TaskType;
	category: TaskCategory;
	platformId?: string;
	platformName?: Platform;
	link?: string;
	expectedActions?: PlatformAction[];
	points: number;
	startDate?: Date;
	dueDate?: Date;
	status?: TaskStatus;
}

export interface ITaskFormError {
	startDate?: string;
	dueDate?: string;
}

export interface IDocsLength {
	all: number;
	pending: number;
	completed: number;
}

export interface ITaskPlatformData {
	platform: string;
	platformAction: string;
	file: string;
}
