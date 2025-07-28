import { useCallback, useEffect, useState } from "react";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";
import { SignalStatus } from "~/apis/handlers/assets/enums";
import { ISignal } from "~/apis/handlers/assets/interfaces";
import type {
	IPerformanceSummaryData,
	ITBody,
	ITHead,
	ITableMobile,
} from "~/components/common/DataTable/config";
import { useFetch } from "~/hooks/useFetch";
import {
	activeSignalsDataTableMobileSelector,
	activeSignalsDataTableSelector,
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
	signalsPerfomanceSummary,
} from "~/selectors/signals";
import { AssetsService } from "..";

interface UseFetchActiveSignalsProps {
	handleSetToggleDeleteModal?: (id: string) => void;
	handleResumeSignal?: (id: string, currentStatus: SignalStatus) => void;
	isAdmin?: boolean;
}

export const useFetchActiveSignals = ({
	isAdmin = false,
	handleSetToggleDeleteModal,
	handleResumeSignal,
}: UseFetchActiveSignalsProps) => {
	const signalsService = new AssetsService();
	const [activeSignals, setActiveSignals] = useState<ISignal[]>([]);
	const [signalsTableHead, setSignalsTableHead] = useState<ITHead[]>([]);
	const [signalsTableBody, setSignalsTableBody] = useState<ITBody>();
	const [signalsMobileTableBody, setSignalsMobileTableBody] = useState<ITableMobile[]>([]);
	const [performanceSummary, setPerformanceSummary] = useState<IPerformanceSummaryData>();

	// const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/signals/stream");
	// const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

	// const fetchSignals = useCallback(() => signalsService.getActiveSignals(), [signalsService]);
	const fetchSignals = () => signalsService.getActiveSignals();
	const {
		data: allSignals,
		error,
		isLoading,
		isSuccess,
		isError,
	} = useFetch({
		queryKey: [AssetsQueryId.signals],
		queryFn: fetchSignals,
		refetch: true,
		refetchTime: 60000, // Refetches from database every 1 minute
	});

	useEffect(() => {
		const { tableHead, tableBody } = activeSignalsDataTableSelector(
			allSignals?.signals ?? [],
			isAdmin,
			handleSetToggleDeleteModal,
			handleResumeSignal,
		);
		const dataMobile = activeSignalsDataTableMobileSelector(allSignals?.signals ?? []);

		// Signals performance summary
		const performanceSummary = signalsPerfomanceSummary(allSignals?.signals ?? []);

		setSignalsTableHead(tableHead);
		setSignalsTableBody(tableBody);
		setSignalsMobileTableBody(dataMobile);
		setActiveSignals(allSignals?.signals ?? []);
		setPerformanceSummary(performanceSummary);
	}, [allSignals, isSuccess, isLoading]);

	// const { userId } = useUserProfileData();
	// const { data } = useCustomWebSocket(
	// 	`ws://localhost:8082/stream/assets-update-ws?userId=${userId}`,
	// );
	// useEffect(() => {
	// 	if (data) {
	// 		try {
	// 			const priceData = JSON.parse(data.toString()); // Parse the JSON string to an array of objects

	// 			const updatedActiveSignals = activeSignals.map((signal) => {
	// 				const updatedSignal = priceData.find(
	// 					(data: ISignalPrice) =>
	// 						signal.id === data.signalId &&
	// 						signal.supportedExchanges.find(
	// 							(exchange) => exchange.name.toLowerCase() === data.exchange,
	// 						),
	// 				);
	// 				if (updatedSignal) {
	// 					return {
	// 						...signal,
	// 						currentPrice: updatedSignal.signalData.assetPrice,
	// 					};
	// 				}

	// 				return signal;
	// 			});

	// 			// Update your state with the new data
	// 			setActiveSignals(updatedActiveSignals);
	// 		} catch (error) {
	// 			console.error("Error parsing the data:", error);
	// 		}
	// 	}
	// }, [data]);

	return {
		isError,
		error,
		isLoading,
		isSuccess,
		activeSignals,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
		performanceSummary,
	};
};

export const useSignalHistory = () => {
	const signalsService = new AssetsService();
	const [signalHistory, setHistory] = useState<ISignal[]>([]);
	const [signalsTableHead, setSignalsTableHead] = useState<ITHead[]>([]);
	const [signalsTableBody, setSignalsTableBody] = useState<ITBody>();
	const [signalsMobileTableBody, setSignalsMobileTableBody] = useState<ITableMobile[]>([]);

	const fetchSignals = useCallback(() => signalsService.getSignalsHistory(), [signalsService]);
	const {
		data: allSignals,
		error,
		isLoading,
		isSuccess,
		isError,
	} = useFetch({
		queryKey: [AssetsQueryId.history],
		queryFn: fetchSignals,
	});

	useEffect(() => {
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(allSignals?.signals ?? []);
		const dataMobile = signalsHistoryDataTableMobileSelector(allSignals?.signals ?? []);

		setHistory(allSignals?.signals ?? []);
		setSignalsTableHead(tableHead);
		setSignalsTableBody(tableBody);
		setSignalsMobileTableBody(dataMobile);
	}, [isLoading, isSuccess, allSignals]);

	// const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket("ws://localhost:8080/stream/signals", {
	//   onOpen: () => console.log("WebSocket opened"),
	//   onClose: () => console.log("WebSocket closed"),
	//   onError: (error) => console.log("WebSocket error", error),
	//   onMessage: (message) => console.log("WebSocket message", message),
	//   shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events
	// });
	// useEffect(() => {
	//   if (lastMessage !== null) {
	//     setMessageHistory((prev) => prev.concat(lastMessage));
	//   }
	// }, [lastMessage]);

	return {
		isError,
		error,
		isLoading,
		isSuccess,
		signalHistory,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
	};
};
