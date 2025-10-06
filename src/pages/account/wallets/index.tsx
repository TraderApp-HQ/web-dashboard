import { ReactElement } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import UserInvoices from "~/components/Invoices/UserInvoices";
import useFeatureFlag from "~/hooks/useFeatureFlag";
import useUserProfileData from "~/hooks/useUserProfileData";

const Wallets = () => {
	const { userId } = useUserProfileData();
	const showInvoices = useFeatureFlag({ userId, flagName: "release-invoices" });
	return (
		<section className="space-y-10">
			<WalletBalanceCard
				padding="px-4 py-8 md:px-5 md:py-12 !rounded-2xl"
				totalBalanceStyle="text-2xl text-textGray"
			/>

			{showInvoices && <UserInvoices />}

			<RecentTransactions />
		</section>
	);
};

Wallets.getLayout = (page: ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Wallets;
