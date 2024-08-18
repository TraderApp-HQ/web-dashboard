import { useRouter } from "next/router";
import { useEffect } from "react";
import { UsersService } from "~/apis/handlers/users";
import type { UserRole } from "~/apis/handlers/users/enums";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

interface IUseProtectedRoute {
	path: string;
	roles?: UserRole[];
}
const useProtectedRoute = ({ path, roles }: IUseProtectedRoute) => {
	const router = useRouter();

	useEffect(() => {
		const usersService = new UsersService();
		const userData = usersService.getDataFromToken();
		if (!userData) {
			router.push(`${LAYOUT_ROUTES.auth}${ROUTES.login}`);
			return;
		}

		// check if the user role has any of the specified allowed roles
		if (roles && !roles.some((role) => userData.role.includes(role))) {
			router.push(`${LAYOUT_ROUTES.account}${ROUTES.dashboard.homepage}`);
			return;
		}
	}, [path]);
};

export default useProtectedRoute;
