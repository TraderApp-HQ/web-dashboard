import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import IconButton from "~/components/AccountLayout/IconButton";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";
import data from "../../data.json";
import PageTab from "~/components/AccountLayout/Tabs";
import { getAsset } from "~/lib/utils";
import type { Signal } from "~/lib/types";
import { renderStatus, renderTargetProfits } from "~/helpers";
import OverlayContainer from "~/components/AccountLayout/OverlayContainer";
import { LAYOUT_ROUTES, ROUTES } from '~/config/constants';

interface IProps {
	children: ReactNode
}

const AssetBreakdown: React.FC<IProps> = ({ children }) => {
	const router = useRouter();
	const id = router.query.id as string;
	const [asset, setAsset] = useState<Signal | null>(null)

	useEffect(() => {
		async function fetchData() {
			const asset: Signal | null = await getAsset("1", data);
			setAsset(asset)
		}
		fetchData()
		
	}, [id])
	const tabs = [
		// { title: "Live Chart", href: `/${LAYOUT_ROUTES.account}/${ROUTES.signals}/active/${id}/live_chart` },
		// { title: "Screenshot Chart", href: `/${LAYOUT_ROUTES.account}/${ROUTES.signals}/active/${id}/screenshot_chat` },
		{ title: "Live Chart", href: `/account/signals/active/${id}/live_chart` },
    	{ title: "Screenshot Chart", href: `/account/signals/active/${id}/screenshot_chat` }
	];

	return (
		<OverlayContainer subClass="bg-white">
			<div className="grid grid-flow-col justify-center ">
				<div className="">
					<IconButton
						onClick={() => router.push(`/${LAYOUT_ROUTES.account}/${ROUTES.signals}/active`)}
						Icon={LeftArrowIcon}
						aria-label="back button"
					>
						<span className="ml-4 text-lg font-semibold">Back</span>
					</IconButton>

					<div className="flex gap-2 items-center my-6">
						<img src={asset?.logoUrl} alt={asset?.asset} width={"40px"} height={"40px"} />
						<h2>
							Bitcoin<span>(BTC)</span>
						</h2>
					</div>

					<div className="sm:w-[40%] w-full my-6">
						<PageTab tabs={tabs} />
					</div>

					{/* TODO: Refactor this pieces of data to use the DataTable component */}
					<div className="sm:px-0 px-2 mb-24">
						{children}
						{/* Status */}
						<div className="lg:w-[35%] mt-10">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-4 py-3 bg-blue-200 bg-opacity-10">
								<div className="flex justify-between sm:flex-col flex-row gap-8">
									<h2 className="text-zinc-800 text-sm font-bold leading-none">
										Status
									</h2>
									<div className="flex justify-start h-6 p-2">
										{renderStatus(asset?.status ?? "")}
									</div>
									{/* <div className="h-6 p-2 bg-emerald-50 rounded-lg items-center gap-2 flex ml-0 sm:-ml-4">
                      <div className="w-2.5 h-2 bg-emerald-700 rounded-full" />
                      <p className="text-emerald-700 text-sm font-bold leading-none">{asset.status}</p>
                    </div> */}
								</div>
								<div className="flex justify-between sm:flex-col flex-row gap-8">
									<h2 className="text-zinc-800 text-sm font-bold leading-none">
										Change
									</h2>
									<p className="text-rose-600 text-sm font-semibold leading-none">
										{asset?.change}%
									</p>
								</div>
								<div className="flex justify-between sm:flex-col flex-row gap-8">
									<h2 className="text-zinc-800 text-sm font-bold leading-none">
										Current Ticker
									</h2>
									<p className="text-neutral-500 text-sm font-semibold leading-none">
										{asset?.currentTicker}
									</p>
								</div>
							</div>
						</div>
						{/* Target profits */}
						<div className="lg:w-[80%] grid gap-y-8 mt-10">
							<div className="bg-blue-200 bg-opacity-10">
								<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center px-4 py-3">
									<div className="flex justify-between items-center sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Target profit
										</h2>
										<div className="">
											{renderTargetProfits({
												targetProfits: asset?.targetProfits ?? [],
											})}
										</div>
									</div>
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Stop lost price
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{asset?.stopLostPrice}
										</p>
									</div>
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Timeframe/Candles
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{asset?.timeframe}
										</p>
									</div>
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Date/Time
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{asset?.time}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-blue-200 bg-opacity-10">
								<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center px-4 py-3">
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Max Gain Since Cal
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{asset?.maxGainSinceCall}
										</p>
									</div>
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Asset Market Cap
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{" "}
											{asset?.marketCap}
										</p>
									</div>
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Risk
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{asset?.risk}
										</p>
									</div>
									<div className="flex justify-between sm:flex-col flex-row gap-8">
										<h2 className="text-zinc-800 text-sm font-bold leading-none">
											Entry price
										</h2>
										<p className="text-neutral-500 text-sm font-semibold leading-none">
											{asset?.entryPrice}
										</p>
									</div>
								</div>
							</div>

							<div className="grid gap-2.5">
								<h2 className="text-black text-base font-bold leading-none">
									Trade Note
								</h2>
								<p className="lg:w-800 lg:max-w-[80%] w-full text-neutral-700 text-sm font-normal leading-normal">
									Lorem ipsum dolor, sit amet consectetur adipisicing elit.
									Voluptas, unde .Lorem ipsum dolor, sit amet consectetur
									adipisicing elit. Voluptas, unde .Lorem ipsum dolor, sit amet
									consectetur adipisicing elit. Voluptas, unde .Lorem ipsum dolor,
									sit amet consectetur adipisicing elit. Voluptas, unde .Lorem
									ipsum dolor, sit amet consectetur
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</OverlayContainer>
	);
}

export default AssetBreakdown;
