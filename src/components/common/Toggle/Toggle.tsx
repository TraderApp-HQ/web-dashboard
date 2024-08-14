import React from "react";
import clsx from "clsx";

interface ToggleProps {
	label: React.ReactNode;
	isToggledOn: boolean;
	onClick: () => void;
	className?: string;
}

export default function Toggle({ label, isToggledOn, onClick, className }: ToggleProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				"group flex items-center font-black cursor-pointer focus:outline-none",
				isToggledOn ? "text-blue-800" : "text-neutral-700",
				className,
			)}
		>
			<span className="mr-2">{label}</span>

			<span
				role="checkbox"
				tabIndex={0}
				aria-checked={isToggledOn}
				className="inline-flex relative flex-shrink-0 justify-center items-center w-10 h-5 active:text-blue-800 cursor-pointer focus:outline-none"
			>
				<span
					aria-hidden="true"
					className={clsx(
						"absolute mx-auto w-9 h-6 rounded-xl border border-neutral-700 transition-colors duration-200",
						isToggledOn ? "bg-blue-800" : "bg-neutral-700",
					)}
				/>
				<span
					aria-hidden="true"
					className={clsx(
						"inline-block absolute left-0 w-5 h-5 bg-white rounded-full border border-neutral-700 group-focus:border-blue-800 transition-transform duration-200 transform translate-x-0",
						isToggledOn && "translate-x-5",
					)}
				/>
			</span>
		</button>
	);
}
