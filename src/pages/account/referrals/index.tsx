import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AccountLayout from "~/components/AccountLayout/Layout";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

const ReferralsHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`${LAYOUT_ROUTES.account}${ROUTES.referrals}/overview`);
	}, []);
};

type IProps = {
	children: ReactNode;
};

const ReferralsLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Overview", href: `/account/referrals/overview` },
		{ title: "My Community", href: "/account/referrals/community" },
	];

	return (
		<div>
			<PageTab tabs={tabs} />
			<div className="mt-6">{children}</div>
		</div>
	);
};

export const NestedReferralsLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>
		<ReferralsLayout>{children}</ReferralsLayout>
	</AccountLayout>
);

export default ReferralsHome;
