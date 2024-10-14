import { useEffect, useState } from "react";
import ProfileDropdown from "../ProfileDropdown";
import NotificationsDropdown from "../NotificationsDropdown";
import Link from "next/link";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import RightArrowIcon from "~/components/icons/RightArrowIcon";
import { UserRole } from "~/apis/handlers/users/enums";
import { UsersService } from "~/apis/handlers/users";
import { useRouter } from "next/router";
import IconButton from "../IconButton";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";

interface ITopHeaderProps {
	clientApp?: "USER_DASHBOARD" | "ADMIN_DASHBOARD";
}
const TopHeader: React.FC<ITopHeaderProps> = ({ clientApp }) => {
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const router = useRouter();
	const currentRoute = router.pathname;

	useEffect(() => {
		const usersService = new UsersService();
		const userData = usersService.getDataFromToken();
		if (
			userData?.role.includes(UserRole.ADMIN) ||
			userData?.role.includes(UserRole.SUPER_ADMIN)
		) {
			setIsAdmin(true);
		}
	}, []);
	return (
		<div className="justify-between items-center px-10 h-full hidden md:flex md:px-12">
			<div>
				{isAdmin && (
					<div className="flex-col justify-start items-start gap-1 inline-flex">
						<span className="text-slate-400 text-sm font-normal leading-tight">
							Switch Account
						</span>
						<div className="justify-center items-center gap-1 inline-flex">
							{clientApp === "ADMIN_DASHBOARD" ? (
								<Link
									className="text-slate-900 text-base font-bold leading-normal"
									href={`${LAYOUT_ROUTES.account}`}
								>
									User Dashboard
								</Link>
							) : (
								<Link href={`${LAYOUT_ROUTES.admin}`}>Admin Dashboard</Link>
							)}
							<RightArrowIcon />
						</div>
					</div>
				)}
				{!isAdmin &&
					currentRoute === `${LAYOUT_ROUTES.account}${ROUTES.taskcenter.home}` && (
						<IconButton
							onClick={() => router.push(`${ROUTES.dashboard.backButton}`)}
							btnClass="gap-2"
						>
							<LeftArrowIcon />
							Back
						</IconButton>
					)}
			</div>
			<div className="flex items-center space-x-4">
				<NotificationsDropdown />
				<ProfileDropdown />
			</div>
		</div>
	);
};

TopHeader.defaultProps = {
	clientApp: "USER_DASHBOARD",
};

export default TopHeader;
