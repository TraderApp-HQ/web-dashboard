import { APIClient } from "~/apis/apiClient";
import { UsersService } from "../users";
import { createServiceClient } from "../_shared/serviceClient";
import { IPaginatedResult, IPaginationQuery, IResponse } from "../interfaces";
import { Currency, InvoiceType, TradeSide } from "~/config/enum";

interface IInvoiceListItem {
	id: string;
	userId: string;
	amountDue: number;
	amountPaid: number;
	amountOutstanding: number;
	currency: Currency;
	tradeSide: TradeSide;
	tradePair: string;
	logoUrl: string;
	invoiceType: InvoiceType;
	createdAt: Date;
}

export class InvoicesService {
	private apiClient: APIClient;
	private usersService: UsersService;

	constructor() {
		const { apiClient, usersService } = createServiceClient();
		this.apiClient = apiClient;
		this.usersService = usersService;
	}

	public async getOutstandingUserInvoices({
		currentPage,
		rowsPerPage,
	}: IPaginationQuery): Promise<IPaginatedResult<IInvoiceListItem>> {
		const response = await this.apiClient.get<IResponse<IPaginatedResult<IInvoiceListItem>>>({
			url: `/invoices?page=${currentPage}&limit=${rowsPerPage}&outstandingOnly=true`,
		});

		if (response.error) {
			throw new Error(response.message ?? "Failed to fetch invoices");
		}
		const { data } = response;
		return data;
	}
}
