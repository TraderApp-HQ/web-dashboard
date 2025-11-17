import { ReactNode } from "react";
import TradeAnalysis from "~/components/common/TradeAnalysis";

interface IProps {
	children: ReactNode;
}

const TradeAnalysisLayout: React.FC<IProps> = ({ children }) => {
	return <TradeAnalysis>{children}</TradeAnalysis>;
};

export default TradeAnalysisLayout;
