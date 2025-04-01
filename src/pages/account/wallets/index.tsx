import { ReactElement } from "react";
import { WalletType } from "~/apis/handlers/wallets/enum";
import AccountLayout from "~/components/AccountLayout/Layout";
import WalletBalanceCardLoader from "~/components/Loaders/WalletBalanceCardLoader";
import WalletTransactionsLoader from "~/components/Loaders/WalletTransactionsLoader";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import { useGetUserWalletsBalance } from "~/hooks/useWallets";

const Wallets = () => {
	// Get wallet balance hook
	const { data, isError, isLoading } = useGetUserWalletsBalance(WalletType.MAIN);

	return (
		<section className="space-y-10">
			{isLoading ? (
				<WalletBalanceCardLoader />
			) : (
				<WalletBalanceCard
					padding="p-3 md:px-5 md:py-10 !rounded-2xl"
					totalBalanceStyle="text-2xl text-textGray"
					walletConvertedBalance={data?.exchangeRateTotalBalances}
					isError={isError}
				/>
			)}
			{isLoading ? <WalletTransactionsLoader /> : <RecentTransactions />}
		</section>
	);
};

Wallets.getLayout = (page: ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Wallets;
