/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import AssetBreakdown from "~/pages/account/signals/active/[id]";
import TradingViewWidget from "~/components/TradingViewWidget";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import { ISignal } from "~/apis/handlers/assets/interfaces";
import { useRouter } from "next/router";

const LiveChart = () => {
	const { isLoading, isSuccess, activeSignals } = useFetchActiveSignals({});
	const [selectedSignal, setSelectedSignal] = useState<ISignal>();
	const router = useRouter();

	const id = router.query.id as string;

	useEffect(() => {
		if (!isLoading && isSuccess) {
			const signalAsset = activeSignals.find((asset) => asset.id === id);
			setSelectedSignal(signalAsset);
		}
	}, [isLoading, isSuccess, activeSignals]);

	return (
		<>
			{!isLoading && isSuccess && selectedSignal && (
				<div className="sm:w-[100%] grid gap-y-8">
					<div className="flex justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
						<TradingViewWidget
							signalSymbol={`${selectedSignal.baseAsset.symbol}${selectedSignal.quoteCurrency.symbol}`}
						/>
					</div>
				</div>
			)}
		</>
	);
};

LiveChart.getLayout = (page: React.ReactElement) => <AssetBreakdown>{page}</AssetBreakdown>;
export default LiveChart;
