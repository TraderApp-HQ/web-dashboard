import React, { useState } from "react";
import { useFetchData } from "~/hooks/useFetchData";

const Component: React.FC = () => {
	const { data, loading, error } = useFetchData("/api/data");

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return <div>{data?.data}</div>;
};

export default Component;
