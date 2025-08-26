import { useCallback, useEffect, useState } from "react";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";
import { SignalStatus } from "~/apis/handlers/assets/enums";
import { ISignal } from "~/apis/handlers/assets/interfaces";
import type {
	IPaginationData,
	IPerformanceSummaryData,
	ITBody,
	ITHead,
	ITableMobile,
} from "~/components/common/DataTable/config";
import { useFetch } from "~/hooks/useFetch";
import {
	activeSignalsDataTableMobileSelector,
	activeSignalsDataTableSelector,
	pendingSignalsDataTableMobileSelector,
	pendingSignalsDataTableSelector,
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
	signalsPerfomanceSummary,
} from "~/selectors/signals";
import { AssetsService } from "..";
import { PAGINATION } from "../../users/constants";

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
		refetchTime: 120000, // Refetches from database every 2 minute
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

export const useFetchPendingSignals = ({
	handleSetToggleDeleteModal,
	handleResumeSignal,
}: UseFetchActiveSignalsProps) => {
	const signalsService = new AssetsService();
	const [pendingSignals, setPendingSignals] = useState<ISignal[]>([]);
	const [signalsTableHead, setSignalsTableHead] = useState<ITHead[]>([]);
	const [signalsTableBody, setSignalsTableBody] = useState<ITBody>();
	const [signalsMobileTableBody, setSignalsMobileTableBody] = useState<ITableMobile[]>([]);

	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [AssetsQueryId.pending],
		queryFn: () => signalsService.getPendingSignals(),
		refetch: true,
		refetchTime: 120000, // Refetches from database every 2 minute
	});

	useEffect(() => {
		const { tableHead, tableBody } = pendingSignalsDataTableSelector(
			data?.signals ?? [],
			handleSetToggleDeleteModal,
			handleResumeSignal,
		);
		const dataMobile = pendingSignalsDataTableMobileSelector(data?.signals ?? []);

		setSignalsTableHead(tableHead);
		setSignalsTableBody(tableBody);
		setSignalsMobileTableBody(dataMobile);
		setPendingSignals(data?.signals ?? []);
	}, [data, isSuccess, isLoading]);

	return {
		isError,
		error,
		isLoading,
		isSuccess,
		pendingSignals,
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

	//  Paginaion configurations
	const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION.LIMIT);
	const [paginationData, setPaginationData] = useState<IPaginationData>({
		page: PAGINATION.PAGE,
		totalPages: 0,
		totalRecords: 0,
		startAfterDoc: "",
	});

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
		if (!allSignals) return;

		const { tableHead, tableBody } = signalsHistoryDataTableSelector(allSignals?.signals ?? []);
		const dataMobile = signalsHistoryDataTableMobileSelector(allSignals?.signals ?? []);

		setHistory(allSignals?.signals ?? []);
		setSignalsTableHead(tableHead);
		setSignalsTableBody(tableBody);
		setSignalsMobileTableBody(dataMobile);
		setPaginationData((prev) => ({
			...prev,
			page: allSignals?.page ?? 1,
			totalPages: allSignals?.totalPages ?? 1,
			totalRecords: allSignals?.totalRecords ?? 1,
			startAfterDoc: allSignals?.startAfterDoc ?? null,
		}));
		setRowsPerPage(allSignals?.rowsPerPage ?? 10);
	}, [allSignals]);

	// Pagination
	const handleSetCurrentPage = (value: number) => {
		setPaginationData((prev) => ({
			...prev,
			page: value,
		}));
	};

	return {
		isError,
		error,
		isLoading,
		isSuccess,
		signalHistory,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
		paginationData,
		handleSetCurrentPage,
		setRowsPerPage,
		rowsPerPage,
	};
};
