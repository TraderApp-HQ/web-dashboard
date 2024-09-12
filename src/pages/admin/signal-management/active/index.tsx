import { useRouter } from "next/router";
import SearchForm from "~/components/AccountLayout/SearchForm";
import EmptySignal from "../../../../components/AdminLayout/Signal/EmptySignal";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import clsx from "clsx";
import DropdownIcon from "~/components/icons/DropdownIcon";
import Date from "~/components/common/Date";
import Button from "~/components/common/old/Button";
import type { ChangeEvent } from "react";
import { useState } from "react";
import signalsData from "~/pages/account/signals/data.json";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import DeleteModal from "~/components/Modal/DeleteModal";
import Select from "~/components/AccountLayout/Select";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import { ISignal } from "~/apis/handlers/assets/interfaces";
import { activeSignalsPerfomanceSumary } from "~/selectors/signals";
import PerformanceSummaryCard from "~/components/Cards/PerfomanceSummaryCard";
import { AdminNestedSignalsLayout } from "..";
import { useCreate } from "~/hooks/useCreate";
import { AssetsService } from "~/apis/handlers/assets";
import { SignalStatus } from "~/apis/handlers/assets/enums";
import Toast from "~/components/common/Toast";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import TableLoader from "~/components/Loaders/TableLoader";

function ActiveSignals() {
	const signalsService = new AssetsService();
	// const { term: urlTerm } = useParams<{ term?: string }>();
	const router = useRouter();
	const { term } = router.query;
	const urlTerm = term as string | undefined;

	const [asset, setAsset] = useState<string>("");
	const [createdAt, setCreatedAt] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [time, setTime] = useState<string>("");
	const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");
	const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
	const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
	// const [isToggle, setToggle] = useState(false);

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
	});

	const handleSetToggleDeleteModal = (id: string) => {
		setSelectedSignalId(id);
		setToggleDeleteModal(!toggleDeleteModal);
	};

	const handleDeleteModalConfirm = () => {
		if (selectedSignalId) {
			updateSignal({ id: selectedSignalId, status: SignalStatus.INACTIVE });
			setToggleDeleteModal(false);
			setSelectedSignalId(null);
		}
	};

	const handleResumeSignal = (id: string, currentStatus: SignalStatus) => {
		const newSignalStatus =
			currentStatus === SignalStatus.ACTIVE ? SignalStatus.PAUSED : SignalStatus.ACTIVE;
		updateSignal({ id, status: newSignalStatus });
	};

	const {
		isLoading,
		isSuccess,
		activeSignals,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
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
			<ActiveSignalCard signals={activeSignals} />
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
				<EmptySignal />
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
			{data && isSignalUpdateSuccessful && (
				<Toast
					type="info"
					variant="filled"
					title="Signal successfully updated"
					message="Successful!"
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
}

const ActiveSignalCard: React.FC<{ signals: ISignal[] }> = ({ signals }) => {
	const signalPerformer = activeSignalsPerfomanceSumary(signals);
	return (
		signals.length > 0 && (
			<div className="flex flex-col md:flex-row gap-2">
				{signalPerformer.map((performance) => (
					<PerformanceSummaryCard key={performance.id} data={performance} />
				))}
			</div>
		)
	);
};

ActiveSignals.getLayout = (page: React.ReactElement) => (
	<AdminNestedSignalsLayout>{page}</AdminNestedSignalsLayout>
);
export default ActiveSignals;
