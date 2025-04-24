/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import CancelIcon from "../icons/CancelIcon";
import { FiArrowDownCircle } from "react-icons/fi";

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
	const close = useCallback(() => {
		if (onClose) {
			onClose();
		}
	}, [onClose]);

	const ref = useRef<HTMLDivElement | null>(null);
	const scrollableContentRef = useRef<HTMLDivElement | null>(null);
	const [showScrollHint, setShowScrollHint] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event: { target: any }) => {
			if (ref.current && !ref.current.contains(event.target)) {
				close();
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [close]);

	const handleScrollHintVisibility = () => {
		const element = scrollableContentRef.current;
		if (element) {
			const isScrollable = element.scrollHeight > element.clientHeight;
			const isNearBottom =
				element.scrollHeight - element.scrollTop - element.clientHeight < 30;
			setShowScrollHint(isScrollable && !isNearBottom);
		}
	};

	const scrollToBottom = () => {
		const element = scrollableContentRef.current;
		if (element) {
			element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
		}
	};

	useEffect(() => {
		const element = scrollableContentRef.current;
		if (element) {
			handleScrollHintVisibility();
			element.addEventListener("scroll", handleScrollHintVisibility);
			const resizeObserver = new ResizeObserver(handleScrollHintVisibility);
			resizeObserver.observe(element);

			return () => {
				element.removeEventListener("scroll", handleScrollHintVisibility);
				resizeObserver.disconnect();
			};
		}
	}, []);

	return (
		<div
			className={clsx(
				"bg-gray-600 bg-opacity-70 flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full",
				openModal ? "" : "hidden",
			)}
		>
			<div ref={ref} className={clsx("w-full relative max-w-2xl p-2 md:p-4", width)}>
				<div className="bg-white relative rounded-xl py-8 md:px-8 px-4 shadow max-h-[70vh] flex flex-col">
					<div
						className={`flex items-start justify-between w-full pb-2 ${headerDivider && "border-b-2 border-[#D1D7F0]"}`}
					>
						<div className="flex flex-col space-y-3 flex-1">
							<h1 className="text-xl flex items-center gap-x-1 font-semibold capitalize text-[#414141]">
								{showBackButton && backBtnIcon && backBtnIcon}
								{title}
							</h1>
							<p className="text-[12px] text-[#BEBFC1]">{description}</p>
						</div>
						<div className="cursor-pointer ml-4" onClick={close} aria-label="close">
							<CancelIcon />
						</div>
					</div>

					<div
						ref={scrollableContentRef}
						className={`relative overflow-y-auto h-full scrollbar-hide ${className}`}
					>
						{children}
					</div>

					{showScrollHint && (
						<button
							onClick={scrollToBottom}
							className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 p-1 bg-white rounded-full shadow-md text-blue-600 hover:bg-gray-100 transition-all opacity-75 hover:opacity-100"
							aria-label="Scroll to bottom"
						>
							<FiArrowDownCircle size={25} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
