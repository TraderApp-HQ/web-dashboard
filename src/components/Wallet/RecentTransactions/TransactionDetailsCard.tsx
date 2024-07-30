import Card from "~/components/AccountLayout/Card";
import type { IRecentTransactions } from "~/lib/types";
import { renderStatus } from "~/helpers";

interface ITransactionDetailsCardProps {
  transaction: IRecentTransactions;
}

export default function TransactionDetailsCard({ transaction }: ITransactionDetailsCardProps) {
  return (
    <Card className={` p-3.5 !bg-slate-50 rounded-lg mb-4`}>
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-2">
              <img src={transaction.image} width={25} alt={transaction.image} />
              <p>{transaction.curency}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-slate-900 text-3xl font-bold">{transaction.amount}</p>
              <p className="text-slate-900 text-xl font-bold self-end">{transaction.shortName}</p>
            </div>
          </div>
          <div className="w-1/6">{renderStatus(transaction.status)}</div>
        </div>
        <p className="text-gray-500 text-base font-semibold leading-tight">{transaction.date}</p>
      </div>
    </Card>
  );
}
