import { APIClient } from "~/apis/apiClient";
import { UsersService } from "~/apis/handlers/users";
import { IResponse } from "../interfaces";
import { CurrencyCategory, PaymentCategory, PaymentOperation, WalletType } from "./enum";
import {
	IFactoryPaymentProviderDepositResponse,
	IInitiateDepositInput,
	IPaginatedResult,
	IPaginationQuery,
	IPaymentOptions,
	ITransactionsHistory,
	IUserWalletResponse,
	IWalletSupportedCurrencies,
} from "./interface";

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

	public async getSupportedCurrencies({
		category,
	}: {
		category: CurrencyCategory;
	}): Promise<IWalletSupportedCurrencies[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/wallets/supported-currencies?category=${category}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch supported currencies.");
		}

		const { data } = response;

		return data;
	}

	public async getSupportedPaymentOptions({
		category,
		operation,
	}: {
		category: PaymentCategory;
		operation: PaymentOperation;
	}): Promise<IPaymentOptions[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/wallets/payment-methods?category=${category}&operation=${operation}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch supported payment options.");
		}

		const { data } = response;

		return data;
	}

	public async initiateDeposit(
		depositData: IInitiateDepositInput,
	): Promise<IFactoryPaymentProviderDepositResponse> {
		const response = await this.apiClient.post<IResponse>({
			url: "/wallets/initiate-deposit",
			data: depositData,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to initiate deposit.");
		}

		const { data } = response;
		return data as IFactoryPaymentProviderDepositResponse;
	}

	public async getWalletRecentTransactions({
		currentPage,
		rowsPerPage,
	}: IPaginationQuery): Promise<IPaginatedResult<ITransactionsHistory>> {
		const response = await this.apiClient.get<IResponse>({
			url: `/transactions?page=${currentPage}&limit=${rowsPerPage}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch wallet recent transactions.");
		}

		const { data } = response;

		return data as IPaginatedResult<ITransactionsHistory>;
	}

	public async getWalletTransaction({
		transactionId,
		userId,
	}: {
		transactionId: string;
		userId?: string;
	}): Promise<ITransactionsHistory> {
		const response = await this.apiClient.get<IResponse>({
			url: `/transactions/get-transaction?transactionId=${transactionId}${userId ? `&userId=${userId}` : ""}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch transaction.");
		}

		const { data } = response;

		return data as ITransactionsHistory;
	}
}
