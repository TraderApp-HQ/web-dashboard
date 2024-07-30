import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import MobileTopHeader from "~/components/AccountLayout/MobileTopHeader";
import SideNav from "~/components/AccountLayout/SideNav";
import TopHeader from "~/components/AccountLayout/TopHeader";
import { useSideNav } from "~/contexts/NavContext";
import useProtectedRoute from "~/hooks/useProtectedRoute";
// import { requireUserSession } from "~/utils/userSession";

type Props = {
  children: ReactNode;
};

const AccountLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  useProtectedRoute({ path: router.pathname });
  const { showSideNav } = useSideNav();
  return (
    <div className="h-screen relative md:flex bg-[#F6F8FE]">
      {/* Side nav */}
      <div
        className={`${
          showSideNav ? "absolute z-[1000]" : "hidden"
        } h-full w-full bg-[#F2F5FE] top-0 left-0 sm:block sm:w-[19%] 2xl:w-[16%]`}
      >
        <SideNav clientApp={'USER_DASHBOARD'} />
      </div>
      <div className="h-full right-0 sm:w-[81%] 2xl:w-[84%] sm:absolute">
        {/* Top header */}
        <div className="h-[10%] border-b">
          <TopHeader />
          <MobileTopHeader />
        </div>
        {/* Body */}
        <div className="h-[90%] overflow-y-auto py-6 px-4 md:px-12 md:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AccountLayout
