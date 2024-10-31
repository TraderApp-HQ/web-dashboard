import { useCallback } from "react";
import { UsersService } from "~/apis/handlers/users";
import { capitalizeFirstLetter } from "~/helpers";
import { useFetch } from "../useFetch";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import type { IUserProfile } from "~/apis/handlers/users/interfaces";

interface UseUserProfileDataReturn {
	userProfile: IUserProfile | undefined;
	userId: string;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	userInitials: string;
	userFirstNameInitials: string;
	userLastNameInitials: string;
	userFullName: string;
	userPhoneNumber: string;
	userCountryName: string;
}

const useUserProfileData = (): UseUserProfileDataReturn => {
	const usersService = new UsersService();
	const fetchUser = useCallback(() => usersService.getUser({}), [usersService]);
	const { data: userProfile } = useFetch({
		queryKey: [UsersQueryId.userProfile],
		queryFn: fetchUser,
	});

	const userId = userProfile?.id as string;
	const userFirstName = userProfile?.firstName as string;
	const userLastName = userProfile?.lastName as string;
	const userEmail = userProfile ? userProfile?.email : " ";
	const userPhoneNumber = userProfile ? userProfile?.phone : " ";
	const userCountryName = userProfile ? userProfile?.countryName : " ";

	const userFirstNameInitials = userFirstName?.[0]?.toUpperCase();
	const userLastNameInitials = userLastName?.[0]?.toUpperCase();
	const userInitials = userProfile ? `${userFirstNameInitials}${userLastNameInitials}` : " ";

	const userFullName = userProfile
		? `${capitalizeFirstLetter(userFirstName)} ${capitalizeFirstLetter(userLastName)}`
		: " ";

	return {
		userProfile,
		userId,
		userFirstName,
		userLastName,
		userEmail,
		userInitials,
		userFirstNameInitials,
		userLastNameInitials,
		userFullName,
		userPhoneNumber,
		userCountryName,
	};
};

export default useUserProfileData;
