/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useEffect, useRef } from "react";
import CancelIcon from "../icons/CancelIcon";

export interface ModalOptions {
	children: React.ReactNode;
	openModal?: boolean;
	onClose?: () => void;
	width?: string;
	title?: string;
	description?: string;
}

const Modal: React.FC<ModalOptions> = ({
	children,
	openModal,
	onClose,
	width,
	title,
	description,
}) => {
	function close() {
		if (onClose) {
			onClose();
		}
	}

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: { target: any }) => {
			if (ref.current && !ref.current.contains(event.target)) {
				close && close();
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [close]);

	return (
		<div
			className={clsx(
				"bg-gray-600 bg-opacity-70 flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full",
				openModal ? "" : "hidden",
			)}
		>
			<div
				ref={ref}
				className={clsx("w-full relative max-w-4xl p-4", width)}
				style={{ maxHeight: "90vh" }} // Modal height is limited to 90% of the viewport height
			>
				<div
					className="bg-white relative rounded-xl py-6 px-8 shadow"
					style={{ maxHeight: "100%", display: "flex", flexDirection: "column" }}
				>
					<div className="flex items-center justify-between pb-4">
						<div className="space-y-3 flex-col">
							<p className="text-xl font-semibold text-[#414141]">{title}</p>
							<p className="text-[12px] text-[#BEBFC1]">{description}</p>
						</div>
						<div className="cursor-pointer" onClick={close}>
							<CancelIcon />
						</div>
					</div>

					{/* Scrollable content */}
					<div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
