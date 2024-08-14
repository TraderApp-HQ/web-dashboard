import React from "react";
import clsx from "clsx";
import Link from "next/link";

type TextProps = React.HTMLAttributes<HTMLDivElement> & {
	component: "text";
};

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string;
	component: "link";
};

type LinkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	component: "button";
};

type DropdownMenuItemProps = TextProps | LinkProps | LinkButtonProps;

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = (props) => {
	const { children, className, ...rest } = props;

	switch (props.component) {
		case "button":
			return (
				<button
					type="button"
					onClick={props.onClick}
					className={clsx(
						"block py-2 px-4 w-full text-sm hover:text-blue-800 focus:bg-gray-lighter transition cursor-pointer focus:outline-none text-[#9CA3AF] font-extrabold",
						className,
					)}
					{...(rest as LinkButtonProps)}
				>
					{children}
				</button>
			);

		case "link":
			const { href, ...linkRest } = rest as LinkProps;
			return (
				<Link href={href}>
					<a
						className={clsx(
							"block py-2 px-4 text-sm hover:text-blue-800 text-left transition cursor-pointer text-[#9CA3AF] font-extrabold",
							className,
						)}
						{...linkRest}
					>
						{children}
					</a>
				</Link>
			);

		case "text":
		default:
			return (
				<div className={clsx("block py-2 px-4", className)} {...(rest as TextProps)}>
					{children}
				</div>
			);
	}
};
