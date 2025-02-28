/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { ReactNode, useEffect, useRef } from "react";
import CancelIcon from "../icons/CancelIcon";

export interface ModalOptions {
	children: React.ReactNode;
	openModal?: boolean;
	onClose?: () => void;
	width?: string;
	title?: string | ReactNode;
	description?: string | ReactNode;
	headerDivider?: boolean;
	backBtnIcon?: React.ReactNode;
	showBackButton?: boolean;
	className?: string;
}

const Modal: React.FC<ModalOptions> = ({
	children,
	openModal,
	onClose,
	width,
	title,
	description,
	headerDivider = false,
	backBtnIcon,
	showBackButton,
	className,
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
				className={clsx("w-full relative max-w-2xl p-2 md:p-4", width)}
				style={{ maxHeight: "90vh" }} // Modal height is limited to 90% of the viewport height
			>
				<div
					className="bg-white relative rounded-xl py-6 md:px-8 px-2 shadow"
					style={{ maxHeight: "100%", display: "flex", flexDirection: "column" }}
				>
					<div
						className={`flex items-start justify-between w-full pb-2 ${headerDivider && "border-b-2 border-[#D1D7F0]"}`}
					>
						<div className="flex flex-col space-y-3 flex-1">
							<h1 className="text-xl flex items-center gap-x-1 font-semibold text-[#414141]">
								{showBackButton && backBtnIcon && backBtnIcon}
								{title}
							</h1>
							<p className="text-[12px] text-[#BEBFC1]">{description}</p>
						</div>
						<div className="cursor-pointer ml-4" onClick={close}>
							<CancelIcon />
						</div>
					</div>

					{/* Scrollable content & hides scrollbar*/}
					<div
						className={`overflow-y-auto scrollbar-hide ${className}`}
						style={{
							maxHeight: "calc(100vh - 200px)",
						}}
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
