import Button from "~/components/AccountLayout/Button";
import Modal from "~/components/Modal";

interface IConfirmationModalProps {
	title?: string;
	description?: string;
	btnConfirm: () => void;
	btnCancle: () => void;
	isProcessing?: boolean;
	openModal: boolean;
	onClose: () => void;
}

export default function ConfirmationModal({
	title,
	description,
	btnConfirm,
	btnCancle,
	openModal,
	onClose,
	isProcessing,
}: IConfirmationModalProps) {
	const handleModalClose = () => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<Modal
			title={title}
			description={description}
			openModal={openModal}
			width="md:w-[445px]"
			onClose={isProcessing ? undefined : handleModalClose}
		>
			<div className="flex gap-3 justify-center mt-5">
				<Button
					onClick={btnConfirm}
					innerClassName="text-white bg-rose-700 disabled:cursor-pointer"
					disabled={isProcessing}
				>
					{isProcessing ? "Processing..." : "Confirm"}
				</Button>
				<Button
					onClick={btnCancle}
					innerClassName="bg-gray-300 text-zinc-500"
					disabled={isProcessing}
				>
					Cancel
				</Button>
			</div>
		</Modal>
	);
}
