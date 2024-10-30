/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import AssetBreakdown from "~/pages/account/signals/active/[id]";
import TradingViewWidget from "~/components/TradingViewWidget";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import { ISignal } from "~/apis/handlers/assets/interfaces";
import { useRouter } from "next/router";

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
	const router = useRouter();

	const id = router.query.id as string;

	useEffect(() => {
		if (!isLoading && isSuccess) {
			const signalAsset = activeSignals.filter((asset) => asset.id === id);
			setSelectedsignal(signalAsset[0]);
		}
	}, [isLoading, isSuccess, activeSignals]);

	return (
		<>
			{!isLoading && isSuccess && (
				<div className="sm:w-[100%] grid gap-y-8">
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
