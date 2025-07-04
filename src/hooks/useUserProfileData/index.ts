import { useCallback, useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import { capitalizeFirstLetter } from "~/helpers";
import { useFetch } from "../useFetch";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { UserRole } from "~/apis/handlers/users/enums";

const useUserProfileData = () => {
	const [userId, setUserId] = useState("");
	const [userFirstName, setUserFirstName] = useState("");
	const [userLastName, setUserLastName] = useState("");
	const [userEmail, setUserEamil] = useState("");
	const [userPhoneNumber, setUserPhoneNumber] = useState("");
	const [userCountryName, setUserCountryName] = useState("");
	const [userInitials, setUserInitials] = useState("");
	const [userFullName, setUserFullName] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const usersService = new UsersService();
	const fetchUser = useCallback(() => usersService.getUser({}), [usersService]);
	const {
		data: userProfile,
		isSuccess: isUserProfileSuccess,
		isLoading: isUserProfileLoading,
		isError: isUserProfileError,
		error: userProfileError,
		refetch: refetchUserProfile,
	} = useFetch({
		queryKey: [UsersQueryId.userProfile],
		queryFn: fetchUser,
	});

	useEffect(() => {
		if (userProfile && isUserProfileSuccess) {
			setUserId(userProfile.id);
			setUserFirstName(userProfile.firstName);
			setUserLastName(userProfile.lastName);
			setUserEamil(userProfile.email);
			setUserPhoneNumber(userProfile.phone);
			setUserCountryName(userProfile.countryName);
			setUserInitials(
				`${userProfile.firstName?.[0]?.toUpperCase()}${userProfile.lastName?.[0]?.toUpperCase()}`,
			);
			setUserFullName(
				`${capitalizeFirstLetter(userProfile.firstName)} ${capitalizeFirstLetter(userProfile.lastName)}`,
			);
			setIsAdmin(
				userProfile.role.includes(UserRole.ADMIN) ||
					userProfile.role.includes(UserRole.SUPER_ADMIN),
			);
		}
	}, [userProfile, isUserProfileSuccess]);

	return {
		userProfile,
		userId,
		userFirstName,
		userLastName,
		userEmail,
		userInitials,
		userFullName,
		userPhoneNumber,
		userCountryName,
		isUserProfileSuccess,
		isUserProfileLoading,
		isUserProfileError,
		userProfileError,
		isAdmin,
		refetchUserProfile,
	};
};

export default useUserProfileData;
