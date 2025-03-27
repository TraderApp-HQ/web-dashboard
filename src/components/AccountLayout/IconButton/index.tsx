import type { ReactNode } from "react";
import React from "react";
import clsx from "clsx";

export interface IconProps {
	className?: string;
	color?: string;
}

export interface IconButtonProps {
	Icon?: React.ComponentType<IconProps>;
	"aria-label"?: string;
	btnClass?: string;
	iconClass?: string;
	type?: "submit" | "button" | "reset";
	disabled?: boolean;
	reversed?: boolean;
	children?: ReactNode;
	onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
	children,
	btnClass,
	iconClass,
	type = "button",
	disabled = false,
	reversed = false,
	Icon,
	onClick,
	...otherProps
}) => {
	return (
		<button
			type={type} /* eslint-disable-line react/button-has-type */
			onClick={onClick}
			disabled={disabled}
			aria-label={otherProps["aria-label"]}
			className={clsx(
				`flex items-center justify-center p-1 transition focus:outline-none`,
				disabled && "cursor-not-allowed",
				reversed && "flex-row-reverse",
				"disabled:text-gray",
				btnClass,
			)}
		>
			{Icon && <Icon className={clsx(`inline-block flex-shrink-0`, iconClass)} />}
			{children && children}
		</button>
	);
};

export default IconButton;
