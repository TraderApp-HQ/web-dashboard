import { useRouter } from "next/router";
import { useState } from "react";
import AdminLayout from "~/components/AdminLayout/Layout";
import TaskForm from "~/components/AdminLayout/taskCenter/TaskForm";
import Modal from "~/components/Modal";
import { useGetTaskPlatforms } from "~/hooks/useTask";

const CreateTask = () => {
	const [openTaskModal, setOpenTaskModal] = useState(true);
	const router = useRouter();

	// fetch all platforms
	const { isLoading, platforms } = useGetTaskPlatforms();

	const closeModal = () => {
		router.push(".");
		setOpenTaskModal(false);
	};

	return (
		<Modal
			title={
				<p className="capitalize font-bold text-xl md:text-2xl text-textColor">
					create new task
				</p>
			}
			description={
				<span className="font-normal text-sm md:text-base text-[#808080]">
					Please provide the information below
				</span>
			}
			headerDivider={true}
			openModal={openTaskModal}
			onClose={closeModal}
		>
			<TaskForm onClose={closeModal} isLoading={isLoading} platforms={platforms!} />
		</Modal>
	);
};

CreateTask.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default CreateTask;
