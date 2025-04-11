import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import MobileTopHeader from "~/components/AccountLayout/MobileTopHeader";
import SideNav from "~/components/AccountLayout/SideNav";
import TopHeader from "~/components/AccountLayout/TopHeader";
import { useSideNav } from "~/contexts/NavContext";
import useProtectedRoute from "~/hooks/useProtectedRoute";
import { UserRole } from "~/apis/handlers/users/enums";

type Props = {
	children: ReactNode;
};

const AdminLayout: React.FC<Props> = ({ children }) => {
	const router = useRouter();
	useProtectedRoute({ path: router.pathname, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] });
	const { showSideNav } = useSideNav();
	return (
		<div className="h-screen relative md:flex bg-[#F2F5FEB5]">
			{/* Side nav */}
			<div
				className={`${
					showSideNav ? "absolute z-[1000]" : "hidden"
				} h-full w-full bg-white top-0 left-0 2xl:block sm:block sm:w-[19%] 2xl:w-[16%]`}
			>
				<SideNav clientApp={"ADMIN_DASHBOARD"} />
			</div>
			<div className="h-full right-0 w-full md:w-[81%] 2xl:w-[84%] sm:absolute mt-4">
				{/* Top header */}
				<div className="h-[10%]">
					<TopHeader clientApp="ADMIN_DASHBOARD" />
					<MobileTopHeader />
				</div>
				{/* Body */}
				<div className="h-[90%] overflow-y-auto px-4 md:px-12 scrollbar-hide">
					<div className="border-t mt-4 py-4 md:py-6" />
					{children}
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;
