import { useCallback, useEffect, useState } from "react";
import { SignalsService } from "..";
import { useFetch } from "~/hooks/useFetch";
import { SignalsQueryId } from "../constants";
import {
	activeSignalsDataTableMobileSelector,
	activeSignalsDataTableSelector,
} from "~/selectors/signals";
import type { ITBody, ITHead, ITableMobile } from "~/components/common/DataTable/config";
import { ISignal } from "../interfaces";

export const useFetchActiveSignals = () => {
	const signalsService = new SignalsService();
	const [activeSignals, setActiveSignals] = useState<ISignal[]>([]);
	const [signalsTableHead, setSignalsTableHead] = useState<ITHead[]>([]);
	const [signalsTableBody, setSignalsTableBody] = useState<ITBody>();
	const [signalsMobileTableBody, setSignalsMobileTableBody] = useState<ITableMobile[]>([]);

	// const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/signals/stream");
	// const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

	const fetchSignals = useCallback(() => signalsService.getAllSignals(), [signalsService]);
	const {
		data: allSignals,
		error,
		isLoading,
		isSuccess,
		isError,
	} = useFetch({
		queryKey: [SignalsQueryId.signals],
		queryFn: fetchSignals,
	});

	useEffect(() => {
		const { tableHead, tableBody } = activeSignalsDataTableSelector(allSignals?.signals ?? []);
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
