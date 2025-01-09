import { Category } from "~/config/enum";
import { ConnectionType } from "../trading-engine/enums";
import type { Candlestick, SignalRisk, SignalStatus, TradeStatus } from "./enums";

export interface ISignalAsset {
	id: string;
	name: string;
	symbol: string;
	logo: string;
	marketCap?: number;
}

export interface ISignalMilestone {
	price: number;
	percent: number;
	isReached: boolean;
}

export interface IExchange {
	_id: string;
	name: string;
	logo: string;
}

export interface ISignal {
	id: string;
	asset: ISignalAsset;
	baseCurrency: ISignalAsset;
	targetProfits: ISignalMilestone[];
	stopLoss: ISignalMilestone;
	entryPrice: number;
	currentPrice?: number;
	currentChange?: number;
	tradeNote: string;
	candlestick: Candlestick;
	risk: SignalRisk;
	isSignalTradable: boolean;
	chartUrl: string;
	status: SignalStatus;
	maxGain: number;
	createdAt: string;
	endedAt?: string;
	supportedExchanges: IExchange[];
}

export interface IFetchSignals {
	signals: ISignal[];
	page: number;
	rowsPerPage: number;
	startAfterDoc: string;
	totalPages: number;
	totalRecords: number;
}

export interface ICreateSignalInput {
	targetProfits: ISignalMilestone[];
	stopLoss: ISignalMilestone;
	entryPrice: number;
	tradeNote: string;
	candlestick: Candlestick;
	risk: SignalRisk;
	isSignalTradable: boolean;
	chart: string;
	supportedExchanges: number[];
	asset: number;
	baseCurrency: number;
}

export interface ISignalUpdateInput {
	id: string;
	status: SignalStatus;
}

export interface IFetchTradingPlatform {
	_id: string;
	name: string;
	logo: string;
	isIpAddressWhitelistRequired: boolean;
	connectionTypes: ConnectionType[];
	category: Category;
	slug: string;
	description?: string;
	status: TradeStatus;
	urls: string;
	makerFee: number;
	takerFee: number;
	dateLaunched: Date;
	isSpotTradingSupported: boolean;
	isFuturesTradingSupported: boolean;
	isMarginTradingSupported: boolean;
	isPassphraseRequired?: boolean;
}

export interface IGetExchangesInput {
	page?: number;
	rowsPerPage?: number;
	orderBy?: "asc" | "desc";
	status?: TradeStatus;
}

export interface IGetAssetsInput {
	page: number;
	rowsPerPage: number;
	orderBy: "asc" | "desc";
	sortBy: string;
}

export interface ISupportedExchangeInput {
	coinId: number;
	currencyId: number;
}
