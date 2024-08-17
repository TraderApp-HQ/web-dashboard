import React from "react";
import AdminLayout from "~/components/AdminLayout/Layout";

const Settings = () => {
	return <div>Settings</div>;
};

Settings.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default Settings;
