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
