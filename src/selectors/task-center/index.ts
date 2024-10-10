import { ITableActions, ITBody } from "~/components/common/DataTable/config";
import EditIcon from "~/components/icons/EditIcon";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { TaskCenterTableHeadItems } from "./constant";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";

export const taskCenterTableSelector = (tasks: ICreateTaskFormData[]) => {
	const tableHead = [...TaskCenterTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: tasks?.map((task) => {
			return {
				tBodyColumns: [
					{
						displayItem: renderDisplayItem({
							itemText: { text: task.title, style: "text-base font-normal" },
							styles: "!justify-start md:!justify-start w-fit",
						}),
					},
					{ displayItem: task.category },
					{ displayItem: task.points },
					{
						displayItem: renderStatus(task.status, {
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
						url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task._id}${ROUTES.taskcenter.view}`,
					},
					{
						label: "",
						icon: EditIcon,
						url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task._id}${ROUTES.taskcenter.edit}`,
					},
				] as ITableActions[],
			};
		}),
	};

	return { tableHead, tableBody };
};
