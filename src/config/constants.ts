import { TradingPlatform } from "~/apis/handlers/trading-engine/enums";
import { AccountType, Category } from "./enum";

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
	referrals: "/referrals",
	settings: "/settings",
	login: "/login",
	signup: "/signup",
	passwordrecover: "/password/recover",
	passwordreset: "/password/reset",

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
