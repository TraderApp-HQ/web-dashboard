import { useRouter } from "next/router";
import { useState } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import ComponentError from "~/components/Error/ComponentError";
import TaskViewLoader from "~/components/Loaders/TaskViewLoader";
import Modal from "~/components/Modal";
import TransactionDetailsCard from "~/components/Wallet/RecentTransactions/TransactionDetailsCard";
import {
	ConvertTransactionsRecord,
	DepositTransactionsRecord,
	TransferTransactionsRecord,
	WithdrawalTransactionsRecord,
} from "~/components/Wallet/RecentTransactions/TransactionsRecord";
import { useGetUserWalletsTransaction } from "~/hooks/useWallets";

function TransactionDetails() {
	const [openModal, setOpenModal] = useState(true);
	const router = useRouter();
	const { id } = router.query;
	const {
		data: transactionData,
		error,
		isError,
		isLoading,
		isSuccess,
	} = useGetUserWalletsTransaction(id as string);

	const onClose = () => {
		setOpenModal(false);
		router.back();
	};

	const renderContent = () => {
		switch (transactionData?.transactionType.toLowerCase()) {
			case "deposit":
				return <DepositTransactionsRecord transaction={transactionData} />;
			case "withdraw":
				return <WithdrawalTransactionsRecord transaction={transactionData} />;
			case "transfer":
				return <TransferTransactionsRecord transaction={transactionData} />;
			default:
				return transactionData ? (
					<ConvertTransactionsRecord transaction={transactionData} />
				) : null;
		}
	};

	return (
		<Modal
			openModal={openModal}
			width="lg:w-[807px]"
			onClose={onClose}
			title={`${transactionData?.transactionType.toLowerCase()} Transaction Details`}
		>
			{isLoading ? (
				/////// Loading State ////////////
				<TaskViewLoader />
			) : !isLoading && isError ? (
				////////// Error State //////////
				<ComponentError errorMessage={error?.message} />
			) : (
				isSuccess &&
				transactionData && (
					<>
						<TransactionDetailsCard transaction={transactionData} />
						{renderContent()}
					</>
				)
			)}
		</Modal>
	);
}

TransactionDetails.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default TransactionDetails;
