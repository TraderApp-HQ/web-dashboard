import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { AssetsService } from "~/apis/handlers/assets";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";
import { SignalStatus } from "~/apis/handlers/assets/enums";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import Select from "~/components/AccountLayout/Select";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";
import PerformanceSummaryCard from "~/components/Cards/PerfomanceSummaryCard";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { IActiveSignalCardProps } from "~/components/common/DataTable/config";
import Date from "~/components/common/Date";
import Button from "~/components/common/old/Button";
import Toast from "~/components/common/Toast";
import DropdownIcon from "~/components/icons/DropdownIcon";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import DeleteModal from "~/components/Modal/DeleteModal";
import { useCreate } from "~/hooks/useCreate";
import signalsData from "~/pages/account/signals/data.json";
import { AdminNestedSignalsLayout } from "..";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";

function ActiveSignals() {
	const signalsService = new AssetsService();
	const queryClient = useQueryClient();
	// const { term: urlTerm } = useParams<{ term?: string }>();
	const router = useRouter();
	const { term, signal } = router.query;
	const urlTerm = term as string | undefined;

	const [asset, setAsset] = useState<string>("");
	const [createdAt, setCreatedAt] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [time, setTime] = useState<string>("");
	const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");
	const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
	const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
	const [showSignalCreationToast, setShowSignalCreationToast] = useState(false);
	// const [isToggle, setToggle] = useState(false);

	useEffect(() => {
		if (signal && signal === "true") setShowSignalCreationToast(true);

		if (signal === "true") {
			const url = window.location.pathname; // Get the current pathname
			window.history.replaceState(null, "", url); // Clears query params
		}
	}, [signal]);

	// Setup query to backend
	const {
		mutate: updateSignal,
		isError,
		isPending,
		error,
		isSuccess: isSignalUpdateSuccessful,
		data,
	} = useCreate({
		mutationFn: signalsService.updateSignal.bind(signalsService),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [AssetsQueryId.signals] }),
	});

	const handleDeleteModalConfirm = () => {
		if (selectedSignalId) {
			updateSignal({ id: selectedSignalId, status: SignalStatus.INACTIVE });
			setToggleDeleteModal(false);
			setSelectedSignalId(null);
		}
	};

	const handleSetToggleDeleteModal = (id: string) => {
		setSelectedSignalId(id);
		setToggleDeleteModal(!toggleDeleteModal);
	};

	const handleResumeSignal = (id: string, currentStatus: SignalStatus) => {
		const newSignalStatus =
			currentStatus === SignalStatus.ACTIVE ? SignalStatus.PAUSED : SignalStatus.ACTIVE;
		updateSignal({ id, status: newSignalStatus });
	};

	const {
		isLoading,
		isError: isFetchError,
		isSuccess,
		activeSignals,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
		performanceSummary,
	} = useFetchActiveSignals({
		isAdmin: true,
		handleSetToggleDeleteModal,
		handleResumeSignal,
	});

	const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(event.target.value);
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("asset::::::::::::::::::", asset);
		console.log("createdAt::::::::::::::::::", createdAt);
		console.log("selectedDate::::::::::::::::::", selectedDate);
		console.log("time::::::::::::::::::", time);
	};

	const handleSearch = async () => {
		console.log("searchterm::::::::::::::::::", searchterm);
	};

	if (isPending) {
		return <div>updating signals status.....</div>;
	}

	return (
		<>
			<ActiveSignalCard
				summary={performanceSummary}
				isLoading={isLoading}
				isSuccess={isSuccess}
				isError={isFetchError}
			/>
			<div className={clsx("flex justify-between", activeSignals.length === 0 ? "mt-0" : "")}>
				<SearchForm
					onChange={(e) => setSearchTerm(e.target.value)}
					aria-label="search asset"
					placeHolder="Search for asset name, status, etc..."
					onSubmit={handleSearch}
				/>

				<DropdownMenu
					className="w-[256px]"
					btnClass="mt-6 w-24 h-12 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border"
					trigger={
						<>
							<div className="text-sky-900 text-base font-normal leading-snug">
								Filter
							</div>
							<DropdownIcon />
						</>
					}
					position="left"
				>
					<DropdownMenuItem className="flex flex-col gap-y-2">
						<form onSubmit={onSubmit} method="post">
							<Select
								name="assets"
								label="Assets"
								options={signalsData.assets}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setAsset(e.target.value)}
								selected={{ value: asset }}
							/>
							<Select
								name="createdAt"
								label="CreatedAt"
								options={signalsData.createdAtList}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setCreatedAt(e.target.value)}
								selected={{ value: createdAt }}
							/>
							<Date
								label="Date"
								name="selectedDate"
								value={selectedDate}
								onChange={handleDateChange}
								required
							/>
							<Select
								name="time"
								label="Time"
								options={signalsData.timeList}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setTime(e.target.value)}
								selected={{ value: time }}
							/>
							<Button type="submit" onClick={() => {}} fluid className="mt-2">
								Search
							</Button>
						</form>
					</DropdownMenuItem>
				</DropdownMenu>
			</div>

			{!isLoading && activeSignals.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<div className="pb-8 rounded-2xl">
					<h3 className="font-bold text-base text-[#08123B]">
						All Active Signal ({activeSignals.length})
					</h3>
					<div className="mt-2 mb-8">
						<div className="hidden md:block p-10 bg-white rounded-2xl relative overflow-x-auto">
							{isLoading && <TableLoader />}
							{isSuccess && signalsTableBody && (
								<DataTable tHead={signalsTableHead} tBody={signalsTableBody} />
							)}
						</div>
						<div className="md:hidden relative">
							{isLoading && <MobileTableLoader />}
							{isSuccess && <DataTableMobile data={signalsMobileTableBody} />}
						</div>
					</div>
					<div className="border w-[30%] ml-auto">pagination component goes here</div>
				</div>
			)}

			<DeleteModal
				title={"Delete signal"}
				description={"Are you sure you want to delete this signal?"}
				btnConfirm={handleDeleteModalConfirm}
				btnCancle={() => setToggleDeleteModal(false)}
				openModal={toggleDeleteModal}
				onClose={() => setToggleDeleteModal(false)}
			/>
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="Signal update Error"
					message={error?.message ?? "Something went wrong!"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
			{((data && isSignalUpdateSuccessful) || showSignalCreationToast) && (
				<Toast
					type="success"
					variant="filled"
					title="Success"
					message={`Signal ${showSignalCreationToast ? "created" : "updated"} successfully.`}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
}

const ActiveSignalCard: React.FC<IActiveSignalCardProps> = ({
	summary,
	isLoading,
	isError,
	isSuccess,
}) => {
	return (
		<>
			{isLoading && <PerformanceSummaryCardLoader />}
			{isError && <div>Error fetching data</div>}
			{isSuccess && (
				<div className="flex flex-col md:flex-row gap-4">
					<PerformanceSummaryCard data={summary?.bestSignal} label="best performer" />
					<PerformanceSummaryCard data={summary?.worstSignal} label="worst performer" />
				</div>
			)}
		</>
	);
};

ActiveSignals.getLayout = (page: React.ReactElement) => (
	<AdminNestedSignalsLayout>{page}</AdminNestedSignalsLayout>
);
export default ActiveSignals;
