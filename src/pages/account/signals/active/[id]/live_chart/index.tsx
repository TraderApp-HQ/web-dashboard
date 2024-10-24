/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import AssetBreakdown from "~/pages/account/signals/active/[id]";
import TradingViewWidget from "~/components/TradingViewWidget";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import { ISignal } from "~/apis/handlers/assets/interfaces";

interface Signal {
	asset: {
		id: string;
		name: string;
		symbol: string;
		logo: string;
	};
}

const LiveChart = () => {
	const { isLoading, isSuccess, activeSignals } = useFetchActiveSignals({});
	const [selectedsignal, setSelectedsignal] = useState<Signal | ISignal>({
		asset: {
			id: "",
			name: "",
			symbol: "",
			logo: "",
		},
	});
	const [activeTab, setActiveTab] = useState("BNB");

	useEffect(() => {
		if (!isLoading && isSuccess) {
			setSelectedsignal(activeSignals[0]);
		}
	}, [isLoading, isSuccess, activeSignals]);

	const getAssetData = (id = "") => {
		const activeSignal = activeSignals.find((signal) => signal.asset.id === id);
		if (activeSignal) setSelectedsignal(activeSignal);
	};
	const handleTabClick = (name = "", id = "") => {
		setActiveTab(name);
		getAssetData(id);
	};

	return (
		<>
			{!isLoading && isSuccess && (
				<div className="sm:w-[100%] grid gap-y-8">
					<div className="flex gap-5 border-b w-[48%]">
						{activeSignals.map((signal) => (
							<div
								key={signal.asset.id}
								onClick={() => handleTabClick(signal.asset.name, signal.asset.id)}
								className={`${activeTab == signal.asset.name ? "border-b-2 border-[#1836b2] text-[#1836b2]" : "cursor-pointer"}`}
							>
								{signal.asset.name}
							</div>
						))}
					</div>
					<div className="flex justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
						<TradingViewWidget signal={selectedsignal} />
					</div>
				</div>
			)}
		</>
	);
};

LiveChart.getLayout = (page: React.ReactElement) => <AssetBreakdown>{page}</AssetBreakdown>;
export default LiveChart;
