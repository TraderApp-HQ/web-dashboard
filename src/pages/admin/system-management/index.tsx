import React from "react";
import AdminLayout from "~/components/AdminLayout/Layout";

const SystemManagement = () => {
	return <div>System Management</div>;
};

SystemManagement.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default SystemManagement;
