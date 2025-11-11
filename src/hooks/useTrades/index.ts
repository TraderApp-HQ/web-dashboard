import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";
import { OpenTradesActionType } from "~/apis/handlers/trading-engine/enums";
import {
	IGetTradingPlatform,
	IMasterTrade,
	ITradeAggregate,
	IUserTrade,
	IGetTradeAssets,
	IAssetPrice,
	IUseGetAccountConnectionTradingPlatforms,
} from "~/apis/handlers/trading-engine/interfaces";
import { ITableMobile, ITBody, ITHead } from "~/components/common/DataTable/config";
import {
	openTradesDataTableSelector,
	openTradesMobileDataTableSelector,
} from "~/selectors/trade-center";
import { useCreate } from "../useCreate";
import { useFetch } from "../useFetch";

export const useFetchOpenTrades = ({ isAdmin }: { isAdmin: boolean }) => {
	const router = useRouter();
	const tradingEngineService = new TradingEngineService();
	const [tradesTableHead, setTradesTableHead] = useState<ITHead[]>([]);
	const [tradesTableBody, setTradesTableBody] = useState<ITBody>();
	const [mobileTableData, setMobileTableData] = useState<ITableMobile[]>([]);
	const [trades, setTrades] = useState<IMasterTrade[] | IUserTrade[]>();
	const [tradesAggregate, setTradesAggregate] = useState<ITradeAggregate>();

	const fetchOpenTrades = () => tradingEngineService.getOpenTrades({ isAdmin });

	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [TradingEngineQueryId.openTrades],
		queryFn: fetchOpenTrades,
		refetch: true,
		refetchTime: 120000, // Refetches from database every 2 minute
	});

	const handleTradeAction = ({
		tradeId,
		action,
	}: {
		tradeId: string;
		action: OpenTradesActionType;
	}) => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					action,
					id: tradeId,
				},
			},
			undefined,
			{ shallow: true }, // no refetch
		);
	};

	useEffect(() => {
		if (!data) return;

		const { tableHead, tableBody } = openTradesDataTableSelector({
			isAdmin,
			openTrades: data.trades,
			handleTradeAction,
		});
		const mobileData = openTradesMobileDataTableSelector({
			isAdmin,
			openTrades: data.trades,
			handleTradeAction,
		});

		setTrades(data.trades);
		setTradesAggregate(data.tradesAggregate);
		setTradesTableHead(tableHead);
		setTradesTableBody(tableBody);
		setMobileTableData(mobileData);
	}, [data, isSuccess, isLoading]);

	return {
		error,
		isLoading,
		isSuccess,
		isError,
		tradesTableHead,
		tradesTableBody,
		mobileTableData,
		trades,
		tradesAggregate,
	};
};

export const useFetchTrade = ({ tradeId }: { tradeId: string }) => {
	const tradingEngineService = new TradingEngineService();
	const [trade, setTrade] = useState<IMasterTrade>();

	const fetchTrade = useCallback(
		() => tradingEngineService.getTrade(tradeId),
		[tradeId, tradingEngineService],
	);

	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [TradingEngineQueryId.trade],
		queryFn: fetchTrade,
	});

	useEffect(() => {
		if (!isLoading && !isSuccess) return;

		setTrade(data);
	}, [data, isSuccess, isLoading]);

	return {
		error,
		isLoading,
		isSuccess,
		isError,
		trade,
	};
};

export const useCreateTrade = () => {
	const tradingEngineService = new TradingEngineService();
	const queryClient = useQueryClient();
	const {
		mutate: createTrade,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	} = useCreate({
		mutationFn: tradingEngineService.createTrade.bind(tradingEngineService),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TradingEngineQueryId.openTrades] });
		},
	});

	return {
		createTrade,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	};
};

export const useGetTradeAssets = ({
	page,
	rowsPerPage,
	orderBy,
	sortBy,
	category,
}: IGetTradeAssets) => {
	const tradingEngineService = new TradingEngineService();

	// Memoized function to fetch users
	const fetchAssets = useCallback(() => {
		return tradingEngineService.getAllTradeAssets({
			page,
			rowsPerPage,
			orderBy,
			sortBy,
			category,
		});
	}, [page, rowsPerPage, orderBy, sortBy, category]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [rowsPerPage, orderBy, sortBy, category],
		queryFn: fetchAssets,
		enabled: !!category, // Ensures query only runs when category is defined
	});
};

// Custom hook to fetch currencies data
export const useGetTradeSupportedCurrencies = () => {
	const tradingEngineService = new TradingEngineService();

	// Memoized function to fetch users
	const fetchCurrencies = useCallback(() => {
		return tradingEngineService.getAllCurrencies();
	}, []);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [TradingEngineQueryId.currencies],
		queryFn: fetchCurrencies,
	});
};

// Custom hook to fetch Supported Trading Platforms data based on baseAssetId and quoteCurrencyId
export const useGetSupportedTradingPlatforms = ({
	baseAssetId,
	quoteCurrencyId,
}: IGetTradingPlatform) => {
	const tradingEngineService = new TradingEngineService();

	// Memoized function to fetch Supported Trading Platforms
	const fetchSupportedTradingPlatforms = useCallback(() => {
		return tradingEngineService.getSupportedTradingPlatforms({ baseAssetId, quoteCurrencyId });
	}, [baseAssetId, quoteCurrencyId]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [baseAssetId, quoteCurrencyId],
		queryFn: fetchSupportedTradingPlatforms,
		enabled: !!(baseAssetId && quoteCurrencyId),
	});
};

// Custom hook to fetch trade/assets current price
export const useGetTradeCurrentPrice = ({ asset, quote, fetch }: IAssetPrice) => {
	const tradingEngineService = new TradingEngineService();

	// Memoized function to fetch asset price
	const fetchAssetCurrentPrice = useCallback(() => {
		return tradingEngineService.getTradeCurrentPrice({ asset, quote });
	}, [asset, quote]);

	// Using custom useFetch hook to fetch data
	return useFetch({
		queryKey: [`${asset}/${quote}`],
		queryFn: fetchAssetCurrentPrice,
		enabled: fetch, // Ensures query only runs when fetch is true
	});
};

// Custom hook to fetch users data based on search keyword, current page, and rows per page
export const useGetAccountConnectionTradingPlatforms = ({
	page,
	rowsPerPage,
	orderBy,
	status,
	enabled,
}: IUseGetAccountConnectionTradingPlatforms) => {
	const tradingEngineService = new TradingEngineService();

	// Memoized function to fetch users
	const fetchExchanges = useCallback(() => {
		return tradingEngineService.getAllAccountsTradingPlatforms({
			page,
			rowsPerPage,
			orderBy,
			status,
		});
	}, [page, rowsPerPage, orderBy, status]);

	// Using custom useFetch hook to fetch data
	const {
		data: tradingPlatforms,
		isSuccess: isTradingPlatformsSuccess,
		isError: isTradingPlatformsError,
		error: tradingPlatformsError,
		isLoading: isTradingPlatformsLoading,
	} = useFetch({
		queryKey: [rowsPerPage, orderBy, status],
		queryFn: fetchExchanges,
		enabled,
	});

	return {
		tradingPlatforms,
		isTradingPlatformsSuccess,
		isTradingPlatformsError,
		isTradingPlatformsLoading,
		tradingPlatformsError,
	};
};
