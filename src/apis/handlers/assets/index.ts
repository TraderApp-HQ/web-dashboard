import { APIClient } from "~/apis/apiClient";
import type { IResponse } from "~/apis/handlers/interfaces";
import { UsersService } from "~/apis/handlers/users";
import type {
	ICreateSignalInput,
	IFetchTradingPlatform,
	IFetchSignals,
	IGetAssetsInput,
	ISignal,
	ISignalAsset,
	ISignalUpdateInput,
	IGetTradingPlatformsInput,
	ISupportedTradingPlatformsInput,
	ITradingPlatform,
} from "./interfaces";
// import { SignalStatus } from "./enums";

export class AssetsService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
		// Remove the environment variable check since we're using proxy
		this.apiClient = new APIClient(
			"/api/proxy", // This will be overridden in APIClient
			this.usersService.refreshUserAccessToken.bind(this.usersService),
		);
	}

	public async createSignal(signal: ICreateSignalInput): Promise<ISignal> {
		const response = await this.apiClient.post<IResponse>({
			url: "/signals/create",
			data: signal,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to create signal");
		}

		const { data } = response;
		return data as ISignal;
	}

	public async updateSignal(signal: ISignalUpdateInput): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/signals/update/${signal.id}`,
			data: { status: signal.status },
		});

		if (response.error) {
			throw new Error(response.message || "Failed to update signal");
		}

		return response.message;
	}

	public async getSignal(id: string): Promise<ISignal> {
		const response = await this.apiClient.get<IResponse>({ url: `/signals/${id}` });
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal");
		}

		const { data } = response;
		return data as ISignal;
	}

	public async getAllSignals(): Promise<IFetchSignals> {
		const response = await this.apiClient.get<IResponse>({
			url: `/signals`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal records");
		}

		const { data } = response;
		return data as IFetchSignals;
	}

	public async getActiveSignals(): Promise<IFetchSignals> {
		const response = await this.apiClient.get<IResponse>({
			url: `/signals/active`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal records");
		}

		const { data } = response;
		return data as IFetchSignals;
	}

	public async getPendingSignals(): Promise<IFetchSignals> {
		const response = await this.apiClient.get<IResponse>({
			url: `/signals/pending`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch pending signal records");
		}

		const { data } = response;
		return data as IFetchSignals;
	}

	public async getSignalsHistory(): Promise<IFetchSignals> {
		const response = await this.apiClient.get<IResponse>({
			url: `/signals/history`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal records");
		}

		const { data } = response;
		return data as IFetchSignals;
	}

	//Exchanges
	public async getAllTradingPlatforms({
		page,
		rowsPerPage,
		orderBy,
		status,
	}: IGetTradingPlatformsInput): Promise<IFetchTradingPlatform[]> {
		// Construct query parameters
		const queryParams = new URLSearchParams();

		if (page !== undefined) {
			queryParams.set("page", page.toString());
		}

		if (rowsPerPage !== undefined) {
			queryParams.set("rowsPerPage", rowsPerPage.toString());
		}

		if (orderBy !== undefined) {
			queryParams.set("orderBy", orderBy);
		}

		if (status !== undefined) {
			queryParams.append("status", status);
		}

		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/exchanges?${queryParams.toString()}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch exchange records");
		}

		const { data } = response;
		return data as IFetchTradingPlatform[];
	}

	//Exchanges
	public async getAllAssets({
		page,
		rowsPerPage,
		orderBy,
		sortBy,
		category,
	}: IGetAssetsInput): Promise<ISignalAsset[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/coins?category=${category}&page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&sortBy=${sortBy}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch assets records");
		}

		const { data } = response;
		return data.assets as ISignalAsset[];
	}

	//Currencies
	public async getAllCurrencies(): Promise<ISignalAsset[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/currencies`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch currencies records");
		}

		const { data } = response;
		return data as ISignalAsset[];
	}

	public async getSupportedTradingPlatforms({
		baseAssetId,
		quoteCurrencyId,
	}: ISupportedTradingPlatformsInput): Promise<ITradingPlatform[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/exchanges/supported-trading-platforms?baseAssetId=${baseAssetId}&quoteCurrencyId=${quoteCurrencyId}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch supported Exchanges records");
		}

		const { data } = response;
		return data as ITradingPlatform[];
	}
}

// export default new AssetsService();
