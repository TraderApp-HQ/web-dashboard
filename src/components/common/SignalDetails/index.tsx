import React, { ReactNode, useCallback } from "react";
import { capitalizeFirstLetter, renderStatus, renderTargetProfits } from "~/helpers";
import IconButton from "~/components/AccountLayout/IconButton";
import PageTab from "~/components/AccountLayout/Tabs";
import LeftArrowIcon from "~/components/icons/LeftArrowIcon";
import { AssetsService } from "~/apis/handlers/assets";
import { useFetch } from "~/hooks/useFetch";
import { AssetsQueryId } from "~/apis/handlers/assets/constants";
import OverlayContainer from "~/components/AccountLayout/OverlayContainer";
import { useRouter } from "next/router";
import Image from "next/image";
import SignalBreakDownLoader from "~/components/Loaders/SignalBreakDownLoader";

interface IProps {
	children: ReactNode;
}

const SignalDetail: React.FC<IProps> = ({ children }) => {
	const router = useRouter();
	const signalsService = new AssetsService();

	const id = router.query.id as string;
	const basePath = router.pathname.startsWith("/account")
		? "/account/signals/active/"
		: router.pathname.includes("/active")
			? "/admin/signal-management/active/"
			: "/admin/signal-management/pending/";

	const fetchSignal = useCallback(() => signalsService?.getSignal(id), [id, signalsService]);

	const {
		data: signal,
		isLoading,
		isSuccess,
	} = useFetch({
		queryKey: [AssetsQueryId.signal],
		queryFn: fetchSignal,
	});

	const tabs = [
		{ title: "Live Chart", href: `${basePath}${id}/live_chart` },
		{ title: "Screenshot Chart", href: `${basePath}${id}/screenshot_chat` },
	];

	return (
		<OverlayContainer subClass="bg-white">
			<div className="grid grid-flow-col sm:w-[100%]">
				<div>
					<IconButton
						onClick={() => router.push(`${basePath}`)}
						Icon={LeftArrowIcon}
						aria-label="back button"
					>
						<span className="ml-4 text-lg font-semibold">Back</span>
					</IconButton>

					{isLoading && <SignalBreakDownLoader />}
					{isSuccess && signal && (
						<div className="flex gap-2 items-center my-6">
							<Image
								src={signal?.baseAsset?.logo}
								alt={signal?.baseAsset?.name}
								width={40}
								height={40}
							/>
							<h2>
								{capitalizeFirstLetter(`${signal?.baseAsset?.name}`)}
								<span>({signal?.baseAsset?.symbol.toUpperCase()})</span>
							</h2>
						</div>
					)}

					{signal && (
						<>
							<div className="sm:w-[40%] w-full my-6">
								<PageTab tabs={tabs} />
							</div>

							{/* TODO: Refactor this pieces of data to use the DataTable component */}
							<div className="sm:px-0 px-2 mb-24">
								<div>{children}</div>
								{/* Status */}
								<div className="lg:w-[35%] mt-10">
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center px-4 py-3 bg-blue-200 bg-opacity-10">
										<div className="flex justify-between sm:flex-col flex-row gap-8">
											<h2 className="text-zinc-800 text-sm font-bold leading-none">
												Status
											</h2>
											<div className="flex justify-start h-6">
												{renderStatus(`${signal?.status}`)}
											</div>
										</div>
										<div className="flex justify-between sm:flex-col flex-row gap-8">
											<h2 className="text-zinc-800 text-sm font-bold leading-none">
												Change
											</h2>
											<p className="text-rose-600 text-sm font-semibold leading-none">
												{signal?.currentChange ?? 0}%
											</p>
										</div>
										<div className="flex justify-between sm:flex-col flex-row gap-8">
											<h2 className="text-zinc-800 text-sm font-bold leading-none">
												Current Ticker
											</h2>
											<p className="text-neutral-500 text-sm font-semibold leading-none">
												{signal?.currentChange ?? 0}
											</p>
										</div>
									</div>
								</div>

								{/* Target Profits */}
								<div className="lg:w-[80%] grid gap-y-8 mt-10">
									<div className="bg-blue-200 bg-opacity-10">
										<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center px-4 py-3">
											<div className="flex justify-between items-center sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Target profit
												</h2>
												<div className="">
													{renderTargetProfits({
														targetProfits: signal?.targetProfits,
													})}
												</div>
											</div>
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Stop loss price
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{signal?.stopLoss.price}
												</p>
											</div>
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Timeframe/Candles
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{signal?.candlestick}
												</p>
											</div>
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Date/Time
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{new Date(signal.createdAt).toDateString()}
												</p>
											</div>
										</div>
									</div>

									{/* Other Signal Details */}
									<div className="bg-blue-200 bg-opacity-10">
										<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center px-4 py-3">
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Max Gain Since Cal
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{signal?.maxGain}
												</p>
											</div>
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Asset Market Cap
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{signal?.baseAsset.marketCap ?? 0}
												</p>
											</div>
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Risk
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{signal?.risk}
												</p>
											</div>
											<div className="flex justify-between sm:flex-col flex-row gap-8">
												<h2 className="text-zinc-800 text-sm font-bold leading-none">
													Entry price
												</h2>
												<p className="text-neutral-500 text-sm font-semibold leading-none">
													{signal?.entryPrice}
												</p>
											</div>
										</div>
									</div>

									{/* Trade Note */}
									<div className="grid gap-2.5">
										<h2 className="text-black text-base font-bold leading-none">
											Trade Note
										</h2>
										<p className="lg:w-800 lg:max-w-[80%] w-full text-neutral-700 text-sm font-normal leading-normal">
											{signal?.tradeNote}
										</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</OverlayContainer>
	);
};

export default SignalDetail;
