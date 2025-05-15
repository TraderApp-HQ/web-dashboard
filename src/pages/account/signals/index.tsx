import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AccountLayout from "~/components/AccountLayout/Layout";

const SignalsHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`signals/active`);
	}, []);
};

type IProps = {
	children: ReactNode;
};

const SignalsLayout = ({ children }: IProps) => {
	const tabs = [
		{ title: "Active Signals", href: "/account/signals/active" },
		{ title: "Signals History", href: "/account/signals/history" },
	];

	return (
		<div>
			<PageTab tabs={tabs} />
			<div className="mt-6">{children}</div>
		</div>
	);
};

export const NestedSignalsLayout: React.FC<IProps> = ({ children }) => (
	<AccountLayout>
		<SignalsLayout>{children}</SignalsLayout>
	</AccountLayout>
);

export default SignalsHome;
