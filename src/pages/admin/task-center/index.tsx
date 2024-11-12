import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { PAGINATION } from "~/apis/handlers/users/constants";
import { ITaskData } from "~/apis/handlers/users/interfaces";
import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import AdminLayout from "~/components/AdminLayout/Layout";
import Button from "~/components/common/Button";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import Toast from "~/components/common/Toast";
import DropdownIcon from "~/components/icons/DropdownIcon";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import DeleteModal from "~/components/Modal/DeleteModal";
import Pagination from "~/components/Pagination";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { useDeleteTask, useGetAllTasks } from "~/hooks/useTask";
import { taskCenterMobileTableSelector, taskCenterTableSelector } from "~/selectors/task-center";

const TaskCenter = () => {
	const router = useRouter();
	const { search } = router.query;
	const searchParams = new URLSearchParams();
	const [searchTerm, setSearchTerm] = useState<string>(
		Array.isArray(search) ? search[0] : search || "",
	);
	const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION.LIMIT);
	const [currentPage, setCurrentPage] = useState<number>(PAGINATION.PAGE);
	const [totalDocsLength, setTotalDocsLength] = useState<number>(PAGINATION.LIMIT); // Defaults to 10 to calculate page index for initial render.
	const [toggleDeleteModal, setToggleDeleteModal] = useState<boolean>(false);
	const [deleteTaskId, setDeleteTaskId] = useState<string>("");
	const [selectedTasks, setSelectedTasks] = useState<ITaskData[]>([]);

	// For Pagination
	const firstPageIndex = (currentPage - 1) * rowsPerPage;
	const lastPageIndex = Math.min(rowsPerPage * currentPage, totalDocsLength);

	const {
		tasksDetails,
		isLoading,
		isError,
		error,
		isSuccess: getAllTaskSuccess,
		refetch,
	} = useGetAllTasks({
		search: searchTerm,
	});
	const {
		deleteTask,
		deleteMessage,
		error: deleteError,
		isError: isDeleteError,
		isSuccess,
	} = useDeleteTask();

	useEffect(() => setCurrentPage(PAGINATION.PAGE), [rowsPerPage]); // resets the page when rows per page is changed.

	useEffect(() => {
		if (getAllTaskSuccess && tasksDetails) {
			setTotalDocsLength(tasksDetails.length);
			setSelectedTasks(tasksDetails.slice(firstPageIndex, lastPageIndex));
		}
	}, [tasksDetails, rowsPerPage, currentPage]);

	useEffect(() => {
		if (searchTerm) {
			searchParams.set("search", searchTerm);
		}
	}, [searchTerm]);

	const handleSearch = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchTerm) {
			searchParams.set("search", searchTerm);
			router.push({
				pathname: router.pathname,
				query: searchParams.toString(),
			});

			refetch();
		}
	};

	const handleDeleteTaskModalOpen = (taskId: string) => {
		setToggleDeleteModal(true);
		setDeleteTaskId(taskId);
	};
	const handleDeleteModalClose = () => {
		setToggleDeleteModal(false);
		setDeleteTaskId("");
	};
	const handleDeleteTask = () => {
		deleteTask(deleteTaskId);
		handleDeleteModalClose();
	};

	const { tableBody, tableHead } = taskCenterTableSelector(
		selectedTasks as ITaskData[],
		handleDeleteTaskModalOpen,
	);

	const mobileData = taskCenterMobileTableSelector(
		selectedTasks as ITaskData[],
		handleDeleteTaskModalOpen,
	);

	return (
		<section className="">
			<section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<h1 className="md:mb-8 text-lg md:text-2xl font-bold leading-loose">Task Center</h1>
				{selectedTasks && selectedTasks.length >= 1 && (
					<Button
						labelText="create new task"
						onClick={() =>
							router.push(
								`${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}${ROUTES.taskcenter.create}`,
							)
						}
						className="capitalize px-10 mb-6 text-sm font-bold"
					/>
				)}
			</section>

			<section className="flex flex-row items-center -mt-6">
				<SearchForm
					onChange={(e) => setSearchTerm(e.target.value.trim())}
					aria-label="search asset"
					placeHolder="Search for task title, status, etc..."
					onSubmit={handleSearch}
				/>

				<DropdownMenu
					className="w-[256px]"
					btnClass="w-24 h-12 px-1.5 py-3 bg-white rounded-lg border border-[#E1E6EF]"
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
					<p>DropDown Item</p>
				</DropdownMenu>
			</section>

			<section className="bg-white w-full rounded-xl p-2 md:p-6">
				{isLoading ? (
					<>
						<section className="w-full hidden md:block">
							<TableLoader />
						</section>
						<section className="w-full md:hidden">
							<MobileTableLoader />
						</section>
					</>
				) : isError && !selectedTasks ? (
					<p className="text-red-400 py-10 m-auto">{`An Error occured: ${error?.message}`}</p>
				) : selectedTasks && selectedTasks.length >= 1 ? (
					<section className="overflow-x-auto">
						<section className="hidden md:block">
							<DataTable
								tHead={tableHead}
								tBody={tableBody}
								hasMenueItems={true}
								menueItemType="icon-button"
								justifyMenueItem="justify-start pl-20"
							/>
						</section>
						<section className="md:hidden">
							<DataTableMobile data={mobileData} />
						</section>
						<section className="mt-3 p-2 rounded-lg">
							<Pagination
								currentPage={firstPageIndex + 1}
								totalPages={lastPageIndex!}
								rowsPerPage={rowsPerPage!}
								totalRecord={totalDocsLength ?? 0}
								setRowsPerPage={setRowsPerPage}
								onNext={() => setCurrentPage((prev) => prev && ++prev)}
								onPrev={() => setCurrentPage((prev) => prev && --prev)}
							/>
						</section>

						{/* Delete modal */}
						<DeleteModal
							title={"Delete Task"}
							description={"Are you sure you want to delete this task?"}
							btnConfirm={handleDeleteTask}
							btnCancle={handleDeleteModalClose}
							openModal={toggleDeleteModal}
							onClose={handleDeleteModalClose}
						/>

						{/* Alert modal */}
						{isDeleteError && (
							<Toast
								type="error"
								variant="filled"
								title="Error"
								message={deleteError?.message}
								autoVanish={true}
								autoVanishTimeout={10}
							/>
						)}
						{isSuccess && (
							<Toast
								type="success"
								variant="filled"
								title="Success"
								message={deleteMessage}
								autoVanish={true}
								autoVanishTimeout={10}
							/>
						)}
					</section>
				) : (
					<section className="text-center p-[2rem] max-w-[32rem] m-auto">
						<h3 className="font-semibold text-xl text-textColor mb-2">
							No task recorded yet
						</h3>
						<p className="text-[#808080] font-medium text-base md:text-lg">
							Once a task has been added to the system, it will be displayed here.
						</p>

						<Button
							labelText="create new task"
							onClick={() =>
								router.push(
									`${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}${ROUTES.taskcenter.create}`,
								)
							}
							className="capitalize px-10 mt-6 text-sm font-bold"
						/>
					</section>
				)}
			</section>
		</section>
	);
};

TaskCenter.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default TaskCenter;
