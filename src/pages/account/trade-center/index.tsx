import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AccountLayout from "~/components/AccountLayout/Layout";

const TradeCenterHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`trade-center/open-trades`);
	}, []);
};

interface IProps {
	children: ReactNode;
}

const TradeCenterLayout: React.FC<IProps> = ({ children }) => {
	const tabs = [
		{ title: "Open Trades", href: "/account/trade-center/open-trades" },
		{ title: "Trades History", href: "/account/trade-center/trade-history" },
		{ title: "Trading Rules", href: "/account/trade-center/trading-rules" },
		{ title: "My Exchanges", href: "/account/trade-center/exchanges" },
	];

	return (
		<div>
			<div className="mb-6 md:w-[70%] lg:w-[52%] 2xl:w-[40%]">
				<PageTab tabs={tabs} />
			</div>
			<div>{children}</div>
		</div>
	);
};

export const NestedTradeCenterLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>
		<TradeCenterLayout>{children}</TradeCenterLayout>
	</AccountLayout>
);

export default TradeCenterHome;
