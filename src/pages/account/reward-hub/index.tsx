import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AccountLayout from "~/components/AccountLayout/Layout";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

const RewardHubHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`${LAYOUT_ROUTES.account}${ROUTES.rewardHub}/overview`);
	}, []);
};

type IProps = {
	children: ReactNode;
};

export const RewardHubLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Referrals Overview", href: `/account/reward-hub/overview` },
		{ title: "My Community", href: "/account/reward-hub/community" },
		{ title: "My Tasks Center", href: "/account/reward-hub/task-center?task=all" },
	];

	return (
		<div>
			<PageTab tabs={tabs} />
			<div className="mt-6">{children}</div>
		</div>
	);
};

export const NestedRewardHubLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>
		<RewardHubLayout>{children}</RewardHubLayout>
	</AccountLayout>
);

export default RewardHubHome;
