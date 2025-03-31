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

	// Get the main wallet balance and currency in USDT.
	const wallet = data?.wallets?.find(
		(wallet) => wallet.walletTypeName === WalletType.MAIN,
	) as IUserWallet;

	// Get the wallet balances in all converted currencies and USDT.
	// This is an array of objects with balance and currency properties.
	const convertedWalletBalance = [
		{ balance: wallet?.availableBalance, currency: wallet?.currencySymbol },
		...(Array.isArray(data?.exchangeRateTotalBalances) ? data.exchangeRateTotalBalances : []),
	];

	return (
		<section className="space-y-10">
			{isLoading ? (
				<WalletBalanceCardLoader />
			) : (
				isSuccess && (
					<WalletBalanceCard
						padding="p-3 md:px-5 md:py-10 !rounded-2xl"
						totalBalanceStyle="text-2xl text-textGray"
						walletConvertedBalance={convertedWalletBalance}
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
