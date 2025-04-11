import React from "react";
import TraderAppIllustration from "~/components/icons/TraderAppIllustration";
import TraderAppLogoPale from "~/components/icons/TraderAppLogoWhite";

const SplashScreen = () => {
	return (
		<div className="flex items-center justify-center bg-[#102477] h-full text-white">
			<div className="flex flex-col justify-center items-center space-y-12">
				<TraderAppLogoPale width={260} height={56} />
				<div className="flex flex-col items-center justify-center space-y-10">
					<TraderAppIllustration />
					<div>
						<h3 className="text-[#F0F5FF] text-[32px] font-bold">Easy trading</h3>
						<p className="text-[#E1E6EF] text-sm font-normal">
							Trading made easy with TraderApp
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SplashScreen;
