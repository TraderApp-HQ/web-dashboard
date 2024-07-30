import PageTab from "~/components/AccountLayout/Tabs";
import { Outlet } from "@remix-run/react";
// import { requireUserSession } from "~/utils/userSession";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // await requireUserSession({ request })
  return null;
};

const Signals: React.FC = () => {
  const tabs = [
    { title: "Active Signals", href: "active" },
    { title: "Signals History", href: "history" },
  ];

  return (
    <div>
      <div className="w-[100%] md:w-[50%] lg:w-[35%] 2xl:w-[25%]">
        <PageTab tabs={tabs} />
      </div>
      <div className="mt-6" />
      <Outlet />
    </div>
  );
};

export default Signals;
