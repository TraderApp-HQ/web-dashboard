import { useRouter } from "next/router";
import { useState } from "react";
import AdminLayout from "~/components/AdminLayout/Layout";
import TaskForm from "~/components/AdminLayout/taskCenter/TaskForm";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";
import Modal from "~/components/Modal";
import { useGetTask, useGetTaskPlatforms } from "~/hooks/useTask";

const UpdateTaskModal = () => {
	const [openTaskModal, setOpenTaskModal] = useState(true);
	const router = useRouter();
	const { taskId } = router.query;
	// Fetch task
	const { task, isLoading, isError, error } = useGetTask(taskId as string);

	// Fetch all platforms
	const { platforms } = useGetTaskPlatforms();

	const closeModal = () => {
		router.push("../");
		setOpenTaskModal(false);
	};

	return (
		<Modal
			title={
				isError ? (
					<p className="capitalize font-bold text-xl md:text-2xl text-red-400">
						{error?.message}
					</p>
				) : (
					<p className="capitalize font-bold text-xl md:text-2xl text-textColor">
						{task ? task.title : "Task Title"}
					</p>
				)
			}
			openModal={openTaskModal}
			onClose={closeModal}
		>
			<TaskForm
				onClose={closeModal}
				isLoading={isLoading}
				platforms={platforms!}
				task={task as ICreateTaskFormData}
			/>

		</Modal>
	);
};

UpdateTaskModal.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default UpdateTaskModal;
