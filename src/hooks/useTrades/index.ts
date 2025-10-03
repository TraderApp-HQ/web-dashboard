import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { TradingEngineQueryId } from "~/apis/handlers/trading-engine/constants";
import { OpenTradesActionType } from "~/apis/handlers/trading-engine/enums";
import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import { ITableMobile, ITBody, ITHead } from "~/components/common/DataTable/config";
import {
	openTradesDataTableSelector,
	openTradesMobileDataTableSelector,
} from "~/selectors/trade-center";
import { useFetch } from "../useFetch";

export const useFetchOpenTrades = ({ isAdmin }: { isAdmin: boolean }) => {
	const router = useRouter();
	const tradingEngineService = new TradingEngineService();
	const [tradesTableHead, setTradesTableHead] = useState<ITHead[]>([]);
	const [tradesTableBody, setTradesTableBody] = useState<ITBody>();
	const [mobileTableData, setMobileTableData] = useState<ITableMobile[]>([]);
	const [trades, setTrades] = useState<IMasterTrade[]>();

	const fetchOpenTrades = () => tradingEngineService.getOpenTrades();

	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [TradingEngineQueryId.openTrades],
		queryFn: fetchOpenTrades,
		// refetch: true,
		// refetchTime: 120000, // Refetches from database every 2 minute
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
			openTrades: data,
			handleTradeAction,
		});
		const mobileData = openTradesMobileDataTableSelector({
			isAdmin,
			openTrades: data,
			handleTradeAction,
		});

		setTrades(data);
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
	};
};
