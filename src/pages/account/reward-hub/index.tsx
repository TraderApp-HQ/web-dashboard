import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import AccountLayout from "~/components/AccountLayout/Layout";
import PageTab from "~/components/AccountLayout/Tabs";
import { ROUTES } from "~/config/constants";

const RewardHubHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`${ROUTES.rewardHub}/overview`.substring(1));
	}, []);
};

type IProps = {
	children: ReactNode;
};

export const RewardHubLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Referrals Overview", href: `overview` },
		{ title: "My Community", href: "community" },
		{ title: "My Tasks Center", href: "task-center?task=all" },
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
