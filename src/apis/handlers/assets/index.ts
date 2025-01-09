import { APIClient } from "~/apis/apiClient";
import type { IResponse } from "~/apis/handlers/interfaces";
import { UsersService } from "~/apis/handlers/users";
import type {
	ICreateSignalInput,
	IExchange,
	IFetchTradingPlatform,
	IFetchSignals,
	IGetAssetsInput,
	IGetExchangesInput,
	ISignal,
	ISignalAsset,
	ISignalUpdateInput,
	ISupportedExchangeInput,
} from "./interfaces";
// import { SignalStatus } from "./enums";

export class AssetsService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
		if (!process.env.NEXT_PUBLIC_ASSETS_SERVICE_API_URL)
			throw Error("Assets service backend url not found");
		this.apiClient = new APIClient(
			process.env.NEXT_PUBLIC_ASSETS_SERVICE_API_URL,
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
			options: { credentials: "include" },
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
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal records");
		}

		const { data } = response;
		return data as IFetchSignals;
	}

	public async getSignalsHistory(): Promise<IFetchSignals> {
		const response = await this.apiClient.get<IResponse>({
			url: `/signals/history`,
			options: { credentials: "include" },
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
	}: IGetExchangesInput): Promise<IFetchTradingPlatform[]> {
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
			options: { credentials: "include" },
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
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch assets records");
		}

		const { data } = response;
		return data.coins as ISignalAsset[];
	}

	//Currencies
	public async getAllCurrencies(): Promise<ISignalAsset[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/currencies`,
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch currencies records");
		}

		const { data } = response;
		return data as ISignalAsset[];
	}

	public async getSupportedExchanges({
		coinId,
		currencyId,
	}: ISupportedExchangeInput): Promise<IExchange[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `exchanges/supported/exchanges?coinId=${coinId}&currencyId=${currencyId}`,
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch supported Exchanges records");
		}

		const { data } = response;
		return data as IExchange[];
	}
}

// export default new AssetsService();
