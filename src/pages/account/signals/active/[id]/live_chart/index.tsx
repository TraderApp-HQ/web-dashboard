/* eslint-disable @next/next/no-img-element */
// import { getAsset } from "~/lib/utils";
// import data from "~/pages/account/signals/data.json";
// import type { Signal } from "~/lib/types";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import AssetBreakdown from "~/pages/account/signals/active/[id]";
import TradingViewWidget from "~/components/TradingViewWidget";

const LiveChart = () => {
	// const router = useRouter();
	// const id = router.query.id as string;
	// const [asset, setAsset] = useState<Signal | null>(null);

	// useEffect(() => {
	// 	async function fetchData() {
	// 		const asset: Signal | null = await getAsset("1", data);
	// 		setAsset(asset);
	// 	}
	// 	fetchData();
	// }, [id]);

	return (
		<>
			<div className="sm:w-[100%] grid gap-y-8">
				<div className="flex justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
					<TradingViewWidget />
				</div>
			</div>
		</>
	);
};

LiveChart.getLayout = (page: React.ReactElement) => <AssetBreakdown>{page}</AssetBreakdown>;
export default LiveChart;
