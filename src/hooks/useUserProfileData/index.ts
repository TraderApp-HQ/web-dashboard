import { useCallback, useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import { capitalizeFirstLetter } from "~/helpers";
import { useFetch } from "../useFetch";
import { UsersQueryId } from "~/apis/handlers/users/constants";

const useUserProfileData = () => {
	const [userId, setUserId] = useState("");
	const [userFirstName, setUserFirstName] = useState("");
	const [userLastName, setUserLastName] = useState("");
	const [userEmail, setUserEamil] = useState("");
	const [userPhoneNumber, setUserPhoneNumber] = useState("");
	const [userCountryName, setUserCountryName] = useState("");
	const [userInitials, setUserInitials] = useState("");
	const [userFullName, setUserFullName] = useState("");

	const usersService = new UsersService();
	const fetchUser = useCallback(() => usersService.getUser({}), [usersService]);
	const {
		data: userProfile,
		isSuccess: isUserProfileSuccess,
		isLoading: isUserProfileLoading,
		isError: isUserProfileError,
		error: userProfileError,
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
	};
};

export default useUserProfileData;
