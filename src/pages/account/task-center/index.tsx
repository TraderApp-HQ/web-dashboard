import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { IFetchAllActiveTasks, ITaskTableData } from "~/apis/handlers/users/interfaces";
import Card from "~/components/AccountLayout/Card";
import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import AccountLayout from "~/components/AccountLayout/Layout";
import PageTab from "~/components/AccountLayout/Tabs";
import RedeemPointsForm from "~/components/AccountLayout/task-center/RedeemPointsForm";
import { UserTaskStatus } from "~/components/AdminLayout/taskCenter/taskFormData";
import { DataTable } from "~/components/common/DataTable";
import RightLongArrowIcon from "~/components/icons/RightLongArrowIcon";
import UserTaskPointIcon from "~/components/icons/UserTaskPointIcon";
import { Card as CardLoader } from "~/components/Loaders";
import TableLoader from "~/components/Loaders/TableLoader";
import Pagination from "~/components/Pagination";
import { useGetAllActiveTasks } from "~/hooks/useTask";
import { userTaskCenterTableSelector } from "~/selectors/task-center";

const UserTaskDashboard = () => {
	const taskTabs = [
		{ title: "All Tasks", href: "", query: "all" },
		{ title: "Pending Tasks", href: "", query: "pending" },
		{ title: "Completed Tasks", href: "", query: "completed" },
	];
	const router = useRouter();
	const { rows, page, task } = router.query;
	const [rowsPerPage, setRowsPerPage] = useState<number>(rows ? Number(rows) : 10);
	const [currentPage, setCurrentPage] = useState<number>(page ? Number(page) : 1);
	const [tasks, setTasks] = useState<ITaskTableData[]>([]);

	const { activeTasks, isLoading } = useGetAllActiveTasks({
		rows: rowsPerPage,
		page: currentPage,
		task: String(task),
	});

	// Pagination page count
	const totalDocs =
		task === "all" ? activeTasks?.allTask.totalDocs : activeTasks?.userTask.totalDocs;

	const totalPages =
		task === "all" ? activeTasks?.allTask.totalPages : activeTasks?.userTask.totalPages;

	const curPage = task === "all" ? activeTasks?.allTask.page : activeTasks?.userTask.page;

	// function to filter tasks based on query `all` or `pending` or `completed`
	const getAllTaskDetails = useCallback((data: IFetchAllActiveTasks) => {
		const { allTask, userTask } = data;
		const { docs: allTaskDocs } = allTask;
		const { docs: userTaskDocs } = userTask;

		// Conditionally filter based on `router.query.task`
		const modifiedDocs =
			router.query.task !== "all"
				? allTaskDocs.filter((doc) =>
						userTaskDocs.some((usertask) => usertask.taskId === doc.id),
					)
				: allTaskDocs;

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

	// task refetch handler when page is changed
	const updateSearchQuery = (page: number) => {
		if (currentPage && rowsPerPage) {
			router.replace({ query: { ...router.query, page, rows: rowsPerPage } }, undefined, {
				scroll: false,
				shallow: true,
			});
		}
	};

	const { tableBody, tableHead } = userTaskCenterTableSelector(tasks);

	return (
		<section className="space-y-10">
			<section className="flex items-center justify-between">
				<h1 className="font-semibold text-4xl text-[#03033A]">Tasks Center</h1>

				<DropdownMenu
					trigger={
						<div
							data-testid="redeem-points-button"
							className="bg-buttonColor flex items-center gap-2 px-5 py-2 rounded-lg text-white"
						>
							Redeem Points <RightLongArrowIcon />{" "}
						</div>
					}
					position="left"
				>
					<RedeemPointsForm />
				</DropdownMenu>
			</section>

			{isLoading ? (
				<section className="bg-white p-3 w-[40%]">
					<CardLoader />
				</section>
			) : (
				<Card className="max-w-[40%] flex items-start justify-between px-4 py-2">
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
					) : tasks && tasks.length > 1 ? (
						<>
							<section className="">
								<DataTable
									tableHeadStyles="text-justify"
									tableRowItemStyles="text-justify"
									hasMenueItems={true}
									menueItemType="icon-button"
									justifyMenueItem="gap-0 justify-center w-fit px-2"
									tHead={tableHead}
									tBody={tableBody}
								/>
							</section>
							<section className="mt-3 p-2 rounded-lg">
								<Pagination
									currentPage={curPage ?? 1}
									totalPages={totalPages ?? 0}
									rowsPerPage={rowsPerPage}
									totalRecord={totalDocs ?? 0}
									setRowsPerPage={setRowsPerPage}
									onNext={() => {
										setCurrentPage((prev) => ++prev);
										updateSearchQuery(currentPage + 1);
									}}
									onPrev={() => {
										setCurrentPage((prev) => --prev);
										updateSearchQuery(currentPage - 1);
									}}
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
