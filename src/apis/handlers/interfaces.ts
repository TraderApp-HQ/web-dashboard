export interface IResponse {
	data: any;
	error: {
		statusCode: number;
		errorName: string;
		errorMessage: string;
	};
	message: string;
}
