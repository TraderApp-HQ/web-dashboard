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
		<div className="flex flex-col gap-4 sm:items-center sm:flex-row sm:justify-between lg:flex-col lg:items-start xl:flex-row  w-full p-3 border border-[#E8EAEE] rounded-xl">
			<div className="flex items-center gap-2 max-w-full md:max-w-[80%]">
				<div className="flex items-center justify-center size-10 rounded-full bg-[#F6F8FE]">
					<TaskIcon />
				</div>
				<p className="text-base font-medium text-[#030A2A]">{title}</p>
			</div>

			<IconButton
				btnClass="bg-buttonColor text-white font-normal text-[13px] text-nowrap px-2 py-3 rounded-md w-[100px]"
				aria-label="View Task"
				onClick={() => router.push(link)}
			>
				View Task
			</IconButton>
		</div>
	);
};

export default TaskCard;
