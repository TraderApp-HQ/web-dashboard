import clsx from "clsx";
import React from "react";

interface RoundedTextDivProps {
	children: React.ReactNode;
	className?: string;
}

const RoundedTextDiv: React.FC<RoundedTextDivProps> = ({ children, className }) => {
	return (
		<div
			className={clsx(
				"flex items-center justify-start border border-[#DEE3F6] hover:border-blue-600 focus:border-blue-600 focus-within:border-blue-600 active:border-blue-600",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default RoundedTextDiv;
