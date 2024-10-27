import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import MobileTopHeader from "~/components/AccountLayout/MobileTopHeader";
import SideNav from "~/components/AccountLayout/SideNav";
import TopHeader from "~/components/AccountLayout/TopHeader";
import { useSideNav } from "~/contexts/NavContext";
import useProtectedRoute from "~/hooks/useProtectedRoute";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";

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
					showSideNav ? "absolute z-[1000]" : "hidden"
				} h-full w-full bg-[#F2F5FE] top-0 left-0 md:block md:w-[19%] 2xl:w-[16%]`}
			>
				<SideNav clientApp={"USER_DASHBOARD"} />
			</div>
			<div className="h-full right-0 md:w-[81%] 2xl:w-[84%] md:absolute">
				{/* Top header */}
				<div className="h-[10%] border-b">
					{router.pathname === `${LAYOUT_ROUTES.account}${ROUTES.taskcenter.home}` ? (
						<section
							className="flex items-center gap-2 cursor-pointer w-fit pt-6 pl-12"
							onClick={() => router.replace(`${ROUTES.dashboard.backButton}`)}
						>
							<LeftArrowIcon />
							<p className="font-semibold text-lg text-textColor">Back</p>
						</section>
					) : (
						<>
							<TopHeader />
							<MobileTopHeader />
						</>
					)}
				</div>
				{/* Body */}
				<div className="h-[90%] overflow-y-auto py-6 px-4 md:px-12 md:py-8">{children}</div>
			</div>
		</div>
	);
};

export default AccountLayout;
