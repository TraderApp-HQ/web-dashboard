import type { IModalOptions } from "~/lib/types";

import Button from "~/components/AccountLayout/Button";
import Modal from "~/components/Modal";

interface DeleteModalProps extends IModalOptions {
	title: string;
	description: string;
	btnConfirm: () => void;
	btnCancle: () => void;
}

export default function DeleteModal({
	title,
	description,
	btnConfirm,
	btnCancle,
	openModal,
	onClose,
}: DeleteModalProps) {
	const handleMeClose = () => {
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
			onClose={handleMeClose}
		>
			{/* <div className="flex flex-col gap-5 text-center">
        <h2 className="text-slate-900 text-2xl font-semibold leading-10">{title}</h2>
        <h3 className="text-center text-gray-700 text-base font-medium">{description}</h3> */}
			<div className="flex gap-3 justify-center mt-5">
				<Button onClick={btnConfirm} innerClassName="text-white bg-rose-700">
					Confirm
				</Button>
				<Button onClick={btnCancle} innerClassName="bg-gray-300 text-zinc-500">
					Cancel
				</Button>
			</div>
			{/* </div> */}
		</Modal>
	);
}
