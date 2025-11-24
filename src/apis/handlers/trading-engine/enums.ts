export enum AccountConnectionStatus {
	FAILED = "FAILED",
	CONNECTED = "CONNECTED",
	ARCHIVED = "ARCHIVED",
}

export enum ConnectionType {
	MANUAL = "MANUAL",
	FAST = "FAST",
}

export enum TradingPlatform {
	BINANCE = "BINANCE",
	KUCOIN = "KUCOIN",
	BYBIT = "BYBIT",
}

export enum ProfitAndLossStatus {
	PROFIT = "PROFIT",
	LOSS = "LOSS",
	PnL = "PnL",
}

export enum MasterTradeStatus {
	ACTIVE = "ACTIVE",
	CLOSED = "CLOSED",
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	PROCESSED = "PROCESSED",
	FAILED = "FAILED",
	CANCELED = "CANCELED",
}

export enum OpenTradesActionType {
	VIEW_ANALYSIS = "view_analysis",
	SET_TP_N_SL = "set_tp_n_sl",
	CLOSE_TRADE = "close_trade",
	BREAK_EVEN = "break_even",
	TRIGGER_ORDER_PLACEMENT = "trigger_order_placement",
	CANCEL_TRADE = "cancel_trade",
}

export enum OrderPlacementType {
	MARKET = "MARKET",
	LIMIT = "LIMIT",
}

export enum TradingPlatformStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}
