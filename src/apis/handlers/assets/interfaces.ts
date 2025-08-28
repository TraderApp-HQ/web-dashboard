import { Category, TradeSide, TradeType } from "~/config/enum";
import { ConnectionType } from "../trading-engine/enums";
import type { Candlestick, SignalRisk, SignalStatus, TradeStatus, TradingPlatform } from "./enums";

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

export interface ITradingPlatform {
	_id: string;
	name: string;
	logo: string;
}

export interface ISignal {
	id: string;
	baseAsset: ISignalAsset;
	baseAssetName: string;
	quoteCurrency: ISignalAsset;
	quoteCurrencyName: string;
	targetProfits: ISignalMilestone[];
	stopLoss: ISignalMilestone;
	entryPrice: number;
	currentPrice?: number;
	currentChange?: number;
	tradeNote: string;
	candlestick: Candlestick;
	risk: SignalRisk;
	isSignalTradable: boolean;
	isSignalTriggered: boolean;
	chartUrl: string;
	status: SignalStatus;
	maxGain: number;
	createdAt: string;
	endedAt?: string;
	supportedTradingPlatforms: ITradingPlatform[];
	leverage: number;
	tradeSide: string;
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
	entryPriceLowerBound: number;
	entryPriceUpperBound: number;
	tradeNote: string;
	candlestick: Candlestick;
	risk: SignalRisk;
	isSignalTradable: boolean;
	chart: string;
	supportedTradingPlatforms: number[];
	baseAsset: number;
	baseAssetName: string;
	quoteCurrency: number;
	quoteCurrencyName: string;
	category: Category;
	tradeSide?: TradeSide;
	tradeType?: TradeType;
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
	category: Category[];
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

export interface IGetTradingPlatformsInput {
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
	category: Category;
}

export interface ISupportedTradingPlatformsInput {
	baseAssetId: number;
	quoteCurrencyId: number;
}

interface IActiveSignalsData {
	signalId: string;
	stopLoss: ISignalMilestone;
	targetProfits: ISignalMilestone[];
	entryPrice: number;
	isSignalTradable: boolean;
	baseAssetName: string;
	quoteCurrencyName: string;
	assetPair: string;
	tradingPlatforms: TradingPlatform[];
}

interface ISignalPriceData {
	asset: IActiveSignalsData;
	assetPrice: number;
	priceWs: WebSocket;
}

export interface ISignalPrice {
	signalId: string;
	tradingPlatform: TradingPlatform;
	signalData: ISignalPriceData;
}
