import React from "react";
import HamburgerIcon from "~/components/icons/HamburgerIcon";
import { useSideNav } from "~/contexts/NavContext";
import ProfileDropdown from "../ProfileDropdown";
import NotificationsDropdown from "../NotificationsDropdown";

const MobileTopHeader = () => {
	const { toggleSideNav } = useSideNav();

	return (
		<div className="flex justify-between items-center p-4 md:hidden">
			<div onClick={() => toggleSideNav(true)}>
				<HamburgerIcon />
			</div>
			<div className="flex items-center space-x-4">
				<NotificationsDropdown notificationIconProps={{ width: "32px", height: "32px" }} />
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default MobileTopHeader;
