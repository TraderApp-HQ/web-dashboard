import { useRouter } from "next/router";
import { useState } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import ViewUserTask from "~/components/AccountLayout/task-center/ViewUserTask";
import TaskViewLoader from "~/components/Loaders/TaskViewLoader";
import Modal from "~/components/Modal";
import { useGetUserTask } from "~/hooks/useTask";

const ViewTaskModal = () => {
	const [openTaskModal, setOpenTaskModal] = useState(true);
	const router = useRouter();
	const { taskId } = router.query;
	const { task, isLoading, isError, error } = useGetUserTask(taskId as string);

	const closeModal = () => {
		router.back();
		setOpenTaskModal(false);
	};

	return (
		<Modal
			title={
				<p className="capitalize md:font-bold text-base md:text-2xl pl-2 text-[#414141]">
					{task ? task.title : "Task Title"}
				</p>
			}
			openModal={openTaskModal}
			onClose={closeModal}
		>
			{isLoading ? (
				<TaskViewLoader />
			) : isError && !task ? (
				<section className="bg-white text-red-400 flex items-center justify-center rounded-md mt-6">
					{error?.message}
				</section>
			) : (
				task && <ViewUserTask selectedTask={task} closeModal={closeModal} />
			)}
		</Modal>
	);
};

ViewTaskModal.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default ViewTaskModal;
