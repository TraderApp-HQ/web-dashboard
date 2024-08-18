import PageTab from "~/components/AccountLayout/Tabs";
import { ROUTES } from "~/config/constants";

const WalletTabSection = () => {
	const tabs = [
		{ title: "Main", href: ROUTES.wallet.wallets },
		{ title: "Spot", href: ROUTES.wallet.spot },
		{ title: "Futures", href: ROUTES.wallet.futures },
	];

	return (
		<div className="w-full mb-6">
			<PageTab tabs={tabs} />
		</div>
	);
};

export default WalletTabSection;
