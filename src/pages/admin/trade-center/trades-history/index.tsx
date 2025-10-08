import { AdminNestedTradeCenterLayout } from "..";

const TradesHistory = () => {
	return (
		<section>
			<h1>Trades History Page</h1>
		</section>
	);
};

TradesHistory.getLayout = (page: React.ReactElement) => (
	<AdminNestedTradeCenterLayout>{page}</AdminNestedTradeCenterLayout>
);

export default TradesHistory;
