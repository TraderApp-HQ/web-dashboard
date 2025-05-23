import DropdownMenu, { DropdownMenuItem } from "../DropdownMenu";
import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "~/hooks/useCreate";
import LogoutIcon from "~/components/icons/LogoutIcon";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import UserProfileIcon from "~/components/icons/UserProfileIcon";
import useUserProfileData from "~/hooks/useUserProfileData";
import UserTile from "../UserTile";

const ProfileDropdown = () => {
	const usersService = new UsersService();
	const { userEmail, userFullName, userInitials } = useUserProfileData();

	// Setup query to backend
	const { mutate: logoutUser } = useCreate({
		mutationFn: usersService.logoutUser.bind(usersService),
	});

	const handleLogout = () => {
		logoutUser();
	};

	return (
		<DropdownMenu
			trigger={
				<UserTile nameIntitials={userInitials} size={{ width: "39px", height: "39px" }} />
			}
			position="left"
			direction="bottom"
			className="min-w-[243px] w-full min-w-[768px]:mr-12 "
		>
			<div>
				<div className="flex flex-row items-center pb-4">
					<div className="mr-2">
						<UserTile
							nameIntitials={userInitials}
							size={{ width: "39px", height: "39px" }}
						/>
					</div>
					<div className="flex flex-col max-w-[180px]">
						<p className="text-[#3C3C3F] font-bold text-[14px] pb-1 break-words">
							{userFullName}
						</p>
						<p className="text-[14px] text-[#311A0A] break-words">{userEmail}</p>
					</div>
				</div>
				<hr className="pb-4" />
				<div className="flex flex-col">
					<DropdownMenuItem
						type="link"
						to={LAYOUT_ROUTES.account + ROUTES.settings}
						className="pl-0"
					>
						<p className="flex cursor-pointer pb-2">
							<UserProfileIcon color="#3C3C3F" />
							<span className="text=[14px] ml-3 text-[#3C3C3F] hover:text-[#1836B2]">
								View Profile
							</span>
						</p>
					</DropdownMenuItem>
					<DropdownMenuItem type="button" className="pl-0" onClick={handleLogout}>
						<p className="flex cursor-pointer">
							<LogoutIcon />
							<span className="text=[14px] ml-3 text-[#3C3C3F] hover:text-[#1836B2]">
								Logout
							</span>
						</p>
					</DropdownMenuItem>
				</div>
			</div>
		</DropdownMenu>
	);
};

export default ProfileDropdown;
