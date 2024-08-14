import React, { ReactNode } from "react";
import SplashScreen from "~/components/AuthLayout/SplashScreen";
import TraderAppLogo from "~/components/icons/TraderAppLogo";

type Props = {
	children: ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children }) => {
	return (
		<div className="h-screen relative md:flex">
			<div className="hidden md:inline-block md:w-[45%]">
				<SplashScreen />
			</div>
			<div className="h-screen overflow-y-auto md:flex md:justify-center  md:w-[55%]">
				<div className="flex items-center justify-center mt-12 mb-8 md:hidden">
					<TraderAppLogo />
				</div>
				<div className="px-5 md:px-0 md:w-[550px]">{children}</div>
			</div>
		</div>
	);
};

export default AuthLayout;
