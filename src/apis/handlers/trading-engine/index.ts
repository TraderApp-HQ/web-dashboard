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
	ITradeAsset,
	ITradeAggregate,
	ITradingAccountInfo,
	IUpdateAccountInput,
	IUserTrade,
	IGetTradeAssets,
	IGetTradingPlatform,
	ISupportedTradingPlatform,
	IGetAccountConnectionTradingPlatformsInput,
	IFetchAccountConnectionTradingPlatform,
	IMasterTradeTpAndSlOptions,
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

	public async getOpenTrades({
		isAdmin,
	}: {
		isAdmin: boolean;
	}): Promise<{ trades: IMasterTrade[] | IUserTrade[]; tradesAggregate: ITradeAggregate }> {
		const response = await this.apiClient.get<IResponse>({
			url: isAdmin ? `/trade/master-trade` : `/trade/user-trade`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch current open trades.");
		}

		const { data } = response;

		const openTrades = isAdmin
			? {
					trades: data.trades as IMasterTrade[],
					tradesAggregate: data.tradesAggregate as ITradeAggregate,
				}
			: {
					trades: data.trades as IUserTrade[],
					tradesAggregate: data.tradesAggregate as ITradeAggregate,
				};

		return openTrades;
	}

	public async createTrade(trade: ICreateTrade): Promise<IMasterTrade> {
		const response = await this.apiClient.post<IResponse>({
			url: "/trade/master-trade",
			data: trade,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to create trade");
		}

		const { data } = response;
		return data as IMasterTrade;
	}

	public async getTrade(tradeId: string): Promise<IMasterTrade> {
		const response = await this.apiClient.get<IResponse>({
			url: `/trade/master-trade/${tradeId}`,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to fetch trade");
		}

		const { data } = response;
		return data as IMasterTrade;
	}

	public async getAllTradeAssets({
		page,
		rowsPerPage,
		orderBy,
		sortBy,
		category,
	}: IGetTradeAssets): Promise<ITradeAsset[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/trade/trade-assets?category=${category}&page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&sortBy=${sortBy}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch trade assets records");
		}

		const { data } = response;
		return data.assets as ITradeAsset[];
	}

	public async getAllCurrencies(): Promise<ITradeAsset[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/trade/supported-currencies`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch currencies records");
		}

		const { data } = response;
		return data as ITradeAsset[];
	}

	public async getSupportedTradingPlatforms({
		baseAssetId,
		quoteCurrencyId,
	}: IGetTradingPlatform): Promise<ISupportedTradingPlatform[]> {
		// Fetch data from API
		const response = await this.apiClient.get<IResponse>({
			url: `/trade/supported-trading-platforms?baseAssetId=${baseAssetId}&quoteCurrencyId=${quoteCurrencyId}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch supported Exchanges records");
		}

		const { data } = response;
		return data as ISupportedTradingPlatform[];
	}

	public async getTradeCurrentPrice({
		asset,
		quote,
	}: {
		asset: string;
		quote: string;
	}): Promise<{ price: number }> {
		const response = await this.apiClient.get<IResponse>({
			url: `/trade/trade-current-price?asset=${asset}&quote=${quote}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch trade current price.");
		}

		const { data } = response;
		return data as { price: number };
	}

	public async getAllAccountsTradingPlatforms({
		page,
		rowsPerPage,
		orderBy,
		status,
	}: IGetAccountConnectionTradingPlatformsInput): Promise<
		IFetchAccountConnectionTradingPlatform[]
	> {
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
			url: `/trade/account-trading-platforms?${queryParams.toString()}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch trading platform records");
		}

		const { data } = response;
		return data as IFetchAccountConnectionTradingPlatform[];
	}

	public async updateMasterTradeTpAndSl({
		masterTradeId,
		stopLossPrice,
		takeProfitPrice,
	}: IMasterTradeTpAndSlOptions): Promise<string> {
		// Construct query parameters
		const queryParams = new URLSearchParams();
		queryParams.set("stopLoss", stopLossPrice.toString());

		if (takeProfitPrice !== undefined && takeProfitPrice > 0) {
			queryParams.set("takeProfit", takeProfitPrice.toString());
		}

		// Fetch data from API
		const response = await this.apiClient.patch<IResponse>({
			url: `/trade/master-trade/set-tp-sl/${masterTradeId}?${queryParams.toString()}`,
			data: {},
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to update TP/SL for master trade");
		}

		return response.message;
	}

	public async closeActiveMasterTrade({
		masterTradeId,
		percentage,
	}: {
		masterTradeId: string;
		percentage?: number;
	}): Promise<string> {
		// Construct query parameters
		const queryParams = new URLSearchParams();

		if (percentage !== undefined && percentage > 0) {
			queryParams.set("percentage", percentage.toString());
		}

		// Fetch data from API
		const response = await this.apiClient.patch<IResponse>({
			url: `/trade/master-trade/close-active-trade/${masterTradeId}?${queryParams.toString()}`,
			data: {},
		});

		if (response.error) {
			throw new Error(response.message ?? `Failed to close trade with id: ${masterTradeId}`);
		}

		return response.message;
	}

	public async breakEvenActiveMasterTrade({
		masterTradeId,
	}: {
		masterTradeId: string;
	}): Promise<string> {
		// Fetch data from API
		const response = await this.apiClient.patch<IResponse>({
			url: `/trade/master-trade/break-even/${masterTradeId}`,
			data: {},
		});

		if (response.error) {
			throw new Error(
				response.message ?? `Failed to break even for master trade id: ${masterTradeId}`,
			);
		}

		return response.message;
	}

	public async cancelMasterTrade({ masterTradeId }: { masterTradeId: string }): Promise<string> {
		// Fetch data from API
		const response = await this.apiClient.patch<IResponse>({
			url: `/trade/master-trade/cancel-trade/${masterTradeId}`,
			data: {},
		});

		if (response.error) {
			throw new Error(
				response.message ?? `Failed to cancel master trade with id: ${masterTradeId}`,
			);
		}

		return response.message;
	}

	public async triggerMasterTradeOrderPlacement({
		masterTradeId,
	}: {
		masterTradeId: string;
	}): Promise<string> {
		// Fetch data from API
		const response = await this.apiClient.patch<IResponse>({
			url: `/trade/master-trade/trigger-order-placement/${masterTradeId}`,
			data: {},
		});

		if (response.error) {
			throw new Error(
				response.message ??
					`Failed to trigger order placement for master trade with id: ${masterTradeId}`,
			);
		}

		return response.message;
	}
}
