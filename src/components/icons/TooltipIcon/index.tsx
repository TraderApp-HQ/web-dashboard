import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";

export type TooltipDirection = "top" | "bottom" | "left" | "right";

export interface TooltipIconProps {
	direction?: TooltipDirection;
	icon: React.ReactNode;
	className?: string;
	contentClassName?: string;
	maxWidth?: string;
	minWidth?: string;
	visible?: boolean;
	text: string;
	tooltipBgColor?: string;
	tooltipTextColor?: string;
	usePortal?: boolean;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({
	direction = "top",
	icon,
	className = "",
	contentClassName = "",
	maxWidth = "150px",
	minWidth = "150px",
	visible,
	text,
	tooltipTextColor = "text-gray-600",
	usePortal = false,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);

	const updatePosition = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

			let top = rect.top + scrollTop;
			let left = rect.left + scrollLeft + rect.width / 2;

			switch (direction) {
				case "top":
					top = rect.top + scrollTop - 10;
					break;
				case "bottom":
					top = rect.bottom + scrollTop + 10;
					break;
				case "left":
					top = rect.top + scrollTop + rect.height / 2;
					left = rect.left + scrollLeft - 10;
					break;
				case "right":
					top = rect.top + scrollTop + rect.height / 2;
					left = rect.right + scrollLeft + 10;
					break;
			}

			setPosition({ top, left });
		}
	};

	useEffect(() => {
		if (isVisible && usePortal) {
			updatePosition();
			window.addEventListener("scroll", updatePosition);
			window.addEventListener("resize", updatePosition);

			return () => {
				window.removeEventListener("scroll", updatePosition);
				window.removeEventListener("resize", updatePosition);
			};
		}
	}, [isVisible, usePortal]);

	const getPointerClasses = () => {
		switch (direction) {
			case "top":
				return {
					container: usePortal
						? "transform -translate-x-1/2 -translate-y-full"
						: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
					pointerBorder:
						"before:top-full before:left-1/2 before:-ml-2 before:border-t-gray-300",
					pointerBg:
						"after:top-full after:left-1/2 after:-ml-[7px] after:!border-t-[#3E5BD2]",
				};
			case "bottom":
				return {
					container: usePortal
						? "transform -translate-x-1/2"
						: "top-full left-1/2 transform -translate-x-1/2 mt-2",
					pointerBorder:
						"before:bottom-full before:left-1/2 before:-ml-2 before:border-b-gray-300",
					pointerBg:
						"after:bottom-full after:left-1/2 after:-ml-[7px] after:!border-b-[#3E5BD2]",
				};
			case "left":
				return {
					container: usePortal
						? "transform -translate-y-1/2"
						: "right-full top-1/2 transform -translate-y-1/2 mr-2",
					pointerBorder:
						"before:left-full before:top-1/2 before:-mt-2 before:border-l-gray-300",
					pointerBg:
						"after:left-full after:top-1/2 after:-mt-[7px] after:!border-l-[#3E5BD2]",
				};
			case "right":
				return {
					container: usePortal
						? "transform -translate-y-1/2"
						: "left-full top-1/2 transform -translate-y-1/2 ml-2",
					pointerBorder:
						"before:right-full before:top-1/2 before:-mt-2 before:border-r-gray-300",
					pointerBg:
						"after:right-full after:top-1/2 after:-mt-[7px] after:!border-r-[#3E5BD2]",
				};
			default:
				return {
					container: usePortal
						? "transform -translate-x-1/2"
						: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
					pointerBorder:
						"before:top-full before:left-1/2 before:-ml-2 before:border-t-gray-300",
					pointerBg:
						"after:top-full after:left-1/2 after:-ml-[7px] after:!border-t-[#3E5BD2]",
				};
		}
	};

	const pointerClasses = getPointerClasses();
	const shouldShow = visible !== undefined ? visible : isVisible;

	const tooltipContent = (
		<div
			className={`absolute z-50 p-2 text-[12px] w-fit ${tooltipTextColor} bg-[#3E5BD2] border border-gray-300 rounded shadow-sm w-auto text-center font-light leading-normal ${shouldShow ? "visible" : "invisible"} ${pointerClasses.container} ${contentClassName} before:content-[''] before:absolute before:border-8 before:border-solid before:border-transparent after:content-[''] after:absolute after:border-[7px] after:border-solid after:border-transparent ${pointerClasses.pointerBorder} ${pointerClasses.pointerBg}`}
			style={
				usePortal
					? {
							minWidth,
							maxWidth,
							top: position.top,
							left: position.left,
							position: "fixed",
						}
					: { minWidth, maxWidth }
			}
		>
			{text}
		</div>
	);

	return (
		<div
			ref={triggerRef}
			className={clsx("relative inline-block group", className)}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{icon}{" "}
			{usePortal && typeof window !== "undefined"
				? createPortal(tooltipContent, document.body)
				: tooltipContent}
		</div>
	);
};

export default TooltipIcon;
