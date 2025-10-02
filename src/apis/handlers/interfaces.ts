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
