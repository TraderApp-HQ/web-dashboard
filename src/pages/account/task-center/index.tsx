import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { IFetchAllActiveTasks, ITaskTableData } from "~/apis/handlers/users/interfaces";
import Card from "~/components/AccountLayout/Card";
import AccountLayout from "~/components/AccountLayout/Layout";
import PageTab from "~/components/AccountLayout/Tabs";
import { UserTaskPageTab, UserTaskStatus } from "~/components/AdminLayout/taskCenter/taskFormData";
import { DataTable } from "~/components/common/DataTable";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";
import UserTaskPointIcon from "~/components/icons/UserTaskPointIcon";
import { Card as CardLoader } from "~/components/Loaders";
import TableLoader from "~/components/Loaders/TableLoader";
import Pagination from "~/components/Pagination";
import { ROUTES } from "~/config/constants";
import { useGetAllActiveTasks } from "~/hooks/useTask";
import { userTaskCenterTableSelector } from "~/selectors/task-center";

const UserTaskDashboard = () => {
	const taskTabs = [
		{ title: "All Tasks", href: "", query: "all" },
		{ title: "Pending Tasks", href: "", query: "pending" },
		{ title: "Completed Tasks", href: "", query: "completed" },
	];
	const router = useRouter();
	const { task } = router.query;
	const searchParams = new URLSearchParams();
	const [rowsPerPage, setRowsPerPage] = useState<number>();
	const [currentPage, setCurrentPage] = useState<number>();
	const [tasks, setTasks] = useState<ITaskTableData[]>([]);
	const [totalDocs, setTotalDocs] = useState<number>();
	const [totalPages, setTotalPages] = useState<number>();

	const { activeTasks, isLoading, refetch } = useGetAllActiveTasks({
		rows: rowsPerPage,
		page: currentPage,
		task: String(task),
	});

	// function to filter tasks based on query `all` or `pending` or `completed`
	const getAllTaskDetails = useCallback((data: IFetchAllActiveTasks) => {
		const { allTask, userTask } = data;
		const { docs: allTaskDocs } = allTask;
		const { docs: userTaskDocs } = userTask;

		// Conditionally filter based on `router.query.task`
		const modifiedDocs = (() => {
			switch (router.query.task) {
				case UserTaskPageTab.PENDING:
					return allTaskDocs.filter(
						(doc) => !userTaskDocs.some((usertask) => usertask.taskId === doc.id),
					);
				case UserTaskPageTab.COMPLETED:
					return allTaskDocs.filter((doc) =>
						userTaskDocs.some((usertask) => usertask.taskId === doc.id),
					);
				case UserTaskPageTab.ALL:
				default:
					return allTaskDocs;
			}
		})();

		// modifies tasks status
		return modifiedDocs.map((doc) => {
			const userTaskStatus = userTaskDocs.find((utc) => utc.taskId === doc.id)?.status;
			return { ...doc, status: userTaskStatus || UserTaskStatus.PENDING };
		});
	}, []);

	useEffect(() => {
		if (activeTasks) {
			const taskDetails = getAllTaskDetails(activeTasks);
			setTasks(taskDetails);
		}
	}, [activeTasks]);

	useEffect(() => {
		if (activeTasks) {
			if (task === UserTaskPageTab.ALL) {
				setRowsPerPage(activeTasks.allTask.limit);
				setCurrentPage(activeTasks.allTask.page);
				setTotalDocs(activeTasks.allTask.totalDocs);
				setTotalPages(activeTasks.allTask.totalPages);
			} else if (task === UserTaskPageTab.PENDING) {
				setRowsPerPage(activeTasks.allTask.limit);
				setCurrentPage(activeTasks.allTask.page);
				setTotalDocs(activeTasks.allTask.totalDocs - activeTasks.userTask.totalDocs);
				setTotalPages(
					Math.ceil(
						(activeTasks.allTask.totalPages - activeTasks.userTask.totalPages) /
							activeTasks.allTask.limit,
					),
				);
			} else if (task === UserTaskPageTab.COMPLETED) {
				setRowsPerPage(activeTasks.userTask.limit);
				setCurrentPage(activeTasks.userTask.page);
				setTotalDocs(activeTasks.userTask.totalDocs);
				setTotalPages(activeTasks.userTask.totalPages);
			}
		}
	}, [activeTasks]);

	useEffect(() => {
		if (currentPage) {
			searchParams.set("page", currentPage.toString());
		}
		if (rowsPerPage) {
			searchParams.set("rows", rowsPerPage.toString());
		}

		refetch();
	}, [currentPage, rowsPerPage]);

	const { tableBody, tableHead } = userTaskCenterTableSelector(tasks);

	return (
		<section className="space-y-10">
			<section
				className="flex items-center gap-2 cursor-pointer w-fit -my-6"
				onClick={() => router.replace(`${ROUTES.dashboard.backButton}`)}
			>
				<LeftArrowIcon />
				<p className="font-semibold text-lg text-textColor">Back</p>
			</section>
			<h1 className="font-semibold text-4xl text-[#03033A]">Tasks Center</h1>

			{isLoading ? (
				<section className="bg-white p-3 w-[30%]">
					<CardLoader />
				</section>
			) : (
				<Card className="sm:max-w-[30%] flex items-start justify-between px-4 py-2">
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
				<PageTab tabs={taskTabs} docCount={totalDocs} />

				<section className="bg-white rounded-xl p-2 md:p-6 overflow-x-auto">
					{isLoading ? (
						<TableLoader />
					) : tasks && tasks.length >= 1 ? (
						<>
							<DataTable
								hasMenueItems={true}
								menueItemType="icon-button"
								justifyMenueItem="justify-center"
								tHead={tableHead}
								tBody={tableBody}
							/>
							<section className="mt-3 p-2 rounded-lg">
								<Pagination
									currentPage={currentPage ?? 1}
									totalPages={totalPages ?? 0}
									rowsPerPage={rowsPerPage!}
									totalRecord={totalDocs ?? 0}
									setRowsPerPage={setRowsPerPage}
									onNext={() => setCurrentPage((prev) => prev && ++prev)}
									onPrev={() => setCurrentPage((prev) => prev && --prev)}
								/>
							</section>
						</>
					) : (
						<section className="text-center p-[2rem] my-8 mx-auto">
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

UserTaskDashboard.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default UserTaskDashboard;
