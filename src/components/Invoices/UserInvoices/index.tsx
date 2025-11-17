import { useMemo, useState } from "react";
import Modal from "~/components/Modal";
import Button from "~/components/common/Button";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { useGetOutstandingUserInvoices } from "~/hooks/useInvoices";
import { Currency, TradeSide } from "~/config/enum";
import { InvoiceTypeValues } from "~/config/constants";
import { formatCurrency, uniqueDateFormat } from "~/lib/utils";
import { PAGINATION } from "~/apis/handlers/users/constants";

const getTradeSideBadgeStyle = (tradeSide: TradeSide) => {
	return `text-[10px] font-semibold px-2 py-1 rounded-md ${
		tradeSide === TradeSide.LONG ? "bg-[#EDFDF8] text-[#066042]" : "bg-[#FEF1F2] text-[#E02D3C]"
	}`;
};

const UserInvoices = () => {
	const currentPage = PAGINATION.PAGE;
	const rowsPerPage = PAGINATION.LIMIT;

	const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
	const { data } = useGetOutstandingUserInvoices({
		currentPage,
		rowsPerPage,
	});

	const { outstandingInvoices, totalOutstandingAmount } = useMemo(() => {
		const outstandingInvoices = data?.docs ?? [];
		const totalOutstandingAmount = outstandingInvoices.reduce(
			(acc, row) => acc + row.amountOutstanding,
			0,
		);
		return { outstandingInvoices, totalOutstandingAmount };
	}, [data]);

	const invoiceTableHead = useMemo(
		() => [
			{ displayItem: "Items", styles: "text-left px-6" },
			{ displayItem: "Invoice Type", styles: "text-left px-6" },
			{ displayItem: "Amount Due", styles: "text-left px-6" },
			{ displayItem: "Amount Paid", styles: "text-left px-6" },
			{ displayItem: "Amount Outstanding", styles: "text-left px-6" },
			{ displayItem: "Date", styles: "text-left px-6" },
		],
		[],
	);

	const invoiceTableBody = {
		tBodyRows: outstandingInvoices.map((inv) => {
			return {
				tBodyColumns: [
					{
						displayItem: renderDisplayItem({
							itemText: { text: inv.tradePair, style: "text-xs font-bold" },
							itemSubText: {
								text: inv.tradeSide,
								style: getTradeSideBadgeStyle(inv.tradeSide),
							},
							itemImage: inv.logoUrl,
							styles: "md:!justify-start",
						}),
						styles: "!px-4",
					},
					{
						displayItem: renderStatus(
							InvoiceTypeValues[inv.invoiceType],
							{},
							false,
							[],
							"inline-flex items-center justify-center rounded-md px-3.5 py-2.5 text-[13px] font-semibold",
							true,
						),
						styles: "text-left",
					},
					{
						displayItem: `${formatCurrency(inv.amountDue)} ${inv.currency}`,
						styles: "text-left",
					},
					{ displayItem: `${formatCurrency(inv.amountPaid)}  ${inv.currency}` },
					{ displayItem: `${formatCurrency(inv.amountOutstanding)}  ${inv.currency}` },
					{
						displayItem: uniqueDateFormat(inv.createdAt, false),
						styles: "text-left",
					},
				],
			};
		}),
	};

	// Invoice Mobile Table
	const invoiceMobileData = outstandingInvoices.map((inv) => {
		return {
			tHead: {
				displayItemTitle: renderDisplayItem({
					itemText: { text: inv.tradePair, style: "text-base font-bold" },
					itemSubText: {
						text: inv.tradeSide,
						style: getTradeSideBadgeStyle(inv.tradeSide),
					},
					itemImage: inv.logoUrl,
				}),
				displayItemValue: "",
			},
			tBody: [
				{
					displayItemTitle: "Invoice Type",
					displayItemValue: renderStatus(
						InvoiceTypeValues[inv.invoiceType],
						{},
						false,
						[],
						`inline-flex items-center justify-center rounded-md px-3.5 py-2.5 text-[13px] font-semibold`,
						true,
					),
				},
				{
					displayItemTitle: "Amount Due",
					displayItemValue: `${formatCurrency(inv.amountDue)} ${inv.currency}`,
				},
				{
					displayItemTitle: "Amount Paid",
					displayItemValue: `${formatCurrency(inv.amountPaid)} ${inv.currency}`,
				},
				{
					displayItemTitle: "Outstanding",
					displayItemValue: `${formatCurrency(inv.amountOutstanding)} ${inv.currency}`,
				},
				{
					displayItemTitle: "Date",
					displayItemValue: uniqueDateFormat(inv.createdAt, false),
				},
			],
		};
	});

	return (
		<>
			{totalOutstandingAmount > 0 && (
				<div className="bg-[#FFF3F2] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="space-y-1">
						<h3 className="text-[#1E1E1E] font-bold text-base md:text-lg">
							Invoice Due:{" "}
							{`${formatCurrency(Number(totalOutstandingAmount))} ${Currency.USDT}`}
						</h3>
						<p className="text-[#414141] text-sm md:text-base">
							You have ({outstandingInvoices.length}) outstanding payment
							{outstandingInvoices.length > 1 ? "s" : ""}. Pay now to stay active.
						</p>
					</div>
					<button
						onClick={() => setOpenInvoiceModal(true)}
						className="text-[#08307F] font-semibold text-sm md:text-base"
					>
						View more
					</button>
				</div>
			)}

			<Modal
				openModal={openInvoiceModal}
				onClose={() => setOpenInvoiceModal(false)}
				width="lg:w-[1100px]"
				title="Invoice Due"
				description=""
				className="pb-10"
			>
				<div className="space-y-5 px-1 md:px-2">
					<div className="bg-[#F2F6FF] border border-[#E1E6EF] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div className="flex flex-col gap-2">
							<p className="text-[#263238] text-[14px] font-bold leading-snug">
								Amount Due
							</p>
							<h2 className="text-[#414141] text-[32px] font-bold leading-[1.35]">
								{`${formatCurrency(+totalOutstandingAmount)} ${Currency.USDT}`}
							</h2>
						</div>
						<Button
							onClick={() => {
								setOpenInvoiceModal(false);
							}}
							labelText="Pay Now"
							className="px-9 !py-3 bg-[#1836B2] text-white font-medium text-sm rounded-md"
						/>
					</div>

					<div className="mb-1">
						<h3 className="text-[#08123B] text-base font-semibold">
							Invoice breakdown
						</h3>
					</div>

					<div>
						<div className="hidden md:block rounded-2xl overflow-x-auto">
							<DataTable
								tHead={invoiceTableHead}
								tBody={invoiceTableBody}
								hasActions={false}
								tableStyles="bg-white rounded-2xl"
								tableHeadStyles="bg-[#F3F4F6]"
								tableHeadItemStyles="text-left"
								tableRowItemStyles="px-6"
							/>
						</div>
						<div className="md:hidden">
							<DataTableMobile data={invoiceMobileData} hasActions={false} />
						</div>
					</div>

					{outstandingInvoices.length === 0 && (
						<div className="text-center text-sm text-[#585858] py-10">
							No invoice records.
						</div>
					)}
				</div>
			</Modal>
		</>
	);
};

export default UserInvoices;
