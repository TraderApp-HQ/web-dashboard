import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import DepositIcon from "~/components/icons/DepositIcon";
import TransferIcon from "~/components/icons/TransferIcon";
import WithdrawIcon from "~/components/icons/WithdrawIcon";
import ConvertIcon from "~/components/icons/ConvertIcon";
import { ROUTES } from "~/config/constants";
import Currencies from "~/components/Wallet/Currencies";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import { NestedWalletsLayout } from "..";

const MainWallet = () => {
	const supportedOperations = [
		{
			label: "Deposit",
			url: ROUTES.wallet.deposit,
			Icon: DepositIcon,
		},
		{
			label: "Withdraw",
			url: ROUTES.wallet.withdraw,
			Icon: WithdrawIcon,
		},
		{
			label: "Transfer",
			url: ROUTES.wallet.transfer,
			Icon: TransferIcon,
		},
		{
			label: "Convert",
			url: ROUTES.wallet.convert,
			Icon: ConvertIcon,
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

MainWallet.getLayout = (page: React.ReactElement) => (
	<NestedWalletsLayout>{page}</NestedWalletsLayout>
);
export default MainWallet;
