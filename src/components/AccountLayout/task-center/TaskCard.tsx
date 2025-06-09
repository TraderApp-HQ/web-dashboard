import TaskIcon from "~/components/icons/TaskIcon";
import IconButton from "../IconButton";
import { useRouter } from "next/router";

interface ITaskCardProps {
	title: string;
	link: string;
}

const TaskCard = ({ title, link }: ITaskCardProps) => {
	const router = useRouter();

	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full p-3 border border-[#E8EAEE] rounded-xl min-h-20">
			<div className="flex items-center gap-2">
				<div className="flex items-center justify-center size-10 rounded-full bg-[#F6F8FE]">
					<TaskIcon />
				</div>
				<p className="text-base font-medium text-[#030A2A] capitalize">{title}</p>
			</div>

			<IconButton
				btnClass="bg-buttonColor text-white font-normal text-xs text-nowrap px-4 py-2 rounded-md max-sm:ml-12"
				aria-label="View Task"
				onClick={() => router.push(link)}
			>
				View Task
			</IconButton>
		</div>
	);
};

export default TaskCard;
