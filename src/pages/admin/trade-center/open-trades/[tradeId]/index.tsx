import { useRouter } from "next/router";
import React, { useState } from "react";
import AdminLayout from "~/components/AdminLayout/Layout";
import Modal from "~/components/Modal";

const ViewTradeAnalysis = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
	const { action } = router.query;

	const handleModalClose = () => {
		router.push(".");
		setIsModalOpen(!isModalOpen);
	};

	return (
		<Modal
			openModal={isModalOpen}
			title={
				<p
					data-testid="trade-modal-form"
					className="font-bold text-lg md:text-2xl text-textColor flex items-center"
				>
					View Trade Analysis
				</p>
			}
			headerDivider={true}
			onClose={handleModalClose}
		>
			<div>
				<h1>View Trade analysis</h1>
				<p>{action}</p>
			</div>
		</Modal>
	);
};

ViewTradeAnalysis.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default ViewTradeAnalysis;
