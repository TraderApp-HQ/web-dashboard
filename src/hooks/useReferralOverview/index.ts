import { useCallback } from "react";
import { UsersService } from "~/apis/handlers/users";
import { useFetch } from "../useFetch";

export const useReferralOverview = () => {
	const usersService = new UsersService();

	const fetchReferralOverview = useCallback(
		() => usersService.getReferralOverview(),
		[usersService],
	);

	return useFetch({
		queryKey: ["referralOverview"],
		queryFn: fetchReferralOverview,
	});
};
