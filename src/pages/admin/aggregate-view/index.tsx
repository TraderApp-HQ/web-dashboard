import React from "react";
import AdminLayout from "~/components/AdminLayout/Layout";

const AggregateView = () => {
	return <div>Aggregate View</div>;
};

AggregateView.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default AggregateView;
