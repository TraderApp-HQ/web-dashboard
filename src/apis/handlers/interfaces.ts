/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResponse<T = any> {
	data: T;
	error: {
		statusCode: number;
		errorName: string;
		errorMessage: string;
	};
	message: string;
}

export interface IPaginationQuery {
	currentPage?: number;
	rowsPerPage?: number;
}

export interface IPaginatedResult<T> {
	docs: T[];
	totalDocs: number;
	limit: number;
	page: number;
	nextPage: number;
	prevPage?: number;
	totalPages: number;
	pagingCounter: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}
