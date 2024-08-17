import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AdminHome = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(`${LAYOUT_ROUTES.admin}${ROUTES.dashboard.homepage}`);
	}, []);

	return null;
};

export default AdminHome;
