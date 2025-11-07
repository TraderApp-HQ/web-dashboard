import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";
import { OpenTradesActionType } from "~/apis/handlers/trading-engine/enums";
import {
	IMasterTrade,
	ITradeAggregate,
	IUserTrade,
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
