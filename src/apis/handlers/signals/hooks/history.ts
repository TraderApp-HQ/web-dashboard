import { useCallback, useEffect, useState } from "react";
import { SignalsService } from "..";
import { useFetch } from "~/hooks/useFetch";
import { SignalsQueryId } from "../constants";
import {
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
} from "~/selectors/signals";
import type { ITBody, ITHead, ITableMobile } from "~/components/common/DataTable/config";
import { ISignal } from "../interfaces";
import { SignalStatus } from "../enums";
interface IUseFetchSignalsHistoryProps {
	handleSetToggleDeleteModal?: (id: string) => void;
	handleResumeSignal?: (id: string, currentStatus: SignalStatus) => void;
	isAdmin?: boolean;
}

export const useFetchSignalHistory = ({
	// isAdmin = false,
	handleSetToggleDeleteModal,
	handleResumeSignal,
}: IUseFetchSignalsHistoryProps) => {
	const signalsService = new SignalsService();
	const [signalHistory, setSignalHistory] = useState<ISignal[]>([]);
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
		refetch,
	} = useFetch({
		queryKey: [SignalsQueryId.signals],
		queryFn: fetchSignals,
	});

	useEffect(() => {
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(allSignals?.signals ?? []);
		const dataMobile = signalsHistoryDataTableMobileSelector(allSignals?.signals ?? []);

		setSignalHistory(allSignals?.signals ?? []);
		setSignalsTableHead(tableHead);
		setSignalsTableBody(tableBody);
		setSignalsMobileTableBody(dataMobile);
	}, [isLoading, isSuccess, allSignals]);

	useEffect(() => {
		refetch();
	}, [handleResumeSignal, handleSetToggleDeleteModal]);

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
