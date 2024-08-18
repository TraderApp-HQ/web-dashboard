import PageTab from "~/components/AccountLayout/Tabs";
import { ROUTES } from "~/config/constants";

const PortfolioTabSection = () => {
	const tabs = [
		{ title: "Open Trades", href: ROUTES.portfolio.openTrade },
		{ title: "Trade History", href: ROUTES.portfolio.tradeHistory },
		{ title: "Trading Rules", href: ROUTES.portfolio.tradingRules },
	];

	return (
		<div>
			<div className="w-12/12 lg:w-10/12 2xl:w-10/12 text-base">
				<PageTab tabs={tabs} />
			</div>
			<div className="mt-6" />
		</div>
	);
};
export default PortfolioTabSection;
