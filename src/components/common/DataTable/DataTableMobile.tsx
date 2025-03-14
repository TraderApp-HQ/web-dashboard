import type { FC } from "react";
import React from "react";
import type { ITableMobile } from "./config";
import TableMenuDropdown from "./TableMenuDropdown";
import SearchForm from "~/components/AccountLayout/SearchForm";
import DropdownMenu from "~/components/AccountLayout/DropdownMenu";
import { FiHelpCircle } from "react-icons/fi";
import TooltipIcon from "../../icons/TooltipIcon";

interface IDataTableMobile {
	data: ITableMobile[];
	hasActions?: boolean;
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
}

const DataTableMobile: FC<IDataTableMobile> = ({
	data,
	hasActions = true,
	searchProps,
	showSearch,
	showFilter,
	filterProps,
}) => {
	return (
		<>
			<div className="flex flex-col mb-4 rounded-lg p-3 bg-white">
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
						btnClass={`w-full h-12 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border ${filterProps.className}`}
						containerClassName="w-full"
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
			<div data-testid="table-data-mobile">
				{data.map((dataItem, index) => (
					<div className="border-2 rounded-lg py-5 px-3 bg-white mb-6" key={index}>
						<div className="flex items-center justify-between mb-4">
							<div className={`${dataItem.tHead.styles ?? ""}`}>
								{dataItem.tHead.displayItemTitle}
							</div>
							{hasActions && (
								<div>
									<TableMenuDropdown
										dataTableMenuItems={dataItem.actions ?? []}
									/>
								</div>
							)}
						</div>
						{dataItem.tBody.map((tb, index) => {
							if (!tb) {
								return;
							}
							return (
								<div
									key={index}
									className={`flex justify-between items-center ${
										index < dataItem.tBody.length - 1 ? "border-b mb-4" : ""
									} border-[#E5E7EB] border-opacity-20 pb-3 py-2 ${tb.styles ?? ""}`}
								>
									<div className="text-sm text-[#9CA3AF] w-[40%]">
										{/* {tb.displayItemTitle} */}
										{tb.tooltip ? (
											<div className="flex items-center gap-1">
												{tb.displayItemTitle}
												<TooltipIcon
													direction="right"
													icon={
														<FiHelpCircle
															size={16}
															className="text-gray-400 cursor-help"
														/>
													}
													text={tb.tooltip.text}
												/>
											</div>
										) : (
											tb.displayItemTitle
										)}
									</div>
									<div className="mr-4 text-base text-[#0C394B] font-semibold w-[60%] text-right">
										{tb.displayItemValue}
									</div>
								</div>
							);
						})}
					</div>
				))}
			</div>
		</>
	);
};

export default DataTableMobile;
