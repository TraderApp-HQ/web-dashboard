import { ITaskData, ITaskTableData } from "~/apis/handlers/users/interfaces";
import {
	ITableActions,
	ITableMobile,
	ITableMobileItem,
	ITBody,
} from "~/components/common/DataTable/config";
import DeleteIcon from "~/components/icons/DeleteIcon";
import EditIcon from "~/components/icons/EditIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { renderStatus } from "~/helpers";
import { TaskCenterTableHeadItems, UserTaskCenterTableHeadItems } from "./constant";
import { TaskStatus } from "~/apis/handlers/users/enums";

export const taskCenterTableSelector = (
	tasks: ITaskData[],
	handleDeleteTaskModalOpen: (taskId: string) => void,
) => {
	const tableHead = [...TaskCenterTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: tasks?.map((task) => {
			return {
				tBodyColumns: [
					{
						displayItem: task.title,
						styles: "text-lg capitalize text-left",
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
						displayItem: renderStatus(task.status!, { justify: "justify-center" }),
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

export const taskCenterMobileTableSelector = (
	tasks: ITaskData[],
	handleDeleteTaskModalOpen: (taskId: string) => void,
) => {
	const mobileData: ITableMobile[] = tasks.map((task) => ({
		tHead: {
			displayItemTitle: task.title,
			displayItemValue: "",
			styles: "text-lg font-medium",
		},
		tBody: [
			{
				displayItemTitle: "Category",
				displayItemValue: renderStatus(
					task.category,
					{ justify: "justify-end text-sm text-nowrap" },
					false,
				),
			},
			{
				displayItemTitle: "Points",
				displayItemValue: task.points,
				styles: "text-sm",
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(task.status!, { justify: "justify-end text-sm" }),
			},
			{
				displayItemTitle: task.dueDate ? "Due Date" : "",
				displayItemValue: task.dueDate ? new Date(task?.dueDate).toDateString() : "",
				styles: "text-sm",
			},
		],
		actions: [
			{
				label: "View",
				url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task.id}${ROUTES.taskcenter.view}`,
			},
			{
				label: "Edit",
				icon: EditIcon,
				url: `${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}/${task.id}${ROUTES.taskcenter.edit}`,
				styles: "flex items-center",
			},
			task.status !== TaskStatus.STARTED && {
				label: "Delete",
				icon: DeleteIcon,
				styles: "flex items-center gap-2",
				onClick: () => handleDeleteTaskModalOpen(task.id!),
				deleteAction: true,
			},
		] as ITableActions[],
	}));

	return mobileData;
};

export const userTaskCenterTableSelector = (task: ITaskTableData[]) => {
	const tableHead = [...UserTaskCenterTableHeadItems];
	const tableBody: ITBody = {
		tBodyRows: task?.map((task) => {
			return {
				tBodyColumns: [
					{
						displayItem: task.title,
						styles: "text-lg capitalize text-left",
					},
					{ displayItem: task.points },
					{ displayItem: task.taskType },
					{
						displayItem: task.dueDate ? new Date(task?.dueDate).toDateString() : "",
						styles: "w-[1.5rem]",
					},
					{
						displayItem: renderStatus(task.status!, { justify: "justify-center" }),
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

export const userTaskCenterMobileTableSelector = (tasks: ITaskTableData[]) => {
	const mobileData: ITableMobile[] = tasks.map((task) => ({
		tHead: {
			displayItemTitle: task.title,
			displayItemValue: "",
			styles: "text-base font-medium",
		},
		tBody: [
			{
				displayItemTitle: "Points",
				displayItemValue: task.points,
				styles: "text-sm font-medium",
			},
			{
				displayItemTitle: "Task Type",
				displayItemValue: task.taskType,
				styles: "text-sm font-medium",
			},
			task.dueDate && {
				displayItemTitle: "Due Date",
				displayItemValue: new Date(task.dueDate).toDateString(),
				styles: "text-sm font-medium",
			},
			{
				displayItemTitle: "Status",
				displayItemValue: renderStatus(task.status!, { justify: "justify-end text-sm" }),
			},
		] as ITableMobileItem[],
		actions: [
			{
				label: "View",
				url: `${LAYOUT_ROUTES.account}${ROUTES.taskcenter.home}/${task.id}`,
			},
		] as ITableActions[],
	}));

	return mobileData;
};
