export enum Candlestick {
	oneHour = "1HR",
	twoHours = "2HRS",
	fourHours = "4HRS",
	eightHours = "8HRS",
	twelveHours = "12HRS",
	oneDay = "1D",
	threeDays = "3D",
	oneWeek = "1W",
}

export enum SignalRisk {
	low = "LOW",
	medium = "MEDIUM",
	high = "HIGH",
}

export enum SignalStatus {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	PAUSED = "PAUSED",
	INACTIVE = "INACTIVE",
}

export enum TradeStatus {
	active = "ACTIVE",
	inactive = "INACTIVE",
}

export enum Exchange {
	binance = "binance",
	kucoin = "kucoin",
}
