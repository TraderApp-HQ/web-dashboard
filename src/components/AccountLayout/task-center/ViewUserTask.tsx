import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TaskCategory, UserTaskStatus } from "~/apis/handlers/users/enums";
import { ICreateUserTask, ITaskWithPopulate } from "~/apis/handlers/users/interfaces";
import Button from "~/components/common/Button";
import HyperLinkIcon from "~/components/icons/HyperLinkIcon";
import { renderActionStatement, renderStatus } from "~/helpers";
import { useCreateUserTask } from "~/hooks/useTask";
import useUserProfileData from "~/hooks/useUserProfileData";

interface IViewUserTaskProps {
	selectedTask: ITaskWithPopulate;
	refetchTask: () => void;
	isFetchingTask: boolean;
}

const ViewUserTask: React.FC<IViewUserTaskProps> = ({
	selectedTask,
	refetchTask,
	isFetchingTask,
}) => {
	const { userId } = useUserProfileData();
	const { createUserTask, isPending, isSuccess } = useCreateUserTask();

	// function to refetch task after update
	useEffect(() => {
		if (isSuccess) {
			refetchTask();
		}
	}, [isSuccess]);

	const task: ICreateUserTask = {
		userId: userId!,
		taskId: selectedTask.id,
		taskPoints: selectedTask.points,
		expectedActions: selectedTask.expectedActions ? selectedTask.expectedActions : [],
		status: UserTaskStatus.IN_REVIEW,
	};

	return (
		<section className="space-y-5 flex flex-col">
			<section className="bg-textCardBg px-3 py-2 rounded-xl space-y-4">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textGray text-sm font-bold">Task Category</h3>
					<section className="text-textLight text-sm md:text-base md:font-semibold capitalize">
						{renderStatus(selectedTask?.category)}
					</section>
				</section>
				<section className="flex items-center justify-between py-3">
					<h3 className="text-textGray text-sm font-bold">Platform</h3>
					<section className="flex items-center gap-2">
						{selectedTask && selectedTask.platformId && (
							<Image
								src={selectedTask.platformId.logoUrl}
								width={24}
								height={24}
								alt={selectedTask.platformName || "Icon"}
								className="rounded-lg"
							/>
						)}
						<p className="text-textColor text-base font-medium capitalize">
							{selectedTask?.platformName}
						</p>
					</section>
				</section>
				{selectedTask.link && (
					<section className="flex items-center justify-between">
						<h3 className="text-textGray text-sm font-bold">Task Link</h3>
						<Link
							href={selectedTask.link}
							target="_blank"
							className="text-buttonColor md:font-bold md:text-base text-nowrap text-sm cursor-pointer flex items-center gap-2 border-b-[1px] border-buttonColor"
						>
							Click here to visit post <HyperLinkIcon />
						</Link>
					</section>
				)}
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<h3 className="text-textBlack text-sm md:text-base font-bold">Description</h3>
				<p className="text-textLight text-sm md:text-base font-normal">
					{selectedTask?.description}
				</p>
			</section>
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3">
				<h3 className="text-textBlack text-sm md:text-base font-bold">Expected Action</h3>
				<ul className="list-disc list-inside space-y-2">
					{selectedTask.expectedActions!.length >= 1 ? (
						selectedTask.expectedActions?.map((action, index) => (
							<li key={index} className="text-[#4A5264] font-medium text-sm">
								{renderActionStatement(action)}
							</li>
						))
					) : (
						<li className="text-[#4A5264] font-medium text-sm">
							{renderActionStatement(selectedTask?.category as TaskCategory)}
						</li>
					)}
				</ul>
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-5">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-textGray text-sm font-bold">Point</h3>
					<p className="text-textColor text-base font-medium md:font-semibold capitalize">
						{selectedTask?.points} points
					</p>
				</section>
				{selectedTask.dueDate && (
					<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
						<h3 className="text-textGray text-sm font-bold">Due Date</h3>
						<p className="text-[#4A5264] text-sm md:text-base font-medium md:font-semibold capitalize">
							{selectedTask.dueDate && new Date(selectedTask.dueDate).toDateString()}
						</p>
					</section>
				)}

				<section className="flex items-center justify-between pb-2">
					<h3 className="text-textGray text-sm font-bold">Status</h3>
					<section className="text-textLight text-base font-medium capitalize">
						{renderStatus(selectedTask.status)}
					</section>
				</section>
			</section>

			{selectedTask.status === UserTaskStatus.PENDING || isFetchingTask ? (
				<Button
					labelText="Mark as completed"
					onClick={() => createUserTask(task)}
					className="my-6 text-base min-w-[40%] font-bold self-center disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isPending || isFetchingTask}
					isProcessing={isPending || isFetchingTask}
				/>
			) : (
				<div className="text-[#0B411F] text-sm lg:text-lg my-5 border border-[#92ECB3] bg-[#E9FBF0] rounded-lg px-5 py-3 flex items-start lg:items-center gap-3">
					<FaRegCircleCheck color="#00944D" size={20} />
					{selectedTask.status === UserTaskStatus.IN_REVIEW
						? "Your task submission is currently been reviewed."
						: "Your task is completed."}
				</div>
			)}
		</section>
	);
};

export default ViewUserTask;
