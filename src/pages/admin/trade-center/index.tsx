import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AdminLayout from "~/components/AdminLayout/Layout";
import Button from "~/components/common/Button";

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
	const router = useRouter();
	const tabs = [
		{ title: "Open Trades", href: "open-trades" },
		{ title: "Trading Accounts", href: "trading-accounts" },
		{ title: "Trades History", href: "trades-history" },
	];

	const handleCreateTrade = () => {
		router.push("create-trade");
	};

	return (
		<div>
			<div className="flex flex-col mb-8 gap-5 md:items-start lg:flex-row lg:items-center lg:justify-between">
				<PageTab tabs={tabs} />
				<Button
					onClick={handleCreateTrade}
					labelText="Create Trade"
					className="w-full md:w-32 h-12 lg:h-9 !p-0 text-center ml-auto"
				/>
			</div>

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
