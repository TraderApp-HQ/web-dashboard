import { useCallback, useEffect, useState } from "react";
import { AssetsService } from "..";
import { useFetch } from "~/hooks/useFetch";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";
import {
	activeSignalsDataTableMobileSelector,
	activeSignalsDataTableSelector,
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
} from "~/selectors/signals";
import type { ITBody, ITHead, ITableMobile } from "~/components/common/DataTable/config";
import { ISignal } from "~/apis/handlers/assets/interfaces";
import { SignalStatus } from "~/apis/handlers/assets/enums";

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

	// const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/signals/stream");
	// const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

	const fetchSignals = useCallback(() => signalsService.getActiveSignals(), [signalsService]);
	const {
		data: allSignals,
		error,
		isLoading,
		isSuccess,
		isError,
	} = useFetch({
		queryKey: [AssetsQueryId.signals],
		queryFn: fetchSignals,
	});

	useEffect(() => {
		const { tableHead, tableBody } = activeSignalsDataTableSelector(
			allSignals?.signals ?? [],
			isAdmin,
			handleSetToggleDeleteModal,
			handleResumeSignal,
		);
		const dataMobile = activeSignalsDataTableMobileSelector(allSignals?.signals ?? []);

		setActiveSignals(allSignals?.signals ?? []);
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
		activeSignals,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
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
