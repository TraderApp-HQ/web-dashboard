import { ITaskTableData } from "~/apis/handlers/users/interfaces";
import { ICreateTaskFormData, TaskStatus } from "~/components/AdminLayout/taskCenter/taskFormData";
import { ITableActions, ITBody } from "~/components/common/DataTable/config";
import DeleteIcon from "~/components/icons/DeleteIcon";
import EditIcon from "~/components/icons/EditIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { renderStatus } from "~/helpers";
import { TaskCenterTableHeadItems, UserTaskCenterTableHeadItems } from "./constant";

export const taskCenterTableSelector = (
	tasks: ICreateTaskFormData[],
	handleDeleteTaskModalOpen: (taskId: string) => void,
) => {
	const tableHead = [...TaskCenterTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: tasks?.map((task) => {
			return {
				tBodyColumns: [
					{
						displayItem: task.title,
						styles: "text-lg capitalize",
					},
					{
						displayItem: renderStatus(
							task.category,
							{ justify: "justify-center" },
							false,
						),
					},
					{ displayItem: task.points },
					{
						displayItem: renderStatus(task.status!),
					},
					{
						displayItem: task.dueDate ? new Date(task?.dueDate).toDateString() : "",
						styles: "w-[1.5rem]",
					},
				],
				actions: [
					{
						label: "View",
						url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task.id}${ROUTES.taskcenter.view}`,
					},
					{
						icon: EditIcon,
						url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task.id}${ROUTES.taskcenter.edit}`,
						styles: "flex items-center",
					},
					task.status !== TaskStatus.STARTED && {
						icon: DeleteIcon,
						styles: "flex items-center gap-2",
						onClick: () => handleDeleteTaskModalOpen(task.id!),
						deleteAction: true,
					},
				] as ITableActions[],
			};
		}),
	};

	return { tableHead, tableBody };
};

export const userTaskCenterTableSelector = (task: ITaskTableData[]) => {
	const tableHead = [...UserTaskCenterTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: task?.map((task) => {
			return {
				tBodyColumns: [
					{
						displayItem: task.title,
						styles: "text-lg capitalize",
					},
					{ displayItem: task.points },
					{ displayItem: task.taskType },
					{
						displayItem: task.dueDate ? new Date(task?.dueDate).toDateString() : "",
						styles: "w-[1.5rem]",
					},
					{
						displayItem: renderStatus(task.status!),
					},
				],
				actions: [
					{
						label: "View",
						url: `${LAYOUT_ROUTES.account}${ROUTES.taskcenter.home}/${task.id}`,
					},
				] as ITableActions[],
			};
		}),
	};

	return { tableHead, tableBody };
};
