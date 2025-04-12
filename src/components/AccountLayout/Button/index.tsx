import clsx from "clsx";
import type { ReactNode, MouseEventHandler } from "react";
import React, { useMemo } from "react";

interface ButtonProps {
	children: ReactNode;
	className?: string;
	innerClassName?: string;
	onClick?: MouseEventHandler;
	disabled?: boolean;
	fluid?: boolean;
	bgColor?: string;
	color?: string;
	size?: "small" | "medium";
	type?: "submit" | "reset" | "button";
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	children,
	size = "medium",
	disabled,
	fluid,
	onClick,
	className,
	innerClassName,
	type = "button",
	color,
	bgColor,
	isLoading,
}) => {
	const sizeClassnames = useMemo<string>(() => {
		switch (size) {
			case "small": {
				return "px-3 h-12";
			}

			case "medium": {
				return "px-6 h-12";
			}
		}
	}, [size]);
	return (
		<span
			className={clsx("inline-flex rounded-md justify-center", fluid && "w-full", className)}
		>
			<button
				type={type} /* eslint-disable-line react/button-has-type */
				className={clsx(
					"inline-flex justify-center items-center font-semibold leading-4 first-letter:uppercase rounded-lg border border-transparent transition focus:outline-none hover:bg-blue-dark active:bg-blue-dark focus:bg-blue-dark disabled:bg-gray-400",
					color ?? "text-white",
					sizeClassnames,
					disabled && "cursor-not-allowed !opacity-50 !bg-blue-800",
					fluid && "w-full",
					innerClassName,
					bgColor ?? "bg-blue-800",
				)}
				onClick={onClick}
				disabled={disabled}
			>
				{isLoading ? "Processing..." : children}
			</button>
		</span>
	);
};

export default Button;
