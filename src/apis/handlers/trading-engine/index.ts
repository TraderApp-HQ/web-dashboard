import { APIClient } from "~/apis/apiClient";
import type { IResponse } from "~/apis/handlers/interfaces";
import { UsersService } from "~/apis/handlers/users";
import type {
	IConnectManualInput,
	IDeleteAccountInput,
	IUserAccountWithBalance,
	IUserTradingAccount,
} from "./interfaces";

export class TradingEngineService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
		if (!process.env.NEXT_PUBLIC_TRADING_ENGINE_SERVICE_API_URL)
			throw Error("Trading Engine service backend url not found");
		this.apiClient = new APIClient(
			process.env.NEXT_PUBLIC_TRADING_ENGINE_SERVICE_API_URL,
			this.usersService.refreshUserAccessToken.bind(this.usersService),
		);
	}

	public async connectManualTradingAccount(
		TradingAccount: IConnectManualInput,
	): Promise<IUserTradingAccount> {
		const response = await this.apiClient.post<IResponse>({
			url: "/account/connect/manual",
			data: TradingAccount,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to connect Account");
		}

		const { data } = response;
		return data as IUserTradingAccount;
	}

	public async getUserTradingAccounts(userId: string): Promise<IUserAccountWithBalance[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/account/${userId}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch trading accounts");
		}

		const { data } = response;
		return data as IUserAccountWithBalance[];
	}

	public async deleteUserTradingAccount(account: IDeleteAccountInput): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/account/delete/${account.id}`,
			data: {},
		});

		if (response.error) {
			throw new Error(response.message || "Failed to delete account");
		}

		return response.message;
	}
}
