import { APIClient } from "~/apis/apiClient";
import { UsersService } from "~/apis/handlers/users";
import { IResponse } from "../interfaces";
import { WalletType } from "./enum";
import { IUserWalletResponse } from "./interface";

export class WalletsService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
		if (!process.env.NEXT_PUBLIC_WALLETS_SERVICE_API_URL)
			throw Error("Wallets service backend url not found");
		this.apiClient = new APIClient(
			process.env.NEXT_PUBLIC_WALLETS_SERVICE_API_URL,
			this.usersService.refreshUserAccessToken.bind(this.usersService),
		);
	}

	public async getWalletBalance(wallet: WalletType): Promise<IUserWalletResponse> {
		const response = await this.apiClient.get<IResponse>({
			url: `/wallets/user-wallet-type?type=${wallet}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch wallet balance.");
		}

		const { data } = response;

		return data as IUserWalletResponse;
	}
}
