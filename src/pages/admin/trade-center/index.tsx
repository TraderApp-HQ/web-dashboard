import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AdminLayout from "~/components/AdminLayout/Layout";

const TradeCenter = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`trade-center/open-trades`);
	}, []);
};

type IProps = {
	children: ReactNode;
};

const TradeCenterLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Open Trades", href: "open-trades" },
		{ title: "Trading Accounts", href: "trading-accounts" },
		{ title: "Trades History", href: "trades-history" },
	];

	return (
		<div>
			<PageTab tabs={tabs} />

			<div className="mt-6">{children}</div>
		</div>
	);
};

export const AdminNestedTradeCenterLayout: React.FC<IProps> = ({ children }) => (
	<AdminLayout>
		<TradeCenterLayout>{children}</TradeCenterLayout>
	</AdminLayout>
);

export default TradeCenter;
