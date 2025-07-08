import React from "react";
import clsx from "clsx";

export type TooltipDirection = "top" | "bottom" | "left" | "right";

export interface TooltipIconProps {
	direction?: TooltipDirection;
	icon: React.ReactNode;
	className?: string;
	contentClassName?: string;
	maxWidth?: string;
	minWidth?: string;
	visible?: boolean;
	text: string | string[];
	tooltipBgColor?: string;
	tooltipTextColor?: string;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({
	direction = "top",
	icon,
	className = "",
	contentClassName = "",
	maxWidth = "xs",
	minWidth = "150px",
	visible,
	text,
	tooltipTextColor = "text-gray-600",
}) => {
	const getPointerClasses = () => {
		switch (direction) {
			case "top":
				return {
					container: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
					pointerBorder:
						"before:top-full before:left-1/2 before:-ml-2 before:border-t-gray-300",
					pointerBg:
						"after:top-full after:left-1/2 after:-ml-[7px] after:!border-t-[#3E5BD2]",
				};
			case "bottom":
				return {
					container: "top-full left-1/2 transform -translate-x-1/2 mt-2",
					pointerBorder:
						"before:bottom-full before:left-1/2 before:-ml-2 before:border-b-gray-300",
					pointerBg:
						"after:bottom-full after:left-1/2 after:-ml-[7px] after:!border-b-[#3E5BD2]",
				};
			case "left":
				return {
					container: "right-full top-1/2 transform -translate-y-1/2 mr-2",
					pointerBorder:
						"before:left-full before:top-1/2 before:-mt-2 before:border-l-gray-300",
					pointerBg:
						"after:left-full after:top-1/2 after:-mt-[7px] after:!border-l-[#3E5BD2]",
				};
			case "right":
				return {
					container: "left-full top-1/2 transform -translate-y-1/2 ml-2",
					pointerBorder:
						"before:right-full before:top-1/2 before:-mt-2 before:border-r-gray-300",
					pointerBg:
						"after:right-full after:top-1/2 after:-mt-[7px] after:!border-r-[#3E5BD2]",
				};
			default:
				return {
					container: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
					pointerBorder:
						"before:top-full before:left-1/2 before:-ml-2 before:border-t-gray-300",
					pointerBg:
						"after:top-full after:left-1/2 after:-ml-[7px] after:!border-t-[#3E5BD2]",
				};
		}
	};

	const pointerClasses = getPointerClasses();

	return (
		<div className={clsx("relative inline-block group", className)}>
			{icon}
			<div
				className={`absolute z-50 p-2 text-[12px] ${tooltipTextColor} bg-[#3E5BD2] border border-gray-300 rounded shadow-sm w-auto text-center font-light leading-normal max-w-${maxWidth} ${visible ? "visible" : "invisible group-hover:visible"} ${pointerClasses.container} ${contentClassName} before:content-[''] before:absolute before:border-8 before:border-solid before:border-transparent after:content-[''] after:absolute after:border-[7px] after:border-solid after:border-transparent ${pointerClasses.pointerBorder} ${pointerClasses.pointerBg}`}
				style={{ minWidth }}
			>
				{typeof text === "string"
					? text
					: text?.map((line, index) => (
							<ul key={index} className="list-disc list-inside">
								<li className="">{line}</li>
							</ul>
						))}
			</div>
		</div>
	);
};

export default TooltipIcon;
