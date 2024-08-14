import { useRouter } from "next/router";
import React, { useEffect, ReactNode  } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AccountLayout from "~/components/AccountLayout/Layout";

const SignalsHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`portfolio/open-trades`);
	}, []);
}

type IProps = {
	children: ReactNode
}

const PortfolioLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Open Trades", href: "/account/portfolio/open-trades" },
		{ title: "Trades History", href: "/account/portfolio/trade-history" },
		{ title: "Trading Rules", href: "/account/portfolio/trading-rules" },
	];

	return (
		<div>
			<div className="mb-6 md:w-[70%] lg:w-[50%] 2xl:w-[40%]">
				<PageTab tabs={tabs} />
			</div>
			<div>{children}</div>
		</div>
	);
};

export const NestedPortfolioLayout: React.FC<IProps> = ({ children }) => (
  <AccountLayout>
    <PortfolioLayout>{children}</PortfolioLayout>
  </AccountLayout>
);

export default SignalsHome;
