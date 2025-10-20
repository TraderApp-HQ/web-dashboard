import TradingViewWidget from "~/components/TradingViewWidget";
import { useRouter } from "next/router";
import { useFetchTrade } from "~/hooks/useTrades";
import TradeAnalysisLayout from "..";

const LiveChart = () => {
	const router = useRouter();
	const tradeId = router.query.tradeId as string;
	const { trade, isLoading, isSuccess } = useFetchTrade({ tradeId });

	return (
		<>
			{!isLoading && isSuccess && trade && (
				<div className="sm:w-[100%] grid gap-y-8">
					<div className="flex justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
						<TradingViewWidget
							signalSymbol={`${trade.baseAsset}${trade.quoteCurrency}`}
						/>
					</div>
				</div>
			)}
		</>
	);
};

LiveChart.getLayout = (page: React.ReactElement) => (
	<TradeAnalysisLayout>{page}</TradeAnalysisLayout>
);

export default LiveChart;
