import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import OverlayContainer from "~/components/AccountLayout/OverlayContainer";
import PageTab from "~/components/AccountLayout/Tabs";
import CancelIcon from "~/components/icons/CancelIcon";
import { renderDisplayItem, renderStatus } from "~/helpers";
import { useFetchTrade } from "~/hooks/useTrades";

interface IProps {
	children: ReactNode;
}

const TradeAnalysis: React.FC<IProps> = ({ children }) => {
	const router = useRouter();
	const tradeId = router.query.tradeId as string;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { trade, isLoading, isSuccess } = useFetchTrade({ tradeId });

	const basePath = router.pathname.startsWith("/account")
		? "/account/trade-center/open-trades/"
		: "/admin/trade-center/open-trades/";

	const tabs = [
		{ title: "Live Chart", href: `${basePath}${tradeId}/live_chart` },
		{ title: "Screenshot Chart", href: `${basePath}${tradeId}/screenshot_chat` },
	];

	return (
		<OverlayContainer subClass="bg-white space-y-8">
			<div className="flex items-center justify-between [&>*]:static">
				<h1 className="font-bold text-2xl text-textColor">Trade Analysis</h1>
				<CancelIcon onClick={() => router.push(`${basePath}`)} />
			</div>

			<div>
				{isSuccess &&
					trade &&
					renderDisplayItem({
						itemImage: trade.baseAssetLogoUrl,
						itemText: {
							text: `${trade.baseAsset} / ${trade.quoteCurrency}`,
							style: "font-bold",
						},
						styles: "!mx-0 md:!mx-0 !justify-start",
						isAssetItem: true,
						assetTradeSide: renderStatus(
							trade.side,
							{ justify: "justify-center" },
							false,
							[],
							"uppercase text-[10px] font-semibold",
						),
					})}
			</div>

			<div className="pb-4">
				<div className="mb-4 md:w-[70%] lg:w-[52%] 2xl:w-[40%]">
					<PageTab tabs={tabs} />
				</div>
				{children}
			</div>
		</OverlayContainer>
	);
};

export default TradeAnalysis;
