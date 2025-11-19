// import Image from "next/image";
import Card from "~/components/AccountLayout/Card";
import { renderStatus } from "~/helpers";
import type { ITransaction } from "~/lib/types";
import { uniqueDateFormat } from "~/lib/utils";

interface ITransactionDetailsCardProps {
	transaction: ITransaction;
}

export default function TransactionDetailsCard({ transaction }: ITransactionDetailsCardProps) {
	return (
		<Card className={` p-3.5 !bg-slate-50 rounded-lg mb-4`}>
			<div className="flex flex-col gap-y-2">
				<div className="flex justify-between w-full">
					<div className="flex flex-col gap-y-2">
						{/* <div className="flex gap-2">
							<Image
								src={transaction.assetLogo?.logoUrl ?? ""}
								width={25}
								height={25}
								alt={transaction.assetLogo?.symbol ?? ""}
							/>
							<p>{transaction.assetLogo?.name}</p>
						</div> */}
						<div className="flex gap-2">
							<p className="text-slate-900 text-3xl font-bold">
								{transaction.fromAmount ?? transaction.amount}
							</p>
							<p className="text-slate-900 text-xl font-bold self-end">
								{transaction.fromCurrencyName ?? transaction.currencyName}
							</p>
						</div>
					</div>
					<div className="w-1/6">{renderStatus(transaction.status)}</div>
				</div>
				<p className="text-gray-500 text-base font-semibold leading-tight">
					{uniqueDateFormat(transaction.createdAt)}
				</p>
			</div>
		</Card>
	);
}
