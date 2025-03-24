/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ItemType } from "~/config/constants";

interface DropdownMenuProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	direction?: "top" | "bottom";
	position?: "left" | "right";
	className?: string;
	subClass?: string;
	btnClass?: string;
	itemType?: string;
	containerClassName?: string;
}

type TextProps = {
	className?: string;
	type?: "text";
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LinkProps = {
	to: string;
	type?: "link";
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LinkButtonProps = {
	type: "button";
	children: ReactNode;
	className?: string;
	onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function DropdownMenu({
	trigger,
	children,
	direction,
	position,
	className,
	subClass,
	btnClass,
	itemType = ItemType.text,
	containerClassName,
}: DropdownMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: { target: any }) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsOpen && setIsOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [setIsOpen]);

	return (
		<div ref={ref} className={`relative ${containerClassName || "ml-3 w-fit"}`}>
			<button
				type="button"
				onClick={() => {
					setIsOpen(!isOpen);
				}}
				className={btnClass}
				data-testid="drop-down-button"
			>
				<div className="justify-center items-center gap-2.5 inline-flex">{trigger}</div>
			</button>
			{isOpen && (
				<div
					className={clsx(
						"absolute z-50 mt-2 bg-white p-4 border border-gray-100 rounded-md shadow-lg origin-top",
						position === "left" ? "right-0" : "left-0",
						direction === "top" && "bottom-5",
						className,
					)}
				>
					{itemType === "text" ? (
						<div className={clsx(subClass)}>{children}</div>
					) : (
						<div
							onClick={() => {
								setIsOpen(!isOpen);
							}}
							className={clsx("", subClass)}
						>
							{children}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export function DropdownMenuItem({ children, ...props }: LinkProps | LinkButtonProps | TextProps) {
	switch (props.type) {
		case "button": {
			return (
				<button
					type="button"
					onClick={props.onClick}
					className={clsx(
						"block py-2 px-4 text-sm hover:text-blue-800 focus:bg-gray-lighter transition cursor-pointer focus:outline-none text-[#9CA3AF] font-extrabold",
						props.className,
					)}
				>
					{children}
				</button>
			);
		}

		case "link": {
			return (
				<Link
					href={props.to}
					className={clsx(
						"block py-2 px-4 text-sm hover:text-blue-800 text-left transition cursor-pointer text-[#9CA3AF] font-extrabold",
						props.className,
					)}
				>
					{children}
				</Link>
			);
		}

		case "text":
		default: {
			return <div className={clsx("block py-2 px-4", props.className)}>{children}</div>;
		}
	}
}
