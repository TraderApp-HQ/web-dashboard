import React from "react";
import ExamplePagination from "./ExamplePagination";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";

interface PaginationButtonProps {
	onClick: () => void;
	disabled?: boolean;
	testId: string;
	className?: string;
	direction: "left" | "right";
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
	onClick,
	disabled,
	testId,
	direction,
	className = "px-3 py-1 mx-1 rounded disabled:cursor-not-allowed text-[14px]",
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

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalRecord: number;
	rowsPerPage: number;
	setRowsPerPage: (num: number) => void;
	onNext: (page: number) => void;
	onPrev: (page: number) => void;
}

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

	const calculateRowsPerPageOptions = (totalRecord: number): number[] => {
		const options = [];
		let value = 10;

		while (value < totalRecord) {
			options.push(value);
			value *= 2;
		}

		options.push(value);

		return options;
	};

	const PagingComponent = ({ className }: { className?: string }) => {
		return (
			<div className={clsx(`mb-2 sm:mb-0`, className)}>
				<span className="hidden md:inline-block text-[#072F40] text-[15px]">
					Rows per page:
				</span>
				<select
					value={rowsPerPage}
					onChange={(e) => setRowsPerPage(Number(e.target.value))}
					className="rounded py-1 focus:outline-none focus:ring-0 text-[#072F40] text-[15px]"
				>
					{calculateRowsPerPageOptions(totalRecord).map((num) => (
						<option key={num} value={num}>
							{num}
						</option>
					))}
				</select>
			</div>
		);
	};

	return (
		<div
			data-testid="pagination-data"
			className="flex flex-col sm:flex-row justify-between self-end items-center"
		>
			<PagingComponent className="hidden md:flex items-center justify-center" />
			<div className="flex items-center ">
				<span className="mx-2 hidden md:flex text-[#072F40] text-sm">
					{rowsPerPage * currentPage - (rowsPerPage - 1)} -{" "}
					{Math.min(rowsPerPage * currentPage, totalRecord)} of {totalRecord}
				</span>
				{
					<PaginationButton
						testId="prev-btn"
						onClick={handlePrev}
						direction="left"
						disabled={currentPage <= 1}
					/>
				}
				<div className="flex items-center justify-center gap-x-2">
					<span className="mx-2 md:hidden text-[#072F40] text-[14px]">
						{rowsPerPage * currentPage - (rowsPerPage - 1)} -{" "}
						{Math.min(rowsPerPage * currentPage, totalRecord)} of {totalRecord}
					</span>
					<PagingComponent className="md:hidden flex items-center justify-center" />
				</div>

				{
					<PaginationButton
						testId="next-btn"
						onClick={handleNext}
						disabled={currentPage >= totalPages}
						direction="right"
					/>
				}
			</div>
		</div>
	);
};

export default Pagination;
export { ExamplePagination };
