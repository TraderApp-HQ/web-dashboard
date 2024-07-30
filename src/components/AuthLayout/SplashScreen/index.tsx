import React from "react";
import TraderAppLogoPale from "~/components/icons/TraderAppLogoWhite";
import TraderAppWalletPageSample from "~/components/icons/TraderAppWalletPageSample";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center bg-[#102477] h-full text-white">
      <div className="flex flex-col justify-center items-center space-y-12">
        <TraderAppLogoPale />
        <div className="flex flex-col items-center justify-center space-y-10">
          <TraderAppWalletPageSample />
          <div>
            <h3 className="text-[#F0F5FF] text-[32px] font-bold">Easy trading</h3>
            <p className="text-[#E1E6EF] text-sm font-normal">Trading made easy with TraderApp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
