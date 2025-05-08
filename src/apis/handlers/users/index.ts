/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { APIClient } from "~/apis/apiClient";
import { getAccessToken, setAccessToken, removeAccessToken } from "~/utils/localStorage";
import { VerificationType } from "./enums";
import type {
	ICountry,
	IUserAuth,
	IUserLoginInput,
	IUserSignupInput,
	IUserProfile,
	IDecodedToken,
	IVerifyOtp,
	IGetUsersInput,
	IResetPasswordInput,
	ICreateUserInput,
	IDisableUserInput,
	PaginatedResult,
	IUpdateUserInput,
	IReferralStats,
	IReferralCommunityStats,
	ITaskPlatforms,
	ITaskWithPopulate,
	IFetchAllActiveTasks,
	ICreateUserTask,
	IFetchAllPendingTasksCount,
	ITaskData,
	IReferrals,
} from "./interfaces";
import type { IResponse } from "../interfaces";
export class UsersService {
	private apiClient: APIClient;

	constructor() {
		if (!process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL)
			throw Error("Users service backend url not found");
		this.apiClient = new APIClient(
			process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL,
			this.refreshUserAccessToken.bind(this),
		);
	}

	public async loginUser({ email, password }: IUserLoginInput): Promise<IUserProfile> {
		const response = await this.apiClient.post<IResponse>({
			url: "/auth/login",
			data: {
				email,
				password,
			},
		});

		if (response.error) {
			throw new Error(response.message || "Login failed");
		}

		const { data } = response;
		return data as IUserProfile;
	}

	public async logoutUser() {
		const response = await this.apiClient.delete<IResponse>({
			url: "/auth/logout",
			options: { credentials: "include" },
		});

		// if (response.error && response.error.statusCode === 500) {
		// 	throw new Error(response.message || "Logout failed");
		// }
		removeAccessToken();
		window.location.href = "/auth/login";
		return response.data;
	}

	public async signupUser(userData: IUserSignupInput): Promise<IUserProfile> {
		const response = await this.apiClient.post<IResponse>({
			url: "/auth/signup",
			data: userData,
		});

		if (response.error) {
			throw new Error(response.message || "Signup failed");
		}

		const { data } = response;
		return data as IUserProfile;
	}

	public async createNewUser(userData: ICreateUserInput): Promise<IUserProfile> {
		const response = await this.apiClient.post<IResponse>({
			url: "/auth/createuser",
			data: userData,
		});

		if (response.error) {
			throw new Error(response.message || "User Creation failed");
		}

		const { data } = response;
		return data as IUserProfile;
	}

	public getDataFromToken(): IDecodedToken | null {
		const accessToken = getAccessToken();
		if (!accessToken) return null;

		const decoded: IDecodedToken = jwtDecode(accessToken);
		return decoded;
	}

	public async getUser(input?: { id?: string }): Promise<IUserProfile> {
		const url = input?.id ? `/users/me?id=${input.id}` : "/users/me";
		const response = await this.apiClient.get<IResponse>({ url });

		if (response.error) {
			throw new Error(response.message);
		}

		const { data } = response;
		return data as IUserProfile;
	}

	public async getAllUsers({
		size,
		page,
		searchKeyword,
	}: IGetUsersInput): Promise<PaginatedResult<IUserProfile>> {
		const response = await this.apiClient.get<IResponse>({
			url: `/users/all?page=${page}&size=${size}&searchKeyword=${searchKeyword}`,
		});
		if (response.error) {
			throw new Error(response.message);
		}

		const { data } = response;
		return data as PaginatedResult<IUserProfile>;
	}

	public async refreshUserAccessToken(): Promise<string | null> {
		try {
			const response = await this.apiClient.post<IResponse>({
				url: "/auth/refresh-token",
				data: {},
				options: { credentials: "include" },
			});

			if (response.error) {
				throw new Error(response.message || "Token refresh failed");
			}

			const { data } = response;
			setAccessToken(data?.accessToken);
			return data?.accessToken || null;
		} catch (error: any) {
			removeAccessToken();
			const params = new URLSearchParams();
			const redirectTo = new URLSearchParams(window.location.search).get("redirect_to");
			params.append("redirect_to", redirectTo ?? window.location.pathname);
			window.location.href = "/auth/login?" + params.toString();
			throw new Error(`Token refresh failed: ${error.message}`);
		}
	}

