import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import MobileTopHeader from "~/components/AccountLayout/MobileTopHeader";
import SideNav from "~/components/AccountLayout/SideNav";
import TopHeader from "~/components/AccountLayout/TopHeader";
import { useSideNav } from "~/contexts/NavContext";
import useProtectedRoute from "~/hooks/useProtectedRoute";

type Props = {
	children: ReactNode;
};

const AccountLayout: React.FC<Props> = ({ children }) => {
	const router = useRouter();
	useProtectedRoute({ path: router.pathname });

	const { showSideNav } = useSideNav();
	return (
		<div className="h-screen relative md:flex bg-[#F6F8FE]">
			{/* Side nav */}
			<div
				className={`${
					showSideNav
						? "absolute z-40 translate-x-0"
						: "absolute z-40 -translate-x-full md:translate-x-0"
				} h-full w-full bg-[#F2F5FE] top-0 left-0 md:block md:w-[24%] 2xl:w-[16%] transition-transform duration-300 ease-in`}
			>
				<SideNav clientApp={"USER_DASHBOARD"} />
			</div>
			<div className="h-full right-0 md:w-[76%] 2xl:w-[84%] md:absolute">
				{/* Top header */}
				<div className="h-[8%] md:h-[10%] border-b">
					<TopHeader />
					<MobileTopHeader />
				</div>
				{/* Body */}
				<div className="h-[90%] overflow-y-auto py-6 px-3 md:px-12 md:py-8">{children}</div>
			</div>
		</div>
	);
};

export default AccountLayout;
