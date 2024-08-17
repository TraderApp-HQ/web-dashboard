import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import Currencies from "~/components/Wallet/Currencies";
import TransferIcon from "~/components/icons/TransferIcon";
import { ROUTES } from "~/config/constants";
import { NestedWalletsLayout } from "..";

const SpotWallet = () => {
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

SpotWallet.getLayout = (page: React.ReactElement) => (
	<NestedWalletsLayout>{page}</NestedWalletsLayout>
);
export default SpotWallet;
