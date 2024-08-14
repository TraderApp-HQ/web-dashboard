import { getAccessToken, setAccessToken } from "~/utils/localStorage";
import type { IResponse } from "../handlers/interfaces";

interface RequestOptions extends RequestInit {
	retry?: boolean;
	isAuthenticated?: boolean;
}

interface RequestInput {
	url: string;
	data?: any;
	options?: RequestOptions;
}

interface MutationRequestInput extends RequestInput {
	data: any;
}

export class APIClient {
	private baseURL: string;
	private refreshToken: () => Promise<string | null>;

	constructor(baseURL: string, refreshToken: () => Promise<string | null>) {
		this.baseURL = baseURL;
		this.refreshToken = refreshToken;
	}

	async post<T>({ url, data, options }: MutationRequestInput): Promise<T> {
		return this.request<T>("POST", url, data, options);
	}

	async get<T>({ url, data, options }: RequestInput): Promise<T> {
		return this.request<T>("GET", url, data, options);
	}

	async put<T>({ url, data, options }: MutationRequestInput): Promise<T> {
		return this.request<T>("PUT", url, data, options);
	}

	async patch<T>({ url, data, options }: MutationRequestInput): Promise<T> {
		return this.request<T>("PATCH", url, data, options);
	}

	async delete<T>({ url, options }: RequestInput): Promise<T> {
		return this.request<T>("DELETE", url, undefined, options);
	}

	private async request<T>(
		method: string,
		url: string,
		data?: any,
		options?: RequestOptions,
	): Promise<T> {
		const isAuthenticated = options?.isAuthenticated ?? true;
		const fullUrl = new URL(url, this.baseURL).toString();
		const requestOptions: RequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				...(isAuthenticated && getAccessToken()
					? { Authorization: `Bearer ${getAccessToken()}` }
					: {}),
			},
			...options,
		};

		if (data) {
			requestOptions.body = JSON.stringify(data);
		}

		try {
			const response: Response = await fetch(fullUrl, requestOptions);
			const responseData: IResponse = await response.json();
			if (!response.ok) {
				// check if error is unauthorized invalid token, then refresh users tokens and retry the initial request
				if (response.status === 401) {
					const newToken = await this.refreshToken();
					if (newToken) {
						setAccessToken(newToken);
						requestOptions.headers = {
							...requestOptions.headers,
							Authorization: `Bearer ${newToken}`,
						};
						return this.request<T>(method, url, data, options);
					} else {
						// tokens refresh failed
						throw new Error("Token refresh failed");
					}
				} else {
					// tokens are fine but the request failed
					throw new Error(
						responseData.message || `Request failed with status ${response.status}`,
					);
				}
			}
			return responseData as T;
		} catch (error: any) {
			if (options?.retry && error.response?.status >= 500) {
				await this.delay(3000); // 5 seconds delay
				return this.request<T>(method, url, data, { ...options, retry: false });
			}
			throw error;
		}
	}

	private async delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
