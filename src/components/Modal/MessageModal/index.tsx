import type { IModalOptions, IconProps } from "~/lib/types";

import type { JSXElementConstructor } from "react";
import Modal from "~/components/Modal";

interface DeleteModalProps extends IModalOptions {
	title: string;
	description: string;
	icon: JSXElementConstructor<IconProps>;
}

export default function MessageModal({
	title,
	description,
	icon: Icon,
	openModal,
	onClose,
}: DeleteModalProps) {
	const handleMeClose = () => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<div data-testid="message-modal">
			<Modal
				title={title}
				description={description}
				openModal={openModal}
				width="md:w-[445px]"
				onClose={handleMeClose}
			>
				<div className="flex flex-col gap-5 text-center items-center">
					<h2 className="text-slate-900 text-2xl font-semibold leading-10">{title}</h2>
					<Icon className={"inline-block flex-shrink-0"} />
					<h3 className="text-center text-gray-700 text-base font-medium">
						{description}
					</h3>
				</div>
			</Modal>
		</div>
	);
}
