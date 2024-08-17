import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import data from "~/data/wallet/data.json";
import { IRecentTransactions } from "~/lib/types";
import { getTransaction } from "~/lib/utils";

import Modal from "~/components/Modal";
import TransactionDetailsCard from "~/components/Wallet/RecentTransactions/TransactionDetailsCard";
import {
	ConvertTransactionsRecord,
	DepositTransactionsRecord,
	TransferTransactionsRecord,
	WithdrawalTransactionsRecord,
} from "~/components/Wallet/RecentTransactions/TransactionsRecord";
import { NestedWalletsLayout } from "../..";

interface TransactionDetailsProps {
	transaction: IRecentTransactions;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params!;
	const transaction = await getTransaction(id as string, data.transactions);
	return {
		props: { transaction },
	};
};

function TransactionDetails({ transaction }: TransactionDetailsProps) {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(true);

	const onClose = () => {
		setOpenModal(false);
		router.back();
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

TransactionDetails.getLayout = (page: React.ReactElement) => (
	<NestedWalletsLayout>{page}</NestedWalletsLayout>
);
export default TransactionDetails;
