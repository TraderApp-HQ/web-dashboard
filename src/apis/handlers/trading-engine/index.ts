import { APIClient } from "~/apis/apiClient";
import type { IResponse } from "~/apis/handlers/interfaces";
import { UsersService } from "~/apis/handlers/users";
import type {
	IAddFund,
	IConnectManualInput,
	ICreateTrade,
	IDeleteAccountInput,
	IGetTradingAccountInput,
	IMasterTrade,
	ITradingAccountInfo,
	IUpdateAccountInput,
} from "./interfaces";

export class TradingEngineService {
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

	public async connectManualTradingAccount(tradingAccount: IConnectManualInput) {
		const url = tradingAccount.isRefreshMode
			? "/account/refresh/manual"
			: "/account/connect/manual";

		const response = await this.apiClient.post<IResponse>({
			url,
			data: { ...tradingAccount, isRefreshMode: undefined },
		});

		if (response.error) {
			throw new Error(response.message || "Failed to connect Account");
		}

		const { message } = response;
		return message;
	}

	public async getUserTradingAccounts(userId: string): Promise<ITradingAccountInfo[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/account/all?userId=${userId}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch trading accounts");
		}

		const { data } = response;
		return data as ITradingAccountInfo[];
	}

	public async deleteUserTradingAccount({
		userId,
		platformName,
	}: IDeleteAccountInput): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/account/delete?userId=${userId}&platformName=${platformName}`,
			data: {},
		});

		if (response.error) {
			throw new Error(response.message || "Failed to delete account");
		}

		return response.message;
	}

	public async getUserTradingAccount({
		userId,
		platformName,
	}: IGetTradingAccountInput): Promise<ITradingAccountInfo> {
		const response = await this.apiClient.get<IResponse>({
			url: `/account/one?userId=${userId}&platformName=${platformName}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch trading account");
		}

		const { data } = response;
		return data as ITradingAccountInfo;
	}

	public async updateUserTradingAccount(account: IUpdateAccountInput): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/account/update/${account.id}`,
			data: account.accountData,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to update account");
		}

		return response.message;
	}

	public async addFund(data: IAddFund): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/account/add-fund`,
			data,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to add fund to account");
		}

		return response.message;
	}

	public async getOpenTrades(): Promise<IMasterTrade[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/trade`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch current open trades.");
		}

		const { data } = response;

		return data as IMasterTrade[];
	}

	public async createTrade(trade: ICreateTrade): Promise<IMasterTrade> {
		const response = await this.apiClient.post<IResponse>({
			url: "/trade",
			data: trade,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to create trade");
		}

		const { data } = response;
		return data as IMasterTrade;
	}
}
