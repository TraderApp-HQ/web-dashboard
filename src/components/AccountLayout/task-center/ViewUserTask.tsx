import Image from "next/image";
import { useEffect } from "react";
import { ITaskWithPopulate, IUserTask } from "~/apis/handlers/users/interfaces";
import { UserTaskStatus } from "~/components/AdminLayout/taskCenter/taskFormData";
import Button from "~/components/common/Button";
import { renderStatus } from "~/helpers";
import { useCreateUserTask, useGetUserID } from "~/hooks/useTask";

interface IViewUserTaskProps {
	selectedTask: ITaskWithPopulate;
	closeModal: () => void;
}

const ViewUserTask: React.FC<IViewUserTaskProps> = ({ selectedTask, closeModal }) => {
	const userId = useGetUserID();
	const { createUserTask, isPending, isSuccess } = useCreateUserTask();

	// function to close modal
	useEffect(() => {
		if (isSuccess) {
			closeModal();
		}
	}, [isSuccess]);

	const task: IUserTask = {
		userId: userId!,
		taskId: selectedTask.id,
		taskPoints: selectedTask.points,
		expectedActions: selectedTask.expectedActions ? selectedTask.expectedActions : [],
		status: UserTaskStatus.IN_REVIEW,
	};

	return (
		<section className="space-y-5 flex flex-col items-center">
			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3 w-full">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2 px-3">
					<h3 className="text-[#414141] text-sm font-bold">Category</h3>
					<p className="text-textLight text-base font-semibold capitalize">
						{selectedTask?.category}
					</p>
				</section>
				<section className="flex items-center justify-between p-3">
					<h3 className="text-[#414141] text-sm font-bold">Platform Specific Task</h3>
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
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-3 w-full">
				<h3 className="text-textBlack text-base font-bold">Description</h3>
				<p className="text-textLight text-sm font-normal">{selectedTask?.description}</p>
			</section>

			<section className="bg-textCardBg px-3 py-4 rounded-xl space-y-5 w-full">
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-[#414141] text-sm font-bold">Point</h3>

					<section className="flex px-3 py-1.5 font-black rounded-lg justify-center items-center gap-2 bg-textCardBg">
						<div className={`p-1 rounded-full bg-[#08875D]`}></div>
						<div className="capitalize text-base font-semibold text-[#08875D]">
							{selectedTask?.points} points
						</div>
					</section>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-[#414141] text-sm font-bold">Due Date</h3>
					<p className="text-textLight text-base font-medium capitalize">
						{selectedTask.dueDate && new Date(selectedTask.dueDate).toDateString()}
					</p>
				</section>
				<section className="flex items-center justify-between border-b-[1px] border-[#D1D7F0] pb-2">
					<h3 className="text-[#414141] text-sm font-bold">Action</h3>
					<section className="flex items-center gap-3">
						{selectedTask.expectedActions?.map((action, index) => (
							<p
								key={index}
								className="text-textLight text-base font-medium capitalize"
							>
								{action}
							</p>
						))}
					</section>
				</section>
				<section className="flex items-center justify-between pb-2">
					<h3 className="text-[#414141] text-sm font-bold">Status</h3>
					<section className="text-textLight text-base font-medium capitalize">
						{renderStatus(selectedTask.status)}
					</section>
				</section>
			</section>

			{selectedTask.status === UserTaskStatus.PENDING && (
				<Button
					labelText="Mark as completed"
					onClick={() => {
						createUserTask(task);
					}}
					className="px-10 my-6 text-base w-[40%] font-bold"
					disabled={isPending}
				/>
			)}
		</section>
	);
};

export default ViewUserTask;
