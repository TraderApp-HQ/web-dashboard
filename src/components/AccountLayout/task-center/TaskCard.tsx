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
		<div className="flex items-center justify-between w-full p-3 border border-[#E8EAEE] rounded-xl">
			<div className="flex items-center gap-2">
				<div className="flex items-center justify-center size-10 rounded-full bg-[#F6F8FE]">
					<TaskIcon />
				</div>
				<p className="text-base font-medium text-[#030A2A]">{title}</p>
			</div>

			<IconButton
				btnClass="bg-buttonColor text-white font-normal text-xs text-nowrap px-2 py-1 rounded-md"
				aria-label="View Task"
				onClick={() => router.push(link)}
			>
				View Task
			</IconButton>
		</div>
	);
};

export default TaskCard;
