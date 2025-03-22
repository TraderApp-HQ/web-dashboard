import React from "react";
import type { ITBody, ITHead } from "./config";
import TableMenuDropdown from "./TableMenuDropdown";
import TableMenuItems from "./TableMenuitems";
import SearchForm from "~/components/AccountLayout/SearchForm";
import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import Pagination from "~/components/Pagination";
import { FiHelpCircle } from "react-icons/fi";
import TooltipIcon from "../../icons/TooltipIcon";
import { PaginationProps } from "~/components/interfaces";

interface IDataTable {
	tHead: ITHead[];
	tBody: ITBody;
	hasActions?: boolean;
	hasMenueItems?: boolean;
	menueItemType?: "button" | "icon-button";
	justifyMenueItem?: string;
	tableStyles?: string;
	tableHeadStyles?: string;
	tableHeadItemStyles?: string;
	tableRowItemStyles?: string;
	showSearch?: boolean;
	searchProps?: {
		onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		placeholder: string;
		defaultValue?: string;
		className?: string;
	};
	showFilter?: boolean;
	filterProps?: {
		triggerText: string;
		filterContent: React.ReactNode;
		className?: string;
	};
	showPagination?: boolean;
	paginationProps?: PaginationProps;
}

const DataTable: React.FC<IDataTable> = ({
	tHead,
	tBody,
	hasActions = true,
	hasMenueItems,
	menueItemType,
	justifyMenueItem,
	tableStyles,
	tableHeadStyles,
	tableHeadItemStyles,
	tableRowItemStyles,
	showSearch = false,
	searchProps,
	showFilter = false,
	filterProps,
	showPagination,
	paginationProps,
}) => {
	return (
		<>
			<div className="flex justify-between mb-5">
				{showSearch && searchProps && (
					<SearchForm
						{...searchProps}
						placeHolder={searchProps.placeholder}
						aria-label="search"
						marginTop="mt-0"
					/>
				)}

				{showFilter && filterProps && (
					<DropdownMenu
						className="w-[256px]"
						btnClass={`w-24 h-12 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border ${filterProps.className}`}
						trigger={
							<>
								<div className="text-textGray text-sm font-normal leading-snug">
									{filterProps.triggerText || "Filter"}
								</div>
							</>
						}
						position="left"
					>
						{filterProps.filterContent}
					</DropdownMenu>
				)}
			</div>
			<table data-testid="table-data" className={`min-w-[1100px] w-full ${tableStyles}`}>
				<thead
					className={`border-b border-neutral-400 border-opacity-20 ${tableHeadStyles}`}
				>
					<tr>
						{tHead.map((th, index) => (
							<th
								key={index}
								className={`py-5 text-[#0A0D14] text-sm font-bold leading-none ${tableHeadItemStyles} ${th.styles} ${th.isAssetItem ? "" : ""}`}
							>
								{th.tooltip ? (
									<div
										className={`flex items-center gap-1 ${th.styles?.includes("text-left") ? "justify-start" : "justify-center"} `}
									>
										{th.displayItem}
										<TooltipIcon
											direction="top"
											icon={
												<FiHelpCircle
													size={16}
													className="text-gray-400 cursor-help"
												/>
											}
											text={th.tooltip.text}
											contentClassName="bg-[#3E5BD2] text-white !text-left after:!border-t-[#3E5BD2] border-2"
										/>
									</div>
								) : (
									th.displayItem
								)}
							</th>
						))}
						{hasActions && (
							<th
								className={`py-5 text-[#0A0D14] text-sm font-bold leading-none ${tableHeadItemStyles}`}
							>
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{tBody.tBodyRows.map((tr, index) => (
						<tr key={index}>
							{tr.tBodyColumns.map((tc, index) => (
								<td
									key={index}
									className={`py-5 border-b text-sm border-slate-200 text-zinc-600 font-normal leading-none whitespace-nowrap ${tableRowItemStyles} ${
										tc.styles ?? ""
									}`}
								>
									{tc.displayItem}
								</td>
							))}
							{hasActions && (
								<td
									className={`py-5 border-b text-sm border-slate-200 text-zinc-600 font-normal leading-none whitespace-nowrap ${tableRowItemStyles}`}
								>
									{hasMenueItems ? (
										<TableMenuItems
											dataTableMenuItems={tr.actions ?? []}
											menueItemType={menueItemType}
											justifyMenueItem={justifyMenueItem}
										/>
									) : (
										<TableMenuDropdown dataTableMenuItems={tr.actions ?? []} />
									)}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
			{showPagination && paginationProps && (
				<div className="mt-9">
					<Pagination {...paginationProps} />
				</div>
			)}
		</>
	);
};

export default DataTable;
