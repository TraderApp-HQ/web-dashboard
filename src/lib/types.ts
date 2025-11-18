import { ReactNode } from "react";

export interface Signal {
	id: string;
	asset: string;
	currentPrice: number;
	change: number;
	targetProfits: TartgetProfit[];
	created: string;
	status: string;
	logoUrl: string;
	currentTicker: string;
	stopLostPrice: string;
	timeframe: string;
	time: string;
	marketCap: string;
	maxGainSinceCall: string;
	risk: string;
	entryPrice: string;
	signalImage: string;
	shortName: string;
}
export type TartgetProfit = {
	price: number;
	percent: number;
	isReached: boolean;
};

export interface SignalPerformance {
	name: string;
	image: string;
	percentage: string;
}

interface SignalsData {
	signals: {
		signals: Signal[];
		bestSignal: SignalPerformance;
		worstSignal: SignalPerformance;
		totalActiveSignal: number;
		totalCapital: number;
		percentage: string;
	};
}

export interface SignalHistoryItem {
	id: string;
	asset: string;
	shortName: string;
	image: string;
	winLoss: string;
	startDate: string;
	endDate: string;
}

interface AssetItem {
	id: string;
	name: string;
	image?: string;
	shortName?: string;
}

export interface PortfolioStats {
	bestSignal: SignalPerformance;
	worseSignal: SignalPerformance;
	totalActiveSignal: number;
	totalCapital: number;
}

export interface OpenTrade {
	asset: AssetItem;
	pair: string;
	price: string;
	profitLoss?: string;
	percent?: string;
	holdings?: string;
	holdingComp?: string;
	date?: string;
	avgBuy?: string;
	id: string;
	entryPrice?: string;
	positionAmount?: string;
	estimatedAmount?: string;
}

export interface TradeOrOrder {
	type: string;
	price: string;
	units: string;
	total: string;
	date: string;
	fees: string;
}

export interface TradeHistoryData extends TradeOrOrder {}

export interface Orders extends TradeOrOrder {}

interface AssetLogo {
	name: string;
	symbol: string;
	logoUrl: string;
}

export interface ITransaction {
	id: string;
	_id?: string;
	transactionNetwork?: string;
	userId: string;
	fromWallet?: string;
	toWallet?: string;
	currencyName?: string;
	fromCurrencyName?: string;
	toCurrencyName?: string;
	conversionRate?: number;
	amount: number;
	fromAmount?: number;
	toAmount?: number;
	transactionType: string;
	fromWalletAddress?: string;
	toWalletAddress?: string;
	status: string;
	transactionSource?: string;
	paymentCategoryName?: string;
	paymentMethodName?: string;
	paymentProviderName?: string;
	createdAt: string;
	assetLogo?: AssetLogo;
	transactionHash?: string;
	providerFee?: number;
	processingFee?: number;
	networkFee?: number;
}

export interface Wallet {
	id: string;
	name?: string;
}
export interface IModalOptions {
	openModal: boolean;
	onClose: () => void;
}

export interface ICurrency {
	id: string;
	currency: string;
	balance: string;
	shortName: string;
	logoUrl: string;
}

export interface IDisplayItem {
	itemText: { text: string; style?: string };
	itemSubText?: { text: string; style?: string };
	itemImage?: string;
	styles?: string;
	isAssetItem?: boolean;
	useAvatar?: boolean;
	avatarInitials?: string;
	assetTradeSide?: JSX.Element | ReactNode;
	assetleverage?: JSX.Element | ReactNode;
}
export type Asset = AssetItem | null;

export type SignalHistoryData = SignalHistoryItem[];

export default SignalsData;

export interface UserData {
	id: string;
	username: string;
	role: string;
}

export interface User {
	user: UserData;
}
export interface IconProps {
	className?: string;
}
