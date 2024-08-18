/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import React from "react";
import IconButton from "../IconButton";
import DropdownfilledIcon from "~/components/icons/DropdownfilledIcon";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";
import RightArrowIcon from "~/components/icons/RightArrowIcon";

export function TFooterData({ children }: { children: React.ReactNode }) {
	return (
		<td className=" h-10 px-4 py-3">
			<p className="text-cyan-950 text-xs font-light leading-none tracking-wide whitespace-nowrap">
				{children}
			</p>
		</td>
	);
}

interface DefaultTableFooterProps {
	children?: React.ReactNode;
	defaultFooter: boolean;
	position: "left" | "right";
	items: any;
	nextPage: () => void;
	previousPage: () => void;
	morePage: () => void;
}

interface TableFooterProps {
	children: React.ReactNode;
	defaultFooter?: boolean;
	position?: "left" | "right";
	items?: any;
	nextPage?: () => void;
	previousPage?: () => void;
	morePage?: () => void;
}

export function TFooter({
	children,
	defaultFooter,
	position,
	items,
	nextPage,
	previousPage,
	morePage,
}: DefaultTableFooterProps | TableFooterProps) {
	return (
		<tfoot
			className={clsx(
				"h-10 mt-4 grid px-4 items-center absolute w-full",
				position === "right" ? "justify-end" : "",
			)}
		>
			<tr>
				{defaultFooter ? (
					<div className="grid grid-cols-3 items-center gap-4">
						<TFooterData>
							<div className="flex justify-between">
								<p>Rows per page: 10</p>
								<IconButton
									Icon={DropdownfilledIcon}
									onClick={morePage}
									aria-label="more page"
									disabled={false}
								></IconButton>
							</div>
						</TFooterData>
						<TFooterData>
							1-{Math.min(10, items.length)} of {items.length}
						</TFooterData>
						<TFooterData>
							<div className="grid grid-cols-2">
								<IconButton
									Icon={LeftArrowIcon}
									onClick={previousPage}
									aria-label="Previous page"
									disabled={false}
								></IconButton>
								<IconButton
									Icon={RightArrowIcon}
									onClick={nextPage}
									aria-label="Next page"
									disabled={false}
								></IconButton>
							</div>
						</TFooterData>
					</div>
				) : (
					<div className="grid gap-x-8 items-center">{children}</div>
				)}
			</tr>
		</tfoot>
	);
}

export function TBodyData({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<td className={clsx("h-10 px-6 py-3 border-b border-slate-200", className)}>
			<p className="text-zinc-600 text-sm font-normal leading-none whitespace-nowrap">
				{children}
			</p>
		</td>
	);
}

export function TBodyRow({ children }: { children: React.ReactNode }) {
	return <tr>{children}</tr>;
}

export function TBody({ children }: { children: React.ReactNode }) {
	return <tbody>{children}</tbody>;
}

export function THeadData({ children }: { children: React.ReactNode }) {
	return (
		<th className="w-56 h-10 px-6 py-3">
			<h2 className="text-gray-950 text-sm font-bold leading-none whitespace-nowrap">
				{capitalizeFirstLetter(children as string)}
			</h2>
		</th>
	);
}

export function THead({ children }: { children: React.ReactNode }) {
	return (
		<thead className="border-b border-neutral-400 border-opacity-20">
			<tr>{children}</tr>
		</thead>
	);
}

export default function Table({ children }: { children: React.ReactNode }) {
	return (
		<div className="md:overflow-hidden overflow-x-scroll h-auto pb-16 pt-6 px-6 bg-white rounded-2xl relative">
			<table className="text-center items-center w-full">{children}</table>
		</div>
	);
}

function capitalizeFirstLetter(str: string) {
	if (str.length > 0) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	} else {
		return str;
	}
}