	public async verifyOtp({
		userId,
		data,
		verificationType,
	}: IVerifyOtp): Promise<IUserAuth | void> {
		const response = await this.apiClient.put<IResponse>({
			url: "/auth/verify-otp",
			data: {
				userId,
				data,
				verificationType,
			},
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message || "Otp validation failed");
		}

		const { data: resData } = response;
		if (verificationType?.includes(VerificationType.AUTHENTICATE)) {
			setAccessToken(resData.accessToken);
			return resData as IUserAuth;
		}
	}

	public async getAllCountries(): Promise<ICountry[]> {
		const response = await this.apiClient.get<IResponse>({ url: "/countries" });
		if (response.error) {
			throw new Error(response.message);
		}

		const { data } = response;
		// Sort the countries by their name
		const countries = data as ICountry[];
		countries.sort((a, b) => a.name.localeCompare(b.name));
		return countries;
	}

	public async sendPasswordResetLink(email: string): Promise<string> {
		const response = await this.apiClient.post<IResponse>({
			url: "/auth/password-reset-link",
			data: { email },
		});

		if (response.error) {
			throw new Error(response.message || "Password reset link failed");
		}

		return response.message;
	}

	public async resetUserPassword(data: IResetPasswordInput): Promise<string> {
		const response = await this.apiClient.post<IResponse>({
			url: "/auth/password-reset",
			data,
		});

		if (response.error) {
			throw new Error(response.message || "Reset password failed");
		}

		return response.message;
	}

