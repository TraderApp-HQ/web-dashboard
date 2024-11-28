import { useRouter } from "next/router";
import { useEffect } from "react";
import { UsersService } from "~/apis/handlers/users";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

interface IUseUnProtectedRoute {
	path: string;
}
const useUnProtectedRoute = ({ path }: IUseUnProtectedRoute) => {
	const router = useRouter();

	useEffect(() => {
		const usersService = new UsersService();
		const userData = usersService.getDataFromToken();
		console.log("access token from use unprotected route hook: ", userData);
		if (userData) {
			router.push(`${LAYOUT_ROUTES.account}${ROUTES.dashboard.homepage}`);
			return;
		}
	}, [path]);
};

export default useUnProtectedRoute;
