import type { UserStatus } from "~/config/enum";
import type { NotificationChannel, UserRole, VerificationType } from "./enums";

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
