import React from "react";
import ExamplePagination from "./ExamplePagination";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";
import type { ISelectBoxOption, PaginationButtonProps, PaginationProps } from "../interfaces";
import SelectBox from "../common/SelectBox";

const PaginationButton: React.FC<PaginationButtonProps> = ({
	onClick,
	disabled,
	testId,
	direction,
	className = "px-1 md:px-3 py-1 rounded disabled:cursor-not-allowed text-sm",
}) => {
	return (
		<button data-testid={testId} onClick={onClick} className={className} disabled={disabled}>
			{direction === "left" ? (
				<FiChevronLeft size={20} color="#AAB7C6" />
			) : (
				<FiChevronRight size={20} color="#AAB7C6" />
			)}
		</button>
	);
};

/**
 * Pagination component for navigating between pages.
 */
const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	totalRecord,
	rowsPerPage,
	setRowsPerPage,
	onNext,
	onPrev,
}) => {
	const handleNext = () => {
		if (currentPage < totalPages) {
			onNext(currentPage + 1);
		}
	};

	const handlePrev = () => {
		if (currentPage > 1) {
			onPrev(currentPage - 1);
		}
	};

	const calculateRowsPerPageOptions = (totalRecord: number): ISelectBoxOption[] => {
		const options: number[] = [];
		let value = 5;

		while (value < totalRecord) {
			options.push(value);
			value *= 2;
		}

		options.push(value);

		return options.map((num) => ({
			value: num.toString(),
			displayText: num.toString(),
		}));
	};

	const PagingComponent = ({ className }: { className?: string }) => {
		return (
			<div className={clsx(`mb-0 flex items-center`, className)}>
				<span className="inline-block text-[#072F40] text-[14px] md:text-[15px] md:mr-2">
					Items per page:
				</span>
				<SelectBox
					options={calculateRowsPerPageOptions(totalRecord)}
					option={{ value: rowsPerPage.toString(), displayText: rowsPerPage.toString() }}
					setOption={(selected) => setRowsPerPage(Number(selected.value))}
					bgColor="bg-gray-100"
					containerStyle="inline-block w-15"
					className="py-0"
					buttonClassName="px-[0.8rem] py-1 md:space-x-4"
					fontStyles="text-[#072F40] text-[15px]"
					optionsClass="py-1"
					dropPosition="top"
				/>
			</div>
		);
	};

	return (
		<div
			data-testid="pagination-data"
			className="flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between self-end items-center w-full"
		>
			<PagingComponent className="flex justify-between md:justify-start items-center w-full md:w-auto" />

			<div className="flex justify-between md:flex-row items-center w-full md:w-auto">
				<span className="text-[#072F40] text-[14px] md:text-[15px]">
					{rowsPerPage * currentPage - (rowsPerPage - 1)} -{" "}
					{Math.min(rowsPerPage * currentPage, totalRecord)} of {totalRecord}
				</span>

				<div className="flex items-center md:ml-2.5 gap-x-3 md:gap-x-0">
					<PaginationButton
						testId="prev-btn"
						onClick={handlePrev}
						direction="left"
						disabled={currentPage <= 1}
					/>
					<PaginationButton
						testId="next-btn"
						onClick={handleNext}
						direction="right"
						disabled={currentPage >= totalPages}
					/>
				</div>
			</div>
		</div>
	);
};

export default Pagination;
export { ExamplePagination };
