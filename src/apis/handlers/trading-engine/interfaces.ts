import { AccountType, Category, Currency, TradeSide } from "~/config/enum";
import type {
	AccountConnectionStatus,
	ConnectionType,
	MasterTradeStatus,
	OrderPlacementType,
	TradingPlatform,
	TradingPlatformStatus,
} from "./enums";
import { Candlestick, SignalRisk } from "../assets/enums";

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

export interface ICreateTrade {
	signalId?: string;
	baseAsset: string;
	baseAssetLogoUrl: string;
	baseQuantity: number;
	currentPrice: number;
	entryPrice: number;
	stopLossPrice: number;
	takeProfitPrice: number;
	ordersTriggerPrice: number;
	targetOrdersAmountToFill: number;
	chartUrl?: string;
	tradeNote?: string;
	quoteCurrency: string;
	quoteTotal: number;
	pair: string;
	side: TradeSide;
	estimatedProfit: number;
	estimatedLoss: number;
	status: MasterTradeStatus;
	orderPlacementType?: OrderPlacementType;
	accountType?: AccountType;
	supportedTradingPlatforms: TradingPlatform[];
	candlestick: Candlestick;
	risk: SignalRisk;
	category: Category;
}
export interface IMasterTrade {
	id: string;
	signalId?: string;
	baseAsset: string;
	baseAssetLogoUrl: string;
	quoteCurrency: string;
	baseQuantity: number;
	quoteTotal: number;
	currentPrice: number;
	entryPrice: number;
	stopLossPrice: number;
	takeProfitPrice: number;
	ordersTriggerPrice: number;
	targetOrdersAmountToFill: number;
	chartUrl?: string;
	tradeNote?: string;
	pair: string;
	side: TradeSide;
	pnl: number;
	pnlPercentage: number;
	status: MasterTradeStatus;
	orderPlacementType?: OrderPlacementType;
	accountType?: AccountType;
	supportedTradingPlatforms: TradingPlatform[];
	estimatedProfit: number;
	estimatedLoss: number;
	createdAt: Date;
	updatedAt: Date;
	candlestick: Candlestick;
	risk: SignalRisk;
	category: Category;
}

export interface IUserTrade {
	id: string;
	userId: string;
	masterTradeId: string;
	baseAsset: string;
	quoteCurrency: string;
	baseQuantity: number;
	quoteTotal: number;
	entryPrice: number;
	stopLossPrice: number;
	takeProfitPrice: number;
	pair: string;
	side: TradeSide;
	pnl: number;
	pnlPercentage: number;
	estimatedProfit: number;
	estimatedLoss: number;
	status: MasterTradeStatus;
	createdAt: Date;
	updatedAt: Date;
	baseAssetLogoUrl: string;
	currentPrice: number;
}

export interface IGetTradeAssets {
	page: number;
	rowsPerPage: number;
	orderBy: "asc" | "desc";
	sortBy: string;
	category: Category;
}

export interface ITradeAsset {
	id: string;
	name: string;
	symbol: string;
	logo: string;
	marketCap?: number;
}

export interface IGetTradingPlatform {
	baseAssetId: number;
	quoteCurrencyId: number;
}

export interface ISupportedTradingPlatform {
	_id: string;
	name: string;
	logo: string;
}

export interface IAssetPrice {
	asset: string;
	quote: string;
	fetch: boolean;
}

export interface IUseGetAccountConnectionTradingPlatforms {
	page?: number;
	rowsPerPage?: number;
	orderBy?: "asc" | "desc";
	status?: TradingPlatformStatus;
	enabled?: boolean;
}

export interface IGetAccountConnectionTradingPlatformsInput {
	page?: number;
	rowsPerPage?: number;
	orderBy?: "asc" | "desc";
	status?: TradingPlatformStatus;
}

export interface IFetchAccountConnectionTradingPlatform {
	_id: string;
	name: string;
	logo: string;
	isIpAddressWhitelistRequired: boolean;
	connectionTypes: ConnectionType[];
	category: Category[];
	slug: string;
	description?: string;
	status: TradingPlatformStatus;
	urls: string;
	makerFee: number;
	takerFee: number;
	dateLaunched: Date;
	isSpotTradingSupported: boolean;
	isFuturesTradingSupported: boolean;
	isMarginTradingSupported: boolean;
	isPassphraseRequired?: boolean;
}
export interface ITradeAggregate {
	accummulatedTotalBalance: number;
	accummulatedTotalRisk: number;
	accummulatedUnrealisedPnL: number;
	accummulatedUnrealisedPnLPercentage: number;
}

export interface IMasterTradeTpAndSlOptions {
	masterTradeId: string;
	stopLossPrice: number;
	takeProfitPrice?: number;
}
