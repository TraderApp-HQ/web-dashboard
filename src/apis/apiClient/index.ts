/* eslint-disable @typescript-eslint/no-explicit-any */
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

		// Only set Content-Type if there's actual data
		const headers: Record<string, string> = {};

		if (data) {
			headers["Content-Type"] = "application/json";
		}

		if (isAuthenticated && getAccessToken()) {
			headers.Authorization = `Bearer ${getAccessToken()}`;
		}

		const requestOptions: RequestInit = {
			method,
			headers,
			mode: "cors", // Explicitly set CORS mode
			// credentials: "include", // Include cookies if needed
			...options,
		};

		if (data) {
			requestOptions.body = JSON.stringify(data);
		}

		try {
			// Add timeout to prevent hanging requests
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

			const response: Response = await fetch(fullUrl, {
				...requestOptions,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			// Check if response is actually available
			if (!response) {
				throw new Error("Network request failed - no response received");
			}

			const responseData: IResponse = await response.json();
			if (!response.ok) {
				// check if error is unauthorized invalid token, then refresh users tokens and retry the initial request
				if (response.status === 401 && responseData.message === "Invalid Token") {
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
			// Check if it's a CORS/preflight error
			if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
				throw new Error("Network request blocked - possible CORS or network restriction");
			}

			if (error.name === "AbortError") {
				throw new Error("Request timeout - network may be restricted");
			}

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
