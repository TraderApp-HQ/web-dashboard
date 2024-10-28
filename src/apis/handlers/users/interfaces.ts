import type { UserStatus } from "~/config/enum";
import type { NotificationChannel, ReferralRank, UserRole, VerificationType } from "./enums";
import {
	PlatformActions,
	TaskStatus,
	TaskType,
	UserTaskStatus,
} from "~/components/AdminLayout/taskCenter/taskFormData";

export interface IUserProfile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	countryId: number;
	countryName: string;
	isEmailVerified: boolean;
	isPhoneVerified: boolean;
	isIdVerified: boolean;
	role: UserRole[];
	referralRank: ReferralRank;
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

export interface IFetchAllUsers {
	docs: IUserProfile[];
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
}

export interface IReferralCommunityStats {
	communityMembers: number;
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
	taskType: string;
	category: string;
	platformId?: ITaskPlatforms;
	platformName?: string;
	link?: string;
	expectedActions?: PlatformActions[];
	points: number;
	startDate?: Date;
	dueDate?: Date;
	status: string;
}

export interface IUserTask {
	id?: string;
	userId: string;
	taskId: string;
	taskPoints: number;
	expectedActions?: PlatformActions[];
	status: UserTaskStatus;
}

export interface IGetTasksInput {
	page?: number;
	rows?: number;
	search?: string;
}

export interface IFetchAllTasks {
	docs: ITask[];
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

export interface IGetUserTasksInput {
	page?: number;
	rows?: number;
	task: string;
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

interface IFetchActiveTasks {
	docs: ITaskTableData[];
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

interface IFetchUserTasks {
	docs: IUserTableData[];
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

export interface IFetchAllActiveTasks {
	allTask: IFetchActiveTasks;
	userTask: IFetchUserTasks;
}

export interface IFetchAllPendingTasksCount {
	pendingTasksCount: number;
}
