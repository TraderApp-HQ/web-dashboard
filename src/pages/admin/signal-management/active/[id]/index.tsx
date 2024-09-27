import React, { ReactNode } from "react";
import SignalDetail from "~/components/AdminLayout/Signal/SignalDetails";

interface IProps {
	children: ReactNode;
}

const AssetBreakdown: React.FC<IProps> = ({ children }) => {
	return <SignalDetail>{children}</SignalDetail>;
};

export default AssetBreakdown;