	public async toggleUserActivation(user: IDisableUserInput): Promise<IUserProfile> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/users/toggle-activation?id=${user.userId}`,
			data: "",
		});

		if (response.error) {
			throw new Error(response.message || "Status update failed");
		}
		const { data } = response;
		return data as IUserProfile;
	}

	public async updateUser(userData: IUpdateUserInput): Promise<IUserProfile> {
		const response = await this.apiClient.patch<IResponse>({
			url: "/users/update",
			data: userData,
		});

		if (response.error) {
			throw new Error(response.message || "User Update failed");
		}

		const { data } = response;
		return data as IUserProfile;
	}

	public async getAllActiveTaskPlatforms(): Promise<ITaskPlatforms[]> {
		const response = await this.apiClient.get<IResponse>({
			url: "/task/platforms",
		});

		if (response.error) throw new Error(response.message || "Error fetching platforms.");

		const { data } = response;
		return data as ITaskPlatforms[];
	}

	public async getAllTasks({ search }: { search?: string }): Promise<ITaskData[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/task?search=${search}`,
		});

		if (response.error) throw new Error(response.message || "Error fetching tasks.");

		const { data } = response;
		return data as ITaskData[];
	}

	public async getAllActiveTasks(): Promise<IFetchAllActiveTasks> {
		const response = await this.apiClient.get<IResponse>({
			url: "/task/active-tasks",
		});

		if (response.error) throw new Error(response.message || "Error fetching tasks.");

		const { data } = response;

		return data as IFetchAllActiveTasks;
	}

	public async getAllPendingTasksCount(): Promise<IFetchAllPendingTasksCount> {
		const response = await this.apiClient.get<IResponse>({
			url: "/task/pending-tasks-count",
		});

		if (response.error)
			throw new Error(response.message || "Error fetching pending tasks count.");

		const { data } = response;

		return data as IFetchAllPendingTasksCount;
	}

	public async createTask(data: ITaskData): Promise<string> {
		const response = await this.apiClient.post<IResponse>({
			url: "/task",
			data,
		});

		if (response.error) {
			throw new Error(response.message || "Error creating task.");
		}

		return response.message;
	}

	public async createUserTask(data: ICreateUserTask): Promise<string> {
		const response = await this.apiClient.post<IResponse>({
			url: "/task/user-task",
			data,
		});

		if (response.error) {
			throw new Error(response.message || "Error creating user task.");
		}

		return response.message;
	}

	public async updateTask({
		taskId,
		data,
	}: {
		taskId: string;
		data: ITaskData;
	}): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/task/${taskId}`,
			data,
		});

		if (response.error) {
			throw new Error(response.message || "Error updating task.");
		}

		return response.message;
	}

	public async getTask({ taskId }: { taskId: string }): Promise<ITaskWithPopulate> {
		const response = await this.apiClient.get<IResponse>({
			url: `/task/${taskId}`,
		});

		if (response.error) throw new Error(response.message || "Error updating task.");

		const { data } = response;
		return data as ITaskWithPopulate;
	}

	public async getUserTask({ taskId }: { taskId: string }): Promise<ITaskWithPopulate> {
		const response = await this.apiClient.get<IResponse>({
			url: `/task/user-task/${taskId}`,
		});

		if (response.error) throw new Error(response.message || "Error updating task.");

		const { data } = response;
		return data as ITaskWithPopulate;
	}

	public async deleteTask(taskId: string): Promise<string> {
		const response = await this.apiClient.delete<IResponse>({
			url: `/task/${taskId}`,
		});

		if (response.error) {
			throw new Error(response.message || "Error deleting task.");
		}

		return response.message;
	}

	public async updateTaskPlatformData(data: FormData): Promise<string> {
		const response = await this.apiClient.post<IResponse>({
			url: "/task/update-platform-data",
			data,
			options: {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		});

		if (response.error) {
			throw new Error(response.message || "Error updating task platform data.");
		}

		return response.message;
	}

	public async getReferrals({
		page,
		size,
		searchKeyword,
	}: IGetUsersInput): Promise<PaginatedResult<IReferrals>> {
		const response = await this.apiClient.get<IResponse>({
			url: `/users/referrals/?page=${page}&size=${size}&searchKeyword=${searchKeyword}`,
		});

		if (response.error) {
			throw new Error(response.message || "Referrals fetch failed");
		}

		const { data } = response;
		return data as PaginatedResult<IReferrals>;
	}

	public async getReferralsStats(): Promise<IReferralStats> {
		const response = await this.apiClient.get<IResponse>({
			url: "/users/referral-stats",
		});

		if (response.error) {
			throw new Error(response.message || "Referral Stats fetch failed");
		}

		const { data } = response;
		return data as IReferralStats;
	}

	public async getCommunityStats(): Promise<IReferralCommunityStats> {
		const response = await this.apiClient.get<IResponse>({
			url: "/users/community-stats",
		});

		if (response.error) {
			throw new Error(response.message || "Community Stats fetch failed");
		}

		const { data } = response;
		return data as IReferralCommunityStats;
	}

	public async getReferralOverview(): Promise<IReferralStats & IReferralCommunityStats> {
		const response = await this.apiClient.get<IResponse>({
			url: "/users/referral-overview",
		});

		if (response.error) {
			throw new Error(response.message || "Failed to fetch referral overview data");
		}

		const { data } = response;
		return data as IReferralStats & IReferralCommunityStats;
	}

	public async inviteFriends(emails: string[]): Promise<{ message: string }> {
		const response = await this.apiClient.post<IResponse>({
			url: "/users/invite-friends",
			data: {
				emails,
			},
		});

		if (response.error) {
			throw new Error(response.message || "Community Stats fetch failed");
		}

		const { data } = response;
		return data;
	}

	public async sendOtp({ userId }: any): Promise<void> {
		const response = await this.apiClient.post<IResponse>({
			url: "/auth/send-otp",
			data: {
				userId,
			},
		});

		if (response.error) {
			throw new Error(response.message || "OTP sending failed");
		}
	}

	public async trackUserReferrals({ userId }: { userId: string }): Promise<void> {
		const response = await this.apiClient.post<IResponse>({
			url: "/users/track-referrals",
			data: {
				userId,
			},
		});

		if (response.error) {
			throw new Error(response.message || "Referral tracking failed");
		}
	}
}
