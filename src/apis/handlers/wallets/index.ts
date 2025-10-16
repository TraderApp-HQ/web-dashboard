import { APIClient } from "~/apis/apiClient";
import { IPaginatedResult, IPaginationQuery, IResponse } from "../interfaces";
import { CurrencyCategory, PaymentCategory, PaymentOperation, WalletType } from "./enum";
import {
	ICompleteWithdrawalInput,
	ICompleteWithdrawalResponse,
	IFactoryPaymentProviderDepositResponse,
	IGetWithdrawalFeesInput,
	IInitiateDepositInput,
	IInitiateWithdrawalInput,
	IInitiateWithdrawalResponse,
	IInvoiceListItem,
	IPaymentOptions,
	ITransactionsHistory,
	IUserWalletResponse,
	IWalletSupportedCurrencies,
	IWithdrawalFees,
} from "./interface";
import { createServiceClient } from "../_shared/serviceClient";

export class WalletsService {
	private apiClient: APIClient;

	constructor() {
		const { apiClient } = createServiceClient();
		this.apiClient = apiClient;
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
		const response = await this.apiClient.get<
			IResponse<IPaginatedResult<ITransactionsHistory>>
		>({
			url: `/transactions?page=${currentPage}&limit=${rowsPerPage}`,
		});
		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch wallet recent transactions.");
		}

		const { data } = response;

		return data;
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

	public async initiateWithdrawal(
		withdrawalData: IInitiateWithdrawalInput,
	): Promise<IInitiateWithdrawalResponse> {
		const response = await this.apiClient.post<IResponse<IInitiateWithdrawalResponse>>({
			url: "/wallets/initiate-withdrawal",
			data: withdrawalData,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to initiate withdrawal");
		}

		const { data } = response;
		return data;
	}

	public async completeWithdrawal(
		withdrawalData: ICompleteWithdrawalInput,
	): Promise<ICompleteWithdrawalResponse> {
		const response = await this.apiClient.post<IResponse<ICompleteWithdrawalResponse>>({
			url: "/wallets/complete-withdrawal",
			data: withdrawalData,
		});

		if (response.error) {
			throw new Error(response.message || "Failed to complete withdrawal");
		}

		const { data } = response;
		return data;
	}

	public async sendOtp({
		userId,
		withdrawalRequestId,
	}: {
		userId: string;
		withdrawalRequestId: string;
	}): Promise<IInitiateWithdrawalResponse> {
		const response = await this.apiClient.post<IResponse<IInitiateWithdrawalResponse>>({
			url: "/wallets/resend-withdrawal-otp",
			data: { userId, withdrawalRequestId },
		});

		if (response.error) {
			throw new Error(response.message || "Failed to send OTP");
		}

		const { data } = response;
		return data;
	}

	public async getOutstandingUserInvoices({
		currentPage,
		rowsPerPage,
	}: IPaginationQuery): Promise<IPaginatedResult<IInvoiceListItem>> {
		const response = await this.apiClient.get<IResponse<IPaginatedResult<IInvoiceListItem>>>({
			url: `/invoices?page=${currentPage}&limit=${rowsPerPage}&outstandingOnly=true`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch invoices");
		}
		const { data } = response;
		return data;
	}

	public async getWithdrawalFees({
		amount,
		paymentMethodId,
		providerId,
		network,
	}: IGetWithdrawalFeesInput): Promise<IWithdrawalFees> {
		const response = await this.apiClient.get<IResponse<IWithdrawalFees>>({
			url: `/wallets/withdrawal-fees?amount=${amount}&paymentMethodId=${paymentMethodId}&providerId=${providerId}&network=${network}`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch withdrawal fees");
		}

		return response.data;
	}
}
