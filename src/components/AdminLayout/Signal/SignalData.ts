import { Candlestick, SignalRisk, SignalStatus } from "~/apis/handlers/assets/enums";

export const signalData = [
	{
		id: "66bb7135e59f0544faca48fa",
		targetProfits: [
			{
				price: 200,
				percent: 1,
				isReached: false,
			},
			{
				price: 300,
				percent: 2,
				isReached: false,
			},
		],
		stopLoss: {
			price: 1000,
			percent: 1,
			isReached: false,
		},
		entryPrice: 8000,
		tradeNote: "first signal",
		candlestick: Candlestick.oneHour,
		risk: SignalRisk.low,
		isSignalTradable: true,
		chartUrl:
			"https://aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com/charts/f9b98a21-d47a-45e2-9c19-6c9ab48c1c0a.png",
		status: SignalStatus.INACTIVE,
		createdAt: "2024-08-13T14:44:05.376Z",
		endedAt: "2024-08-13T14:44:05.376Z",
		maxGain: 0,
		baseAsset: {
			id: "52",
			name: "XRP",
			symbol: "XRP",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		quoteCurrency: {
			id: "52",
			name: "XRP",
			symbol: "XRP",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		supportedTradingPlatform: [
			{
				_id: "270",
				name: "Binance",
				logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png",
			},
		],
	},
	{
		id: "66bb7135e59f0544faca48fb",
		targetProfits: [
			{
				price: 400,
				percent: 1,
				isReached: false,
			},
			{
				price: 500,
				percent: 2,
				isReached: false,
			},
		],
		stopLoss: {
			price: 5000,
			percent: 1,
			isReached: false,
		},
		entryPrice: 8000,
		tradeNote: "second signal",
		candlestick: Candlestick.oneHour,
		risk: SignalRisk.low,
		isSignalTradable: true,
		chartUrl:
			"https://aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com/charts/f9b98a21-d47a-45e2-9c19-6c9ab48c1c0a.png",
		status: SignalStatus.INACTIVE,
		createdAt: "2024-08-13T14:44:05.376Z",
		endedAt: "2024-08-13T14:44:05.376Z",
		maxGain: 0,
		baseAsset: {
			id: "52",
			name: "BTC",
			symbol: "BTC",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		quoteCurrency: {
			id: "52",
			name: "BTC",
			symbol: "BTC",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		supportedTradingPlatform: [
			{
				_id: "270",
				name: "Binance",
				logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png",
			},
		],
	},
];
