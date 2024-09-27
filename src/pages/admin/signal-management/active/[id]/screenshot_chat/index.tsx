import AssetBreakdown from "..";
import SignalChart from "~/components/AdminLayout/Signal/SignalChart";

const ScreenshotChart = () => {
	return <SignalChart />;
};

// ScreenshotChart.getLayout()
ScreenshotChart.getLayout = (page: React.ReactElement) => <AssetBreakdown>{page}</AssetBreakdown>;
export default ScreenshotChart;
