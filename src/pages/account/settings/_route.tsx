import { Outlet } from "@remix-run/react";
import React from "react";
import PageTab from "~/components/AccountLayout/Tabs";

const Settings = () => {
  const tabs = [
    { title: "Profile", href: "profile" },
    { title: "Systems", href: "systems" },
  ];

  return (
    <div>
      <div className="w-12/12 lg:w-10/12 2xl:w-10/12 border-b">
        <PageTab tabs={tabs} />
      </div>
      <div className="mt-6" />
      <Outlet />
    </div>
  );
};

export default Settings;
