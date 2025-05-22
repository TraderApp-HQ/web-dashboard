import { ITHead } from "~/components/common/DataTable/config";

export const TaskCenterTableHeadItems: ITHead[] = [
	{ displayItem: "Task Title", styles: "text-left" },
	{ displayItem: "Task Category" },
	{ displayItem: "Points" },
	{ displayItem: "Status" },
	{ displayItem: "Due Date" },
];

export const UserTaskCenterTableHeadItems: ITHead[] = [
	{ displayItem: "Task Name", styles: "text-left" },
	{ displayItem: "Point" },
	{ displayItem: "Task Type" },
	{ displayItem: "Due Date" },
	{ displayItem: "Status" },
];
