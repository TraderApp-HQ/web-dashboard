import { ReactElement } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";

const Wallets = () => {
	return (
		<section className="space-y-10">
			<WalletBalanceCard
				cardStyle="px-4 py-8 md:px-5 md:py-12 !rounded-2xl"
				totalBalanceStyle="text-2xl text-textGray"
			/>
			<RecentTransactions />
		</section>
	);
};

Wallets.getLayout = (page: ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Wallets;
