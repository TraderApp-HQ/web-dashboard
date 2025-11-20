import Card from "~/components/AccountLayout/Card";
import TransferIcon from "~/components/icons/TransferIcon";
import type { ITransaction } from "~/lib/types";

interface ITransactionsRecordProps {
	transaction: ITransaction;
}

interface TransactionInfoItemProps {
	label: string;
	value: string;
}

// Component to display individual transaction information item
const TransactionInfoItem: React.FC<TransactionInfoItemProps> = ({ label, value }) => {
	const isAddress = label === "Address";
	return (
		<div className="flex gap-x-6 lg:gap-x-10 justify-between items-start w-full px-3.5 py-5 border-b border-gray-200 last:border-0">
			<h4 className="text-neutral-700 text-sm font-bold text-nowrap">{label}</h4>
			<p
				className={`text-gray-500 text-sm font-bold break-all ${isAddress && "truncate"} ${label === "Network" && "uppercase"}`}
			>
				{value}
			</p>
		</div>
	);
};

// Component to display withdrawal transactions record
export function WithdrawalTransactionsRecord({ transaction }: ITransactionsRecordProps) {
	const withdrawnAmount =
		Number(transaction.amount) +
		Number(transaction.processingFee) +
		Number(transaction.networkFee);
	return (
		<Card className="p-3.5 !bg-slate-50 mb-4">
			<TransactionInfoItem label="Address" value={transaction.toWalletAddress ?? ""} />
			{/* <TransactionInfoItem label="Wallet" value={transaction.wallet} /> */}
			<TransactionInfoItem label="Transaction ID" value={transaction.transactionHash ?? ""} />
			{/* <TransactionInfoItem label="Transaction Fee" value={`$${transaction.fee}`} /> */}
			<TransactionInfoItem
				label="Network"
				value={transaction.transactionNetwork?.replaceAll("_", " ") ?? ""}
			/>

			{/* <TransactionInfoItem label="Withdrawn Amount" value={`${transaction.amount} USDT`} /> */}
			<TransactionInfoItem
				label="Withdrawn Amount"
				value={`${withdrawnAmount.toLocaleString("en-US", {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				})} USDT`}
			/>
			<TransactionInfoItem label="Network Fee" value={`${transaction.networkFee} USDT`} />
			<TransactionInfoItem
				label="Processing Fee"
				value={`${transaction.processingFee} USDT`}
			/>
		</Card>
	);
}

// Component to display deposit transactions record
export function DepositTransactionsRecord({ transaction }: ITransactionsRecordProps) {
	return (
		<Card className="p-3.5 !bg-slate-50 mb-4">
			<TransactionInfoItem label="Address" value={transaction.fromWalletAddress ?? ""} />
			<TransactionInfoItem label="Transaction ID" value={transaction.transactionHash ?? ""} />
			{/* <TransactionInfoItem label="Wallet" value={transaction.wallet} /> */}
			<TransactionInfoItem
				label="Network"
				value={transaction.transactionNetwork?.replaceAll("_", " ") ?? ""}
			/>
			<TransactionInfoItem label="Deposit Amount" value={`${transaction.amount} USDT`} />
			<TransactionInfoItem label="Provider Fee" value={`${transaction.providerFee} USDT`} />
		</Card>
	);
}

// Component to display transfer transactions record
export function TransferTransactionsRecord({ transaction }: ITransactionsRecordProps) {
	return (
		<Card className="p-3.5 !bg-slate-50 mb-4">
			<TransactionInfoItem label="From" value={transaction.fromWalletAddress ?? ""} />
			<TransactionInfoItem label="To" value={transaction.toWalletAddress ?? ""} />
		</Card>
	);
}

// Component to display activation transactions record
export function ActivationTransactionsRecord({ transaction }: ITransactionsRecordProps) {
	return (
		<Card className="p-3.5 !bg-slate-50 mb-4">
			<TransactionInfoItem label="Wallet" value={transaction.fromWallet!} />
			<TransactionInfoItem
				label="Transaction Source"
				value={transaction.transactionSource!}
			/>
			<TransactionInfoItem
				label="Network"
				value={transaction.transactionNetwork?.replaceAll("_", " ") ?? ""}
			/>
			<TransactionInfoItem
				label="Fee Amount"
				value={`${transaction.amount.toLocaleString("en-US", {
					maximumFractionDigits: 2,
					minimumFractionDigits: 2,
				})} USDT`}
			/>
		</Card>
	);
}

// Component to display conversion transactions record
export function ConvertTransactionsRecord({ transaction }: ITransactionsRecordProps) {
	return (
		<>
			{/* Card component to display the "You Sold" and "You Bought" sections */}
			<Card className="p-3.5 !bg-slate-50 mb-4">
				<div className="flex justify-start items-center w-full px-3.5 py-5 border-b border-gray-200 last:border-0">
					<div className="flex flex-col gap-y-4">
						<h4 className="text-neutral-700 text-sm font-bold">You Sold</h4>
						<div>
							<div className="flex gap-x-2 text-gray-500 text-sm font-normal leading-tight">
								<p>{transaction.fromAmount}</p>
								<p>{transaction.fromCurrencyName}</p>
							</div>
							<p
								className={`text-xs font-normal ${
									parseFloat(String(transaction.conversionRate ?? "0")) < 0
										? "text-rose-700"
										: "text-emerald-700"
								}`}
							>
								{transaction.conversionRate}%
							</p>
						</div>
					</div>
					{/* Center column: Transfer icon */}
					<div className="w-3/6">
						<span className="flex justify-center">
							<TransferIcon color="#1836B2" />
						</span>
					</div>
					{/* Right column: "You Bought" information */}
					<div className="flex flex-col gap-y-4">
						<h4 className="text-neutral-700 text-sm font-bold">You Bought</h4>
						<div>
							{/* Transaction details */}
							<div className="flex gap-x-2 text-gray-500 text-sm font-normal leading-tight">
								<p>{transaction.toAmount}</p>
								<p>{transaction.toCurrencyName}</p>
							</div>
							<p
								className={`text-xs font-normal ${
									parseFloat(String(transaction.conversionRate ?? "0")) < 0
										? "text-rose-700"
										: "text-emerald-700"
								}`}
							>
								{transaction.conversionRate}%
							</p>
						</div>
					</div>
				</div>
			</Card>
			{/* Card component to display the exchange rate */}
			<Card className="p-5 !bg-slate-50 mb-4">
				<div className="flex justify-between">
					<h4 className="self-end">
						<span className="text-neutral-700 text-base font-bold ">
							{" "}
							Exchange rate
						</span>{" "}
						<span className="text-neutral-700 text-xs font-bold ">
							(1 {transaction.toCurrencyName}/{transaction.currencyName})
						</span>
					</h4>
					{/* Transaction details */}
					<div>
						<div className="flex gap-x-2 text-gray-500 text-sm font-normal leading-tight">
							<p>{transaction.amount}</p>
							<p>{transaction.toCurrencyName}</p>
						</div>
						<p
							className={`text-xs font-normal ${
								parseFloat(String(transaction.conversionRate ?? "0")) < 0
									? "text-rose-700"
									: "text-emerald-700"
							}`}
						>
							{transaction.conversionRate}%
						</p>
					</div>
				</div>
			</Card>
		</>
	);
}
