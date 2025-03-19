// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ISelectBoxOption<T = any> {
	displayText: string;
	value: string;
	imgUrl?: string;
	data?: T;
}

export interface ICheckedBoxOption {
	displayText: string;
	value: string;
	imgUrl: string;
}

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalRecord: number;
	rowsPerPage: number;
	setRowsPerPage: (num: number) => void;
	onNext: (page: number) => void;
	onPrev: (page: number) => void;
	hasNextPage?: boolean | null;
	hasPrevPage?: boolean | null;
}

export interface PaginationButtonProps {
	onClick: () => void;
	disabled?: boolean;
	testId: string;
	className?: string;
	direction: "left" | "right";
}
