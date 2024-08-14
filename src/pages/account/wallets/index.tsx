import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import PageTab from "~/components/AccountLayout/Tabs";

const WalletsHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push("wallets/main");
	}, []);
}

type IProps = {
	children: ReactNode
}

const WalletsLayout: React.FC<IProps> = ({ children }) => {
	const tabs = [
		{ title: "Main", href: "/account/wallets/main" },
		{ title: "Spot", href: "/account/wallets/spot" },
		{ title: "Futures", href: "/account/wallets/futures" },
	];

	return (
		<div>
			<div className="mb-6 md:w-[50%] lg:w-[35%] 2xl:w-[25%]">
				<PageTab tabs={tabs} />
			</div>
			<div>{children}</div>
		</div>
	);
};

export const NestedWalletsLayout: React.FC<IProps> = ({ children }) => (
  <AccountLayout>
    <WalletsLayout>{children}</WalletsLayout>
  </AccountLayout>
);

export default WalletsHome;
