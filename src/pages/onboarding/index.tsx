import { useRouter } from "next/router";
import React from "react";
import TraderAppLogoPale from "~/components/icons/TraderAppLogoWhite";
import OnboardingCarousel from "~/components/OnboardingCarousel";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import useUnProtectedRoute from "~/hooks/useUnProtectedRoute";

const Onboarding = () => {
	const router = useRouter();
	useUnProtectedRoute({ path: router.pathname });
	return (
		<div className="h-screen overflow-y-auto  bg-blue-800">
			<div className="px-5 py-12">
				<TraderAppLogoPale width={103} height={35} />
			</div>
			<div className="flex flex-col">
				<div className="px-4 w-full">
					<OnboardingCarousel />
				</div>
				<div className="px-4 w-full pt-20">
					<div className="py-[16px] space-y-[16px] flex flex-col items-center">
						<button
							type="button"
							className="transition-opacity duration-300 bg-white rounded-2xl px-[10px] py-4 font-semibold w-full md:w-[25rem] text-blue-800 disabled:opacity-60"
							onClick={() => {
								router.push(LAYOUT_ROUTES.auth + ROUTES.signup);
							}}
						>
							Get Started
						</button>
						<div
							className="text-white text-center cursor-pointer"
							onClick={() => {
								router.push(LAYOUT_ROUTES.auth + ROUTES.login);
							}}
						>
							Login
						</div>
					</div>
				</div>
			</div>
			<div className="w-96 h-8 left-0 bottom-0 right-0 absolute mx-auto">
				<div className="w-32 h-[5px] left-[130px] bottom-[10px] absolute bg-white rounded-[100px]" />
			</div>
		</div>
	);
};

export default Onboarding;
