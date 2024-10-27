import { ITaskTableData } from "~/apis/handlers/users/interfaces";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";
import { ITableActions, ITBody } from "~/components/common/DataTable/config";
import DeleteIcon from "~/components/icons/DeleteIcon";
import EditIcon from "~/components/icons/EditIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { renderCategory, renderStatus } from "~/helpers";
import { TaskCenterTableHeadItems, UserTaskCenterTableHeadItems } from "./constant";

export const taskCenterTableSelector = (
	tasks: ICreateTaskFormData[],
	deleteTask: (taskId: string) => void,
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
					{ displayItem: renderCategory(task.category) },
					{ displayItem: task.points },
					{
						displayItem: renderStatus(task.status!, {
							justify: "!justify-start w-fit",
						}),
					},
					{
						displayItem: task.dueDate ? new Date(task?.dueDate).toDateString() : "",
					},
				],
				actions: [
					{
						label: "View",
						url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task.id}${ROUTES.taskcenter.view}`,
					},
					{
						icon: EditIcon,
						label: "Update",
						url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task.id}${ROUTES.taskcenter.edit}`,
						styles: "flex items-center",
					},
					{
						icon: DeleteIcon,
						label: "Delete",
						styles: "flex items-center gap-2",
						onClick: () => deleteTask(task.id!),
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
					},
					{
						displayItem: renderStatus(task.status!, {
							justify: "!justify-start w-fit",
						}),
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
