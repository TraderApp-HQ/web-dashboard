import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { PAGINATION } from "~/apis/handlers/users/constants";
import { UserTaskPageTab, UserTaskStatus } from "~/apis/handlers/users/enums";
import {
	IDocsLength,
	IFetchAllActiveTasks,
	ITaskTableData,
} from "~/apis/handlers/users/interfaces";
import Card from "~/components/AccountLayout/Card";
import PageTab from "~/components/AccountLayout/Tabs";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import UserTaskPointIcon from "~/components/icons/UserTaskPointIcon";
import { Card as CardLoader } from "~/components/Loaders";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import Pagination from "~/components/Pagination";
import { useGetAllActiveTasks } from "~/hooks/useTask";
import {
	userTaskCenterMobileTableSelector,
	userTaskCenterTableSelector,
} from "~/selectors/task-center";
import { NestedRewardHubLayout } from "..";

const UserTaskDashboard = () => {
	const taskTabs = [
		{ title: "All Tasks", href: "task-center", query: "all" },
		{ title: "Pending Tasks", href: "task-center", query: "pending" },
		{ title: "Completed Tasks", href: "task-center", query: "completed" },
	];
	const router = useRouter();
	const { task } = router.query;
	// Check if the query matches one of the expected keys in IDocsLength interface
	const queryKey = task as keyof IDocsLength;
	const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION.LIMIT);
	const [currentPage, setCurrentPage] = useState<number>(PAGINATION.PAGE);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [tasks, setTasks] = useState<ITaskTableData[]>([]);
	const [docsLength, setDocsLength] = useState<IDocsLength>();

	const { activeTasks, isLoading } = useGetAllActiveTasks();

	// function to get all docs length
	const getAllDocsLength = (data: IFetchAllActiveTasks) => {
		const { allTask, userTask } = data;
		const allTasksLength = allTask.length;
		const userTasksLength = userTask.length;
		const pendingTasksLength = allTask.length - userTask.length;

		const lenData = {
			all: allTasksLength,
			pending: pendingTasksLength,
			completed: userTasksLength,
		};

		return lenData;
	};

	// function to filter tasks based on query `all` or `pending` or `completed`
	const getAllTaskDetails = useCallback((data: IFetchAllActiveTasks) => {
		const { allTask, userTask } = data;

		// Conditionally filter based on `router.query.task`
		const modifiedDocs = (() => {
			switch (router.query.task) {
				case UserTaskPageTab.PENDING:
					return allTask.filter(
						(doc) => !userTask.some((task) => task.taskId === doc.id),
					);
				case UserTaskPageTab.COMPLETED:
					return allTask.filter((doc) => userTask.some((task) => task.taskId === doc.id));
				case UserTaskPageTab.ALL:
				default:
					return allTask;
			}
		})();

		// modifies tasks status
		return modifiedDocs.map((doc) => {
			const userTaskStatus = userTask.find((utc) => utc.taskId === doc.id)?.status;
			return { ...doc, status: userTaskStatus || UserTaskStatus.PENDING };
		});
	}, []);

	useEffect(() => setCurrentPage(PAGINATION.PAGE), [rowsPerPage]); // resets the page when rows per page is changed.

	useEffect(() => {
		if (activeTasks) {
			const docsLength = getAllDocsLength(activeTasks);
			const taskDetails = getAllTaskDetails(activeTasks);

			const firstIndex = (currentPage - 1) * rowsPerPage;
			const lastIndex = Math.min(rowsPerPage * currentPage, docsLength[queryKey]);
			const totalPages = Math.ceil(docsLength[queryKey] / rowsPerPage);

			setDocsLength(docsLength);
			setTotalPages(totalPages);
			setTasks(taskDetails.slice(firstIndex, lastIndex));
		}
	}, [activeTasks, currentPage, rowsPerPage]);

	const { tableBody, tableHead } = userTaskCenterTableSelector(tasks);
	const mobileData = userTaskCenterMobileTableSelector(tasks);

	return (
		<section className="space-y-10">
			{isLoading ? (
				<section className="bg-white p-3 w-[20rem]">
					<CardLoader />
				</section>
			) : (
				<Card className="sm:max-w-[20rem] flex items-start justify-between px-4 py-2">
					<section className="space-y-10">
						<p className="font-semibold">Accumulated Points</p>
						<p className="font-bold text-2xl">00</p>
					</section>

					<section className="bg-[#E7ECFE] p-2 w-fit rounded-full">
						<UserTaskPointIcon />
					</section>
				</Card>
			)}

			<section className="space-y-5">
				<PageTab tabs={taskTabs} docCount={docsLength} />

				<section className="overflow-x-auto">
					{isLoading ? (
						<div className="bg-white rounded-xl p-2 md:p-6">
							<section className="w-full hidden md:block">
								<TableLoader />
							</section>
							<section className="w-full md:hidden">
								<MobileTableLoader />
							</section>
						</div>
					) : tasks && tasks.length >= 1 ? (
						<>
							<section className="hidden md:block bg-white rounded-xl p-2 md:p-6">
								<DataTable
									hasMenueItems={true}
									menueItemType="icon-button"
									justifyMenueItem="justify-center"
									tHead={tableHead}
									tBody={tableBody}
								/>
								<section className="mt-4 p-2">
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										rowsPerPage={rowsPerPage}
										totalRecord={docsLength![queryKey]}
										setRowsPerPage={setRowsPerPage}
										onNext={() => setCurrentPage((prev) => ++prev)}
										onPrev={() => setCurrentPage((prev) => --prev)}
									/>
								</section>
							</section>
							<section className="md:hidden">
								<DataTableMobile
									data={mobileData}
									showPagination={true}
									paginationProps={{
										currentPage: currentPage,
										totalPages: totalPages,
										rowsPerPage: rowsPerPage,
										totalRecord: docsLength![queryKey],
										setRowsPerPage: setRowsPerPage,
										onNext: () => setCurrentPage((prev) => ++prev),
										onPrev: () => setCurrentPage((prev) => --prev),
									}}
								/>
							</section>
						</>
					) : (
						<section className="text-center p-[2rem] my-8 mx-auto bg-white rounded-xl">
							<h3 className="font-semibold text-xl text-textColor mb-2">
								No task recorded yet
							</h3>
							<p className="text-[#808080] font-medium text-base md:text-lg">
								Once a task has been added to your record, it will be displayed
								here.
							</p>
						</section>
					)}
				</section>
			</section>
		</section>
	);
};

UserTaskDashboard.getLayout = (page: React.ReactElement) => (
	<NestedRewardHubLayout>{page}</NestedRewardHubLayout>
);
export default UserTaskDashboard;
