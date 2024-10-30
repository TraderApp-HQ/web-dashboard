import { ITableActions, ITBody } from "~/components/common/DataTable/config";
import EditIcon from "~/components/icons/EditIcon";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { TaskCenterTableHeadItems } from "./constant";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";
import DeleteIcon from "~/components/icons/DeleteIcon";

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
						displayItem: renderDisplayItem({
							itemText: {
								text: task.title,
								style: "text-base capitalize font-normal",
							},
							styles: "!justify-start md:!justify-start",
						}),
					},
					{ displayItem: task.category },
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
