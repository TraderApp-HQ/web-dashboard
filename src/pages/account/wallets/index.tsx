import { ReactElement, ReactNode } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
// import Currencies from "~/components/Wallet/Currencies";
import RecentTransactions from "~/components/Wallet/RecentTransactions";
import WalletBalanceCard from "~/components/Wallet/WalletBalanceCard";
import TiltedCircledArrowIcon from "~/components/icons/TiltedCircledArrowIcon";
import { ROUTES } from "~/config/constants";

type IProps = {
	children: ReactNode;
};

export const NestedWalletsLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>{children}</AccountLayout>
);

const Wallets = () => {
	const supportedOperations = [
		{
			label: "Deposit",
			url: ROUTES.wallet.deposit,
			Icon: TiltedCircledArrowIcon,
		},
		{
			label: "Withdraw",
			url: ROUTES.wallet.withdraw,
			Icon: TiltedCircledArrowIcon,
		},
	];

	return (
		<section>
			<WalletBalanceCard
				supportedOperations={supportedOperations}
				padding="p-3 md:px-5 md:py-10 !rounded-2xl"
				totalBalanceStyle="text-2xl text-textGray"
			/>
			{/* <Currencies /> */}
			<RecentTransactions />
		</section>
	);
};

Wallets.getLayout = (page: ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Wallets;
