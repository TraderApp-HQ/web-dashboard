import EyesIcon from "~/components/icons/EyesIcon";
import HidenBalance from "~/components/Wallet/HidenBalance";
import data from "~/data/wallet/data.json";
import { useState } from "react";

const OpenTradeStats = () => {
	const [showBalance, handleShowBalance] = useState(true);
	// const data = useLoaderData<typeof loader>();
	return (
		<div>
			<div
				className="flex justify-start space-x-2"
				onClick={() => handleShowBalance(!showBalance)}
			>
				<h4 className="font-bold text-base">Total Balance</h4>
				<EyesIcon />
			</div>
			<h3 className="mt-3 text-xl font-bold">
				{showBalance ? (
					`${data?.wallet?.totalBalance} USD`
				) : (
					<HidenBalance className="mt-6 mb-2" />
				)}
			</h3>
		</div>
	);
};

export default OpenTradeStats;
