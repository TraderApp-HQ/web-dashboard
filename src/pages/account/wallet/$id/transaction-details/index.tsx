import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import data from "~/data/wallet/data.json";
import type { IRecentTransactions } from "~/lib/types";
import { getTransaction } from "~/lib/utils";

import Modal from "~/components/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionDetailsCard from "~/components/Wallet/RecentTransactions/TransactionDetailsCard";
import {
  ConvertTransactionsRecord,
  DepositTransactionsRecord,
  TransferTransactionsRecord,
  WithdrawalTransactionsRecord,
} from "~/components/Wallet/RecentTransactions/TransactionsRecord";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const transaction = await getTransaction(id, data.transactions);
  return json(transaction);
};

export default function TransactionDetails() {
  const transaction: IRecentTransactions = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true);

  const onClose = () => {
    setOpenModal(false);
    navigate(-1);
  };

  const renderContent = () => {
    switch (transaction.transaction.toLowerCase()) {
      case "deposit":
        return <DepositTransactionsRecord transaction={transaction} />;
      case "withdraw":
        return <WithdrawalTransactionsRecord transaction={transaction} />;
      case "transfer":
        return <TransferTransactionsRecord transaction={transaction} />;
      default:
        return <ConvertTransactionsRecord transaction={transaction} />;
    }
  };

  return (
    <Modal
      openModal={openModal}
      width="lg:w-[807px]"
      onClose={onClose}
      title={`${transaction.transaction} Transaction Details`}
    >
      <TransactionDetailsCard transaction={transaction} />
      {renderContent()}
    </Modal>
  );
}
