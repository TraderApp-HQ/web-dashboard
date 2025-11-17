import Image from "next/image";
import { useRouter } from "next/router";
import { useFetchTrade } from "~/hooks/useTrades";
import TradeAnalysisLayout from "..";

const ScreenshotChart = () => {
	const router = useRouter();
	const tradeId = router.query.tradeId as string;
	const { trade, isLoading, isSuccess } = useFetchTrade({ tradeId });

	return (
		<section className="space-y-5">
			<div className="flex h-[600px] max-h-[650px] justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
				{isLoading && <div>loading...</div>}
				{isSuccess && trade && (
					<Image
						src={trade.chartUrl || ""}
						style={{
							width: "100%",
							height: "580px",
						}}
						width={100}
						height={100}
						sizes="100vw"
						alt="Trade chart"
					/>
				)}
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-base text-black">Trade Note</h2>
				<p className="font-normal text-textGray">{trade?.tradeNote}</p>
			</div>
		</section>
	);
};

ScreenshotChart.getLayout = (page: React.ReactElement) => (
	<TradeAnalysisLayout>{page}</TradeAnalysisLayout>
);

export default ScreenshotChart;
