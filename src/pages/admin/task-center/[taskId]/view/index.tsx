import { useRouter } from "next/router";
import { useState } from "react";
import AdminLayout from "~/components/AdminLayout/Layout";
import ViewTask from "~/components/AdminLayout/taskCenter/ViewTask";
import Modal from "~/components/Modal";
import { useGetTask } from "~/hooks/useTask";

const ViewTaskModal = () => {
	const [openTaskModal, setOpenTaskModal] = useState(true);
	const router = useRouter();
	const { taskId } = router.query;
	const { task, isLoading, isError, error } = useGetTask(taskId as string);

	const closeModal = () => {
		router.push("../");
		setOpenTaskModal(false);
	};

	return (
		<Modal
			title={
				<p className="capitalize font-bold text-xl md:text-2xl text-textColor">
					{task ? task.title : "Task Title"}
				</p>
			}
			openModal={openTaskModal}
			onClose={closeModal}
		>
			{isLoading ? (
				<section>Fetching task...</section>
			) : isError && !task ? (
				<section>{error?.message}</section>
			) : (
				task && <ViewTask selectedTask={task} />
			)}
		</Modal>
	);
};

ViewTaskModal.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default ViewTaskModal;
