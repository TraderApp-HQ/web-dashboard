import { useRouter } from "next/router";
import React, { useEffect, ReactNode } from "react";
import PageTab from "~/components/AccountLayout/Tabs";
import AdminLayout from "~/components/AdminLayout/Layout";
import Button from "~/components/common/Button";

const SignalsHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`signal-management/active`);
	}, []);
};

type IProps = {
	children: ReactNode;
};

const SignalsLayout = ({ children }: IProps) => {
	const router = useRouter();
	const tabs = [
		{ title: "Active Signals", href: "active" },
		{ title: "Signals History", href: "history" },
	];

	const handleCreateSignal = () => {
		router.push("create-signal");
	};

	return (
		<div>
			<div className="flex mb-8 justify-between items-center">
				<div className="w-12/12 lg:w-2.5/12">
					<PageTab tabs={tabs} />
				</div>
				<Button onClick={handleCreateSignal} labelText="Create signal" />
			</div>

			<div className="mt-6" />
			{children}
		</div>
	);
};

export const AdminNestedSignalsLayout: React.FC<IProps> = ({ children }) => (
	<AdminLayout>
		<SignalsLayout>{children}</SignalsLayout>
	</AdminLayout>
);

export default SignalsHome;
