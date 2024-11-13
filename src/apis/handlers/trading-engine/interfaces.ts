import { AccountType, Category, Currency } from "~/config/enum";
import type { AccountConnectionStatus, ConnectionType } from "./enums";

export interface IConnectManualInput {
	userId: string;
	platformName: string;
	platformId: number;
	plaformLogo: string;
	apiKey: string;
	apiSecret: string;
	category: Category;
	connectionType: ConnectionType;
}

export interface IUserTradingAccount {
	id: string;
	userId: string;
	platformId: number;
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

export interface IDeleteAccountInput {
	id: string;
}

export interface IExchangeDropdownMenu {
	selectedAccountId: string;
	refetchAccounts: () => void;
}
