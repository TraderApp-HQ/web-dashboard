import { APIClient } from "~/apis/apiClient";
import type { IResponse } from "../interfaces";
import { UsersService } from "../users";
import type { IFetchSignals, ISignal } from "./interfaces";
import { SignalStatus } from "./enums";

export class SignalsService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
		// this.apiClient = new APIClient(
		//   "https://apis-dev.traderapp.finance:3001",
		//   this.usersService.refreshUserAccessToken.bind(this),
		// );
		this.apiClient = new APIClient(
			"http://localhost:8080",
			this.usersService.refreshUserAccessToken.bind(this.usersService),
		);
	}

	//   public async refreshUserAccessToken(): Promise<string | null> {
	//     return this.usersService.refreshUserAccessToken.bind(this);
	//   }

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
}

export default new SignalsService();
