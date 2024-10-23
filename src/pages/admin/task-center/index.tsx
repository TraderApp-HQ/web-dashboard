import { useRouter } from "next/router";
import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import AdminLayout from "~/components/AdminLayout/Layout";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";
import Button from "~/components/common/Button";
import { DataTable } from "~/components/common/DataTable";
import Toast from "~/components/common/Toast";
import DropdownIcon from "~/components/icons/DropdownIcon";
import TableLoader from "~/components/Loaders/TableLoader";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { useDeleteTask, useGetAllTasks } from "~/hooks/useTask";
import { taskCenterTableSelector } from "~/selectors/task-center";

const TaskCenter = () => {
	// const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();
	const { tasks, isLoading, isError, error } = useGetAllTasks();
	const {
		deleteTask,
		deleteMessage,
		error: deleteError,
		isError: isDeleteError,
		isSuccess,
	} = useDeleteTask();

	const { tableBody, tableHead } = taskCenterTableSelector(
		tasks as ICreateTaskFormData[],
		deleteTask,
	);

	return (
		<section className="">
			<section className="flex items-center justify-between">
				<h1 className="mb-8 text-2xl font-bold leading-loose">Task Center</h1>
				{tasks && tasks.length >= 1 && (
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
					// onChange={(e) => setSearchTerm(e.target.value)}
					aria-label="search asset"
					placeHolder="Search for task title, status, etc..."
					// onSubmit={handleSearch}
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

			{isLoading ? (
				<TableLoader />
			) : !isLoading && isError && !tasks ? (
				<section className="bg-white text-red-400 flex items-center justify-center rounded-md mt-6">{`An Error occured: ${error?.message}`}</section>
			) : !isLoading && tasks && tasks?.length >= 1 ? (
				<>
					<section className="overflow-x-auto bg-white rounded-xl px-5 scrollbar-hide">
						<DataTable
							tableHeadStyles="text-justify"
							tableRowItemStyles="text-justify"
							tHead={tableHead}
							tBody={tableBody}
						/>
					</section>
					<section className="bg-white mt-3 p-2 rounded-lg">
						{/* <Pagination
							currentPage={1}
							totalPages={1}
							rowsPerPage={10}
							totalRecord={1}
							setRowsPerPage={() => setRowsPerPage(10)}
							onNext={() => setCurrentPage((prev) => prev + 1)}
							onPrev={() => setCurrentPage((prev) => prev - 1)}
						/> */}
					</section>

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
				</>
			) : (
				<section className="bg-white flex items-center justify-center rounded-md mt-6">
					<section className="text-center p-[2rem] max-w-[32rem] my-8">
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
				</section>
			)}
		</section>
	);
};

TaskCenter.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default TaskCenter;
