import React from "react";
import { useSideNav } from "~/contexts/NavContext";
import TraderAppLogo from "~/components/icons/TraderAppLogo";
import MenuIcon from "~/components/icons/MenuIcon";

const MobileTopHeader = () => {
	const { toggleSideNav } = useSideNav();

	return (
		<div className="flex justify-between items-end py-4 px-8 md:hidden h-full bg-white">
			<div>
				<TraderAppLogo />
			</div>
			<div
				onClick={() => toggleSideNav(true)}
				className="flex items-center space-x-4 scale-125"
			>
				<MenuIcon />
			</div>
		</div>
	);
};

export default MobileTopHeader;
