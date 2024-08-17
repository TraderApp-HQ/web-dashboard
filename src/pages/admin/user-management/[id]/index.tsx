import { useRouter } from "next/router";
import React, { useEffect } from "react";
import AdminLayout from "~/components/AdminLayout/Layout";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";

function Index() {
	const router = useRouter();
	useEffect(() => {
		router.push(
			`${LAYOUT_ROUTES.admin}/${ROUTES.usermanagement.homepage}/${ROUTES.usermanagement.details}`,
		);
	}, [router]);

	return <div />;
}

Index.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default Index;
