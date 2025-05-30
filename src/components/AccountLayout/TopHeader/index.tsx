import Link from "next/link";
import { useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import { UserRole } from "~/apis/handlers/users/enums";
import RightArrowIcon from "~/components/icons/RightArrowIcon";
import { LAYOUT_ROUTES } from "~/config/constants";
import NotificationsDropdown from "../NotificationsDropdown";
import ProfileDropdown from "../ProfileDropdown";

interface ITopHeaderProps {
	clientApp?: "USER_DASHBOARD" | "ADMIN_DASHBOARD";
}
const TopHeader: React.FC<ITopHeaderProps> = ({ clientApp = "USER_DASHBOARD" }) => {
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
			</div>
			<div className="flex items-center space-x-4">
				<NotificationsDropdown />
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default TopHeader;
