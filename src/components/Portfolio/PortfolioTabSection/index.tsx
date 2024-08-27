import PageTab from "~/components/AccountLayout/Tabs";
import { ROUTES } from "~/config/constants";

const PortfolioTabSection = () => {
	const tabs = [
		{ title: "Open Trades", href: ROUTES.tradeCenter.openTrade },
		{ title: "Trade History", href: ROUTES.tradeCenter.tradeHistory },
		{ title: "Trading Rules", href: ROUTES.tradeCenter.tradingRules },
	];

	return (
		<div>
			<PageTab tabs={tabs} />
			<div className="mt-6" />
		</div>
	);
};
export default PortfolioTabSection;
