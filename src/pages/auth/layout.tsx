import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import SplashScreen from "~/components/AuthLayout/SplashScreen";
import LoadingLogo from "~/components/common/LoadingLogo";
import useUnProtectedRoute from "~/hooks/useUnProtectedRoute";

type Props = {
	children: ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children }) => {
	const router = useRouter();
	const { isLoading } = useUnProtectedRoute({ path: router.pathname });

	if (isLoading) {
		return <LoadingLogo />;
	}
	return (
		<div className="h-screen relative md:flex">
			<div className="hidden md:inline-block md:w-[45%]">
				<SplashScreen />
			</div>
			<div className="h-screen overflow-y-auto flex justify-center items-center md:w-[55%] bg-[#E5E9F8]">
				<div className="px-5 md:px-0 w-full md:w-[550px]">{children}</div>
			</div>
		</div>
	);
};

export default AuthLayout;
