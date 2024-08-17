import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import Currencies from "~/components/Wallet/Currencies";
import TransferIcon from "~/components/icons/TransferIcon";
import { ROUTES } from "~/config/constants";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import { NestedWalletsLayout } from "..";

const FuturesWallet = () => {
	const supportedOperations = [
		{
			label: "Transfer",
			url: ROUTES.wallet.transfer,
			Icon: TransferIcon,
		},
	];

	return (
		<>
			<WalletBalanceCard supportedOperations={supportedOperations} />
			<Currencies />
			<RecentTransactions />
		</>
	);
};

FuturesWallet.getLayout = (page: React.ReactElement) => (
	<NestedWalletsLayout>{page}</NestedWalletsLayout>
);
export default FuturesWallet;
