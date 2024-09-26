import TraderAppLogo from "~/components/icons/TraderAppLogo";
import { useSideNav } from "~/contexts/NavContext";
import type { SidenavLink } from "./config";
import { AdminNavLinks, AdminNavLinksExtras, NavLinks, NavLinksExtras } from "./config";
import Link from "next/link";
import { useRouter } from "next/router";
import CancelIcon from "~/components/icons/CancelIcon";
import LogoutIcon from "~/components/icons/LogoutIcon";
import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "~/hooks/useCreate";

export interface NavLinkItemProps {
	navlink: SidenavLink;
	toggleSideNav: (open: boolean) => void;
}

interface ISideNavProps {
	clientApp?: "USER_DASHBOARD" | "ADMIN_DASHBOARD";
}

const NavLinkItem = ({ navlink, toggleSideNav }: NavLinkItemProps) => {
	const router = useRouter();
	const isActive = router.pathname.includes(navlink.path.replace("../", ""));
	return (
		<li onClick={() => toggleSideNav(false)}>
			<Link
				href={navlink.path}
				className={`${isActive ? "active" : "inactive"} flex items-center space-x-2 lg:space-x-4 font-bold text-[#414141] text-sm p-2.5 rounded-lg 2xl:text-base 2xl:p-3`}
			>
				<i>
					<navlink.icon color={isActive ? "white" : "#414141"} />
				</i>
				<span>{navlink.text}</span>
			</Link>
		</li>
	);
};

const SideNav: React.FC<ISideNavProps> = ({ clientApp = "USER_DASHBOARD" }) => {
	const { toggleSideNav } = useSideNav();
	const isAdmin = clientApp === "ADMIN_DASHBOARD";
	const navLinks = isAdmin ? AdminNavLinks : NavLinks;
	const navLinksExtras = isAdmin ? AdminNavLinksExtras : NavLinksExtras;
	const containerHeight = isAdmin ? "h-[70%]" : "h-[60%] md:h-[64%]";
	const usersService = new UsersService();

	// Setup query to backend
	const { mutate: logoutUser } = useCreate({
		mutationFn: usersService.logoutUser.bind(usersService),
	});

	const handleLogout = () => {
		logoutUser();
	};

	return (
		<div className="h-full">
			<div className="flex items-center justify-between h-[10%] px-8">
				<TraderAppLogo />
				<div className="md:hidden" onClick={() => toggleSideNav(false)}>
					<CancelIcon />
				</div>
			</div>
			<div className={`${containerHeight} p-3 lg:p-8 overflow-y-auto`}>
				<ul className="space-y-6">
					{navLinks.map((navlink, index) => (
						<NavLinkItem key={index} navlink={navlink} toggleSideNav={toggleSideNav} />
					))}
				</ul>
			</div>
			{!isAdmin && <div className="border mx-10"></div>}
			<div className="overflow-y-auto px-4 lg:px-8 py-4">
				<ul className="space-y-6">
					{navLinksExtras.map((navlink, index) => (
						<NavLinkItem key={index} navlink={navlink} toggleSideNav={toggleSideNav} />
					))}
					<li
						className={`flex items-center space-x-2 lg:space-x-4 font-bold text-[#414141] text-[16px] p-3 rounded cursor-pointer`}
					>
						<LogoutIcon />
						<span onClick={handleLogout}>Logout</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideNav;
