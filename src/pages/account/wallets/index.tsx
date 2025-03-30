import { ReactElement } from "react";
import { WalletType } from "~/apis/handlers/wallets/enum";
import { IUserWallet } from "~/apis/handlers/wallets/interface";
import AccountLayout from "~/components/AccountLayout/Layout";
import WalletBalanceCardLoader from "~/components/Loaders/WalletBalanceCardLoader";
import WalletTransactionsLoader from "~/components/Loaders/WalletTransactionsLoader";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import { useGetUserWalletsBalance } from "~/hooks/useWallets";

const Wallets = () => {
	// Get wallet balance hook
	const { data, isError, isLoading, isSuccess } = useGetUserWalletsBalance(WalletType.MAIN);

	// Get the main wallet balance and currency.
	const wallet = data?.wallets?.find(
		(wallet) => wallet.walletTypeName === WalletType.MAIN,
	) as IUserWallet;

	return (
		<section className="space-y-10">
			{isLoading ? (
				<WalletBalanceCardLoader />
			) : (
				isSuccess && (
					<WalletBalanceCard
						padding="p-3 md:px-5 md:py-10 !rounded-2xl"
						totalBalanceStyle="text-2xl text-textGray"
						walletBalance={wallet?.availableBalance}
						walletCurrency={wallet?.currencySymbol}
						isError={isError}
					/>
				)
			)}
			{isLoading ? <WalletTransactionsLoader /> : <RecentTransactions />}
		</section>
	);
};

Wallets.getLayout = (page: ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Wallets;
