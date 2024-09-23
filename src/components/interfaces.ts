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
