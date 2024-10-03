import React from "react";
import ExamplePagination from "./ExamplePagination";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";

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

		// Add a larger option close to the total records if not already present
		if (totalRecord > value / 2) {
			options.push(totalRecord);
		}

		return options;
	};

	const PagingComponent = ({ className }: { className?: string }) => {
		return (
			<div className={clsx(`mb-2 sm:mb-0`, className)}>
				<span className="mr-2 hidden md:inline-block text-[#072F40] text-[12px]">
					Rows per page:
				</span>
				<select
					value={rowsPerPage}
					onChange={(e) => setRowsPerPage(Number(e.target.value))}
					className="rounded px-2 py-1 focus:outline-none focus:ring-0 text-[#072F40] text-[12px]"
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
		<div className="flex flex-col sm:flex-row justify-between self-end items-center">
			<PagingComponent className="hidden md:flex items-center justify-center" />
			<div className="flex items-center gap-x-2">
				<span className="mx-2 hidden md:flex text-[#072F40] text-[14px]">
					{currentPage} - {totalPages} of {totalRecord}
				</span>
				<button
					onClick={handlePrev}
					className="px-3 py-1 mx-1 rounded disabled:bg-gray-100 disabled:cursor-not-allowed text-[14px]"
					disabled={currentPage === 1}
				>
					<FiChevronLeft size={20} color="#AAB7C6" />
				</button>
				<div className="flex items-center justify-center gap-x-2">
					<span className="mx-2 md:hidden text-[#072F40] text-[14px]">
						{currentPage} - {totalPages} of {totalRecord}
					</span>
					<PagingComponent className="md:hidden flex items-center justify-center" />
				</div>
				<button
					onClick={handleNext}
					className="px-3 py-1 mx-1 rounded disabled:bg-gray-100 disabled:cursor-not-allowed text-[14px]"
					disabled={currentPage === totalPages}
				>
					<FiChevronRight size={20} color="#AAB7C6" />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
export { ExamplePagination };
