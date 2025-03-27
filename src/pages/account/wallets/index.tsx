import { ReactElement } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import TiltedCircledTopRightArrowIcon from "~/components/icons/TiltedCircledTopRightArrowIcon";
import TiltedCircledDownRightArrowIcon from "~/components/icons/TiltedCircledDownRightArrowIcon";
import { ROUTES } from "~/config/constants";

const Wallets = () => {
	const supportedOperations = [
		{
			label: "Deposit",
			url: ROUTES.wallet.deposit,
			Icon: TiltedCircledDownRightArrowIcon,
		},
		{
			label: "Withdraw",
			url: ROUTES.wallet.withdraw,
			Icon: TiltedCircledTopRightArrowIcon,
		},
	];

	return (
		<section className="space-y-10">
			<WalletBalanceCard
				supportedOperations={supportedOperations}
				padding="p-3 md:px-5 md:py-10 !rounded-2xl"
				totalBalanceStyle="text-2xl text-textGray"
			/>
			<RecentTransactions />
		</section>
	);
};

Wallets.getLayout = (page: ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Wallets;
