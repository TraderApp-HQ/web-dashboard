import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UsersService } from "~/apis/handlers/users";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

interface IUseUnProtectedRoute {
	path: string;
}
const useUnProtectedRoute = ({ path }: IUseUnProtectedRoute) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const usersService = new UsersService();
		const userData = usersService.getDataFromToken();
		if (userData) {
			router.push(`${LAYOUT_ROUTES.account}${ROUTES.dashboard.homepage}`);
			return;
		}

		setIsLoading(false);
	}, [path, router]);

	return { isLoading };
};

export default useUnProtectedRoute;
