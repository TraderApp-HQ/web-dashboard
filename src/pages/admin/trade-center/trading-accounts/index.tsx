import { AdminNestedTradeCenterLayout } from "..";

const TradingAccounts = () => {
	return (
		<section>
			<h1>Trading Accounts Page</h1>
		</section>
	);
};

TradingAccounts.getLayout = (page: React.ReactElement) => (
	<AdminNestedTradeCenterLayout>{page}</AdminNestedTradeCenterLayout>
);

export default TradingAccounts;
