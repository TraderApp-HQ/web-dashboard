export enum ColourTheme {
	SUCCESS = "SUCCESS",
	DANGER = "DANGER",
	WARNING = "WARNING",
	PAUSED = "PAUSED",
	PRIMARY = "PRIMARY",
	SECONDARY = "SECONDARY",
	REVIEW = "REVIEW",
	TERTIARY = "TERTIARY",
	TERTIARY2 = "TERTIARY2",
	INVOICE_PROFIT = "INVOICE_PROFIT",
	INVOICE_BILLED = "INVOICE_BILLED",
}

export enum OperationStatus {
	ACTIVE = "ACTIVE",
	PAUSED = "PAUSED",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED",
}

export enum ScreenDisplay {
	DESKTOP = "DESKTOP",
	MOBILE = "MOBILE",
}

export enum HTMLElements {
	div = "div",
	span = "span",
	paragraph = "p",
	header1 = "h1",
	image = "img",
}

export enum UserStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}

export enum UserTradingStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}

export enum Category {
	FOREX = "FOREX",
	CRYPTO = "CRYPTO",
}

export enum AccountType {
	SPOT = "SPOT",
	FUTURES = "FUTURES",
}

export enum Currency {
	USDT = "USDT",
	BTC = "BTC",
}

export enum TradeType {
	SPOT = "SPOT",
	FUTURES = "FUTURES",
}

export enum TradeSide {
	SHORT = "SHORT",
	LONG = "LONG",
}

export enum TradeSignalModalScreen {
	TRADE_ASSET = "Trade Asset",
	TRADE_TYPE = "Trade Type",
	TRADE_PRICE = "Trade Price",
	TRADE_CHART = "Trade Chart",
}

export enum TransactionStatus {
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	PENDING = "PENDING",
}

export enum TransactionType {
	DEPOSIT = "DEPOSIT",
	WITHDRAWAL = "WITHDRAWAL",
	TRANSFER = "TRANSFER",
	CONVERT = "CONVERT",
}

export enum InvoiceStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	FAILED = "FAILED",
}

export enum InvoiceType {
	TRADING_FEE = "TRADING_FEE",
	PROFIT_SHARE = "PROFIT_SHARE",
}
