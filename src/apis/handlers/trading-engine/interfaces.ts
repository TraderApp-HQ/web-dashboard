import { Category } from "~/config/enum";
import type { AccountConnectionStatus, ConnectionType } from "./enums";

export interface IConnectManualInput {
	userId: string;
	platformName: string;
	platformId: number;
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
