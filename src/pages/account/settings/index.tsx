import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AccountLayout from "~/components/AccountLayout/Layout";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

const SettingsHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`/${LAYOUT_ROUTES.account}/${ROUTES.settings}/profile`);
	}, []);
};

type IProps = {
	children: ReactNode;
};

const SettingsLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Profile", href: `/account/settings/profile` },
		{ title: "Systems", href: "/account/settings/systems" },
	];

	return (
		<div>
			<PageTab tabs={tabs} />
			<div className="mt-6">{children}</div>
		</div>
	);
};

export const NestedSettingsLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>
		<SettingsLayout>{children}</SettingsLayout>
	</AccountLayout>
);

export default SettingsHome;
