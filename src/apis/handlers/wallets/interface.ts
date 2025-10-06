import { JSXElementConstructor } from "react";
import { WalletType } from "./enum";
import { IconProps } from "~/components/AccountLayout/IconButton";
import { TransactionStatus, TransactionType } from "~/config/enum";

export interface ITotalBalanceItems {
	label: string;
	url: string;
	Icon: JSXElementConstructor<IconProps>;
}

export interface IUserWalletResponse {
	wallets: IUserWallet[];
	exchangeRates: IExchangeRate[];
	exchangeRateTotalBalances: IWalletConvertedBalance[];
}

export interface IUserWallet {
	id: string;
	userId: string;
	walletType: string;
	walletTypeName: WalletType;
	currencyName: string;
	currencySymbol: string;
	currency: Omit<IWalletSupportedCurrencies, "id"> & {
		_id: string;
	};
	availableBalance: number;
	lockedBalance: number;
}

interface IExchangeRate {
	pair: string; // e.g., "BTC/USD", "BTC/EUR", "USDT/USD", USDT/EUR
	rate: number; // e.g., 45000.00
}

export interface IWalletConvertedBalance {
	balance: number;
	currency: string;
}

export interface IWalletSupportedCurrencies {
	id: string;
	name: string;
	symbol: string;
	logoUrl: string;
}

export interface IPaymentOptions {
	paymentMethodId: string;
	paymentMethodName: string;
	logoUrl: string;
	symbol: string;
	categoryId: string;
	categoryName: string;
	providerId: string;
	providerName: string;
	isDepositSupported: boolean;
	isWithdrawalSupported: boolean;
	isDefault: boolean;
	supportNetworks?: ISupportedNetworks[];
}

export interface ISupportedNetworks {
	slug: string;
	name: string;
	precision: number;
}

export interface IInitiateDepositInput {
	userId: string;
	currencyId: string;
	paymentMethodId: string;
	providerId: string;
	network: string;
	amount?: number;
}

export interface IInitiateWithdrawalInput {
	userId: string;
	currencyId: string;
	paymentMethodId: string;
	providerId: string;
	network: string;
	amount: number;
	amountToReceive: number;
	destinationAddress: string;
}

export interface ICompleteWithdrawalInput {
	userId: string;
	otp: string;
	withdrawalRequestId: string;
}

export interface IFactoryPaymentProviderDepositResponse {
	id: string;
	currency: string;
	amount?: number;
	walletAddress?: string;
	network?: string;
	paymentUrl?: string;
	paymentUri?: string; // e.g. bitcoin:tb1qf54gqt8sk7rmawqg7j9xvvwjrc35js5pska40d?amount=0.001159
	shouldRedirect?: boolean;
	customWalletId?: string;
	externalWalletId?: string;
	description?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata?: any;
	successRedirectUrl?: string;
	failureRedirectUrl?: string;
	createdAt?: string;
	expiresAt?: string;
	payCurrency?: string; // the currency in which the payment will be made
	payAmount?: number; // the amount that will be paid using the payCurrency
	fee?: number;
	feeCurrency?: string; // the currency in which the fee will be paid
	exchangePair?: string;
	exchangeRate?: number;
	exchangeFee?: number;
	exchangeFeeCurrency?: string;
}

interface IAsset {
	name: string;
	symbol: string;
	logoUrl: string;
}

export interface ITransactionsHistory {
	id: string;
	userId: string;
	assetLogo: IAsset;
	transactionType: TransactionType;
	amount: number;
	currency: string;
	status: TransactionStatus;
	createdAt: string;
}

export interface IInitiateWithdrawalResponse {
	withdrawalRequestId: string;
	expiresInSec: string;
}

export interface ICompleteWithdrawalResponse {
	transactionId: string;
	status: TransactionStatus;
	externalTransactionId: string;
}
