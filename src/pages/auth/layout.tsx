import React, { ReactNode } from "react";
import SplashScreen from "~/components/AuthLayout/SplashScreen";

type Props = {
	children: ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children }) => {
	return (
		<div className="h-screen relative md:flex">
			<div className="hidden md:inline-block md:w-[45%]">
				<SplashScreen />
			</div>
			<div className="h-screen overflow-y-auto flex justify-center items-center md:w-[55%]">
				<div className="px-5 md:px-0 w-full md:w-[550px]">{children}</div>
			</div>
		</div>
	);
};

export default AuthLayout;
