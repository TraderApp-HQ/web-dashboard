import TraderAppLogo from "~/components/icons/TraderAppLogo";
import { useSideNav } from "~/contexts/NavContext";
import type { SidenavLink } from "./config";
import { AdminNavLinks, AdminNavLinksExtras, NavLinks, NavLinksExtras } from "./config";
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { User } from "~/lib/types";
import CancelIcon from "~/components/icons/CancelIcon";
import LogoutIcon from "~/components/icons/LogoutIcon";
import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "~/hooks/useCreate";
import { removeAccessToken } from "~/utils/localStorage";
import clsx from "clsx";

export interface NavLinkItemProps {
  navlink: SidenavLink;
  toggleSideNav: (open: boolean) => void;
}

interface ISideNavProps {
  clientApp?: "USER_DASHBOARD" | "ADMIN_DASHBOARD";
}

const NavLinkItem = ({ navlink, toggleSideNav }: NavLinkItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === navlink.path;
  return (
    <li onClick={() => toggleSideNav(false)}>
    <Link href={navlink.path}>
      <a className={clsx(
        isActive ? "active" : "inactive",
        "flex items-center space-x-4 font-bold text-[#414141] text-[20px] sm:text-[14px] p-3 rounded"
      )}>
        <i><navlink.icon color={isActive ? "white" : "#414141"} /></i>
        <span>{navlink.text}</span>
      </a>
    </Link>
  </li>
  )
}

const SideNav: React.FC<ISideNavProps> = ({ clientApp = "USER_DASHBOARD" }) => {
  const { toggleSideNav } = useSideNav();
  const isAdmin = clientApp === "ADMIN_DASHBOARD";
  const navLinks = isAdmin ? AdminNavLinks : NavLinks;
  const navLinksExtras = isAdmin ? AdminNavLinksExtras : NavLinksExtras;
  const containerHeight = isAdmin ? "h-[70%]" : "h-[60%] md:h-[64%]";
  const usersService = new UsersService();

  // Setup query to backend
  const {
    mutate: logoutUser
  } = useCreate({
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
      <div className={`${containerHeight} p-8 overflow-y-auto`}>
        <ul className="space-y-6">
          {navLinks.map((navlink, index) => (
            <NavLinkItem key={index} navlink={navlink} toggleSideNav={toggleSideNav} />
          ))}
        </ul>
      </div>
      {!isAdmin && <div className="border mx-10"></div>}
      <div className="overflow-y-auto px-8 py-4">
        <ul className="space-y-6">
          {navLinksExtras.map((navlink, index) => (
            <NavLinkItem key={index} navlink={navlink} toggleSideNav={toggleSideNav} />
          ))}
          <li className={`flex items-center space-x-4 font-bold text-[#414141] text-[16px] p-3 rounded cursor-pointer`}>
            <LogoutIcon />
            <span onClick={handleLogout}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
