import { AccountType, Category, Currency } from "~/config/enum";
import type { AccountConnectionStatus, ConnectionType, TradingPlatform } from "./enums";

export interface IConnectManualInput {
	userId: string;
	platformName: string;
	apiKey?: string;
	apiSecret?: string;
	passphrase?: string;
	category: Category;
	connectionType: ConnectionType;
	isRefreshMode?: boolean;
}

export interface IUserTradingAccount {
	id: string;
	userId: string;
	platformId: number;
	platformName: string;
	platformLogo: string;
	apiKey: string;
	apiSecret: string;
	externalAccountUserId: string;
	isWithdrawalEnabled: boolean;
	isFuturesTradingEnabled: boolean;
	isSpotTradingEnabled: boolean;
	isIpWhitelistingEnabled?: boolean;
	connectionStatus: AccountConnectionStatus;
	errorMessages: string[];
	category: Category;
	connectionType: ConnectionType;
}

export interface IAccountBalance {
	currency: Currency;
	availableBalance: number;
	lockedBalance: number;
	accountType: AccountType;
}

export interface IUserAccountWithBalance {
	id: string;
	platformName: string;
	platformId: number;
	plaformLogo: string;
	errorMessages: string[];
	connectionStatus: AccountConnectionStatus;
	balances: IAccountBalance[];
	category: Category;
	refetchAccounts: () => void;
}

export interface ITradingAccountBalances {
	currency: Currency;
	accountType: AccountType;
	availableBalance: number;
	lockedBalance?: number;
}

export interface ITradingAccountInfo {
	accountId: string;
	userId: string; // Reference to the user who owns these credentials
	platformName: TradingPlatform;
	platformId: number; // e.g., 112
	platformLogo: string;
	apiKey?: string;
	apiSecret?: string;
	passphrase?: string;
	accessToken?: string;
	refreshToken?: string;
	externalAccountUserId: string; // Unique identifier returned by trading plaforms like Binance
	isWithdrawalEnabled: boolean;
	isFuturesTradingEnabled: boolean;
	isSpotTradingEnabled: boolean;
	isIpAddressWhitelisted?: boolean;
	connectionStatus: AccountConnectionStatus;
	errorMessages: string[]; // List of reasons/messages for the unhealthy status
	category: Category;
	connectionType: ConnectionType;
	balances: ITradingAccountBalances[];
}

export interface IDeleteAccountInput {
	userId: string;
	platformName: TradingPlatform;
}

export interface IGetTradingAccountInput {
	userId: string;
	platformName: TradingPlatform;
}

export interface ITradingAccountDropdownMenu {
	userId: string;
	platformName: TradingPlatform;
	refetchUserTradingAccounts: () => void;
}

export interface IUpdateAccountInput {
	id: string;
	accountData: IConnectManualInput;
}

export interface IAddFund {
	userId: string;
	platformName: TradingPlatform;
	accountType: AccountType;
	currency: Currency;
	amount: number;
}
