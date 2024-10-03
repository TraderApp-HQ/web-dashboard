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
			<div className="w-12/12 lg:w-10/12 2xl:w-10/12 text-base">
				<PageTab tabs={tabs} />
			</div>
			<div className="mt-6" />
		</div>
	);
};
export default PortfolioTabSection;
