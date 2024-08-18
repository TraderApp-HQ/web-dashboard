import React from "react";
import type { ITBody, ITHead } from "./config";
import TableMenuDropdown from "./TableMenuDropdown";
import TableMenuItems from "./TableMenuitems";

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
}) => {
	return (
		<table className={`min-w-[1100px] w-full ${tableStyles}`}>
			<thead className={`border-b border-neutral-400 border-opacity-20 ${tableHeadStyles}`}>
				<tr>
					{tHead.map((th, index) => (
						<th
							key={index}
							className={`py-5 text-[#0A0D14] text-sm font-bold leading-none ${tableHeadItemStyles} ${th.styles ?? ""}`}
						>
							{th.displayItem}
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
						{tr.tBodyColumns.map((tc) => (
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
	);
};

export default DataTable;
