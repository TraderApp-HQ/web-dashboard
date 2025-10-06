import { TradingPlatform } from "~/apis/handlers/trading-engine/enums";
import { AccountType, Category, InvoiceType } from "./enum";

export const LAYOUT_ROUTES = {
	account: "/account",
	auth: "/auth",
	admin: "/admin",
};

export const ROUTES = {
	dashboard: {
		homepage: "/dashboard",
		backButton: "/account/dashboard",
	},
	signals: "/signals",
	tradeCenter: {
		homepage: "/trade-center",
		openTrade: "../open-trades",
		tradeHistory: "../trade-history",
		tradingRules: "../trading-rules",
		backButton: "/account/trade-center",
		connect: "/account/trade-center/trading-accounts/connect",
		manageTrade: "manage",
		exchanges: "exchanges",
	},
	wallet: {
		homepage: "/wallets",
		wallets: "../main",
		spot: "../spot",
		futures: "../futures",
		backButton: "/account/wallet/wallets",
		deposit: "/account/wallets/deposit",
		convert: "/account/wallets/convert",
		withdraw: "/account/wallets/withdraw",
		transfer: "/account/wallets/transfer",
		transactionDetails: "transaction-details",
	},
	rewardHub: "/reward-hub",
	settings: "/settings",
	login: "/login",
	signup: "/signup",
	passwordrecover: "/password/recover",
	passwordreset: "/password/reset",
	otp: "/otp",

	//admin routes
	usermanagement: {
		homepage: "/user-management",
		edit: `/edit`,
		details: "/details",
		create: "create-user",
	},

	financemodel: "/finance-model",
	signalmanagement: "/signal-management",
	systemmanagement: "/system-management",
	aggregateview: "/aggregate-view",
	taskcenter: {
		home: "/task-center",
		create: "/create-task",
		view: "/view",
		edit: "/edit",
		updateData: "/update-data",
	},
};

export const ENDPOINTS = {
	assets: "http://localhost:8080",
};
export const ItemType: Record<string, string> = Object.freeze({
	text: "text",
	link: "link",
});

export const EmailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export const TradingPlatformCategoryValues: Record<Category, string> = {
	[Category.CRYPTO]: "Crypto",
	[Category.FOREX]: "Forex",
};

export const AccountTypeValues: Record<AccountType, string> = {
	[AccountType.FUTURES]: "Futures",
	[AccountType.SPOT]: "Spot",
};

export const TradingPlatformValues: Record<TradingPlatform, string> = {
	[TradingPlatform.BINANCE]: "Binance",
	[TradingPlatform.KUCOIN]: "Kucoin",
};

export const ReferralRank = {
	TA_RECRUIT: "TA-Recruit",
	TA_LIEUTENANT: "TA-Lieutenant",
	TA_CAPTAIN: "TA-Captain",
	TA_MAJOR: "TA-Major",
	TA_COLONEL: "TA-Colonel",
	TA_GENERAL: "TA-General",
	TA_FIELD_MARSHAL: "TA-Field-Marshal",
} as const;

export const RANK_REQUIREMENTS = {
	[ReferralRank.TA_RECRUIT]: {
		text: "Start your journey by investing your first trading capital.",
	},
	[ReferralRank.TA_LIEUTENANT]: {
		text: "Build momentum by growing your community size to progress further.",
	},
	[ReferralRank.TA_CAPTAIN]: {
		text: "Reach a new leadership level by expanding your network and capital.",
	},
	[ReferralRank.TA_MAJOR]: {
		text: "Achieve significant growth and unlock advanced benefits.",
	},
	[ReferralRank.TA_COLONEL]: {
		text: "Command a strong community with high engagement and trading capital.",
	},
	[ReferralRank.TA_GENERAL]: {
		text: "Join the elite ranks with an expansive network and high capital influence.",
	},
	[ReferralRank.TA_FIELD_MARSHAL]: {
		text: "Reach the pinnacle of leadership and community growth, leading a vast trading empire.",
	},
} as const;

export const InvoiceTypeValues: Record<InvoiceType, string> = {
	[InvoiceType.PROFIT_SHARE]: "Profit Share",
	[InvoiceType.TRADING_FEE]: "Trading Fee",
};
