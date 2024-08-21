import { APIClient } from "~/apis/apiClient";
import type { IResponse } from "../interfaces";
import { UsersService } from "../users";
import type {
	IFetchExchanges,
	IFetchSignals,
	IGetExchangesInput,
	ISignal,
	ISignalUpdateInput,
} from "./interfaces";
// import { SignalStatus } from "./enums";

export class AssetsService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
		if (!process.env.NEXT_PUBLIC_ASSETS_SERVICE_API_URL)
			throw Error("Assets service backend url not found");
		this.apiClient = new APIClient(
			process.env.NEXT_PUBLIC_ASSETS_SERVICE_API_URL,
			this.usersService.refreshUserAccessToken.bind(this.usersService),
		);
	}

	public async createSignal(): Promise<ISignal> {
		const response = await this.apiClient.post<IResponse>({
			url: "/signals/create",
			data: {},
		});

		if (response.error) {
			throw new Error(response.message || "Failed to create signal");
		}

		const { data } = response;
		return data as ISignal;
	}

	public async updateSignal(signal: ISignalUpdateInput): Promise<string> {
		const response = await this.apiClient.patch<IResponse>({
			url: `/signals/update/${signal.id}`,
			data: { status: signal.status },
		});

		if (response.error) {
			throw new Error(response.message || "Failed to update signal");
		}

		return response.message;
	}

	public async getSignal(): Promise<ISignal> {
		const response = await this.apiClient.get<IResponse>({ url: "/signal/id" });

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal");
		}

		const { data } = response;
		return data as ISignal;
	}

	public async getAllSignals(): Promise<IFetchSignals> {
		const response = await this.apiClient.get<IResponse>({
			url: `/signals`,
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch signal records");
		}

		const { data } = response;
		return data as IFetchSignals;
	}

	//Exchanges
	public async getAllExchanges({
		page,
		rowsPerPage,
		orderBy,
		isTradingActive,
	}: IGetExchangesInput): Promise<IFetchExchanges[]> {
		const response = await this.apiClient.get<IResponse>({
			url: `/exchanges?page=${page}&rowsPerPage=${rowsPerPage}&orderBy=${orderBy}&isTradingActive=${isTradingActive}`,
			options: { credentials: "include" },
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch exchange records");
		}

		const { data } = response;
		return data;
	}
}

// export default new AssetsService();
