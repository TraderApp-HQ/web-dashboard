import React, { ReactElement, ReactNode } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import UserInvoices from "~/components/Invoices/UserInvoices";
import useFeatureFlag from "~/hooks/useFeatureFlag";
import useUserProfileData from "~/hooks/useUserProfileData";
import PageTab from "~/components/AccountLayout/Tabs";

const Wallets = () => {
	const { userId } = useUserProfileData();
	const showInvoices = useFeatureFlag({ userId, flagName: "release-invoices" });
	return (
		<section className="space-y-10">
			<WalletBalanceCard
				cardStyle="px-4 py-8 md:px-5 md:py-8 !rounded-2xl"
				totalBalanceStyle="text-4xl text-textGray"
			/>

			{showInvoices && <UserInvoices />}

			<RecentTransactions />
		</section>
	);
};

type IProps = {
	children: ReactNode;
};

const WalletLayout: React.FC<IProps> = ({ children }) => {
	const tabs = [{ title: "Main", href: "/account/wallets" }];

	return (
		<div>
			<PageTab tabs={tabs} />

			<div className="pt-3">{children}</div>
		</div>
	);
};

export const NestedWalletLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>
		<WalletLayout>{children}</WalletLayout>
	</AccountLayout>
);

Wallets.getLayout = (page: ReactElement) => <NestedWalletLayout>{page}</NestedWalletLayout>;
export default Wallets;
