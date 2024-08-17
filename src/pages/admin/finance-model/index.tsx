import React from "react";
import AdminLayout from "~/components/AdminLayout/Layout";

const FinanceModel = () => {
	return <div>Finance Model</div>;
};

FinanceModel.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default FinanceModel;
