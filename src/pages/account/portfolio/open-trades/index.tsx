import OpenTradeStats from "~/components/Portfolio/OpenTradeStats";
import Card from "~/components/AccountLayout/Card";
import type { OpenTrade, PortfolioStats } from "~/lib/types";
import data from "~/data/wallet/data.json";
import EmptyTransaction from "~/components/Wallet/EmptyTransaction";
import Modal from "~/components/Modal";
import { useState } from "react";
import InfoIcon from "~/components/icons/InfoIcon";
// import PortfolioTabSection from "~/components/Portfolio/PortfolioTabSection";
import PortfolioOverview from "~/components/Portfolio/PortfolioOverview";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";

import {
	openTradesDataTableSelector,
	openTradesDataTableMobileSelector,
} from "~/selectors/portfolio";
import { NestedPortfolioLayout } from "..";
import Image from "next/image";

interface ConfirmParam {
	openModal?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

interface RecentTradesProps {
	items: OpenTrade[];
	onOpenCloseTrade: () => void;
}

const OpenTrades = () => {
	const res = data;
	const [openConfirm, setOpenConfirm] = useState(false);
	function onOpenCloseTrade() {
		setOpenConfirm(true);
	}
	function onConfirm() {
		setOpenConfirm(false);
	}
	function onCancel() {
		setOpenConfirm(false);
	}
	// const openTrades = [
	// 	{
	// 		asset: {
	// 			image: "/images/btc_round.png",
	// 			shortName: "BTC",
	// 			name: "Bitcoin",
	// 			id: "1"
	// 		},
	// 		pair: "USDT",
	// 		price: "230.9092",
	// 		profitLoss: "2.902",
	// 		percent: "+2.31",
	// 		holdings: "2.902",
	// 		holdingComp: "10.00 Comp",
	// 		date: "2 July 2021 17:23",
	// 		avgBuy: "2348",
	// 		entryPrice: "23760.000",
	// 		positionAmount: "203.00 USDT",
	// 		estimatedAmount: "0.000 USDT",
	// 		id: "1"
	// 	},
	// 	{
	// 		asset: {
	// 			image: "/images/usdt_round.png",
	// 			shortName: "USDT",
	// 			name: "Tether",
	// 			id: "2"
	// 		},
	// 		pair: "BTC",
	// 		price: "230.9092",
	// 		profitLoss: "2.902",
	// 		percent: "-2.31",
	// 		holdings: "2.902",
	// 		holdingComp: "10.00 Comp",
	// 		date: "2 July 2021 17:23",
	// 		avgBuy: "2348",
	// 		entryPrice: "23760.000",
	// 		positionAmount: "203.00 USDT",
	// 		estimatedAmount: "0.000 USDT",
	// 		id: "2"
	// 	}
	// ]
	return (
		<div>
			<OpenTradeStats />
			<SectionTwo data={res.signals} />
			<PortfolioOverview />
			<div>
				<RecentTrades items={res.openTrades} onOpenCloseTrade={onOpenCloseTrade} />
				<ConfirmCloseTrade
					openModal={openConfirm}
					onConfirm={onConfirm}
					onCancel={onCancel}
				/>
			</div>
		</div>
	);
};

function SectionTwo({ data }: { data: PortfolioStats }) {
	return (
		data && (
			<Card className="mt-7 lg:w-3/4">
				<div className="grid grid-cols-2 grid-rows-2 lg:flex lg:justify-between">
					<div className="flex-col justify-center items-start gap-0.5 py-3">
						<h3 className="text-neutral-700 text-sm font-normal leading-tight">
							Total number of trade
						</h3>
						<div className="justify-center items-center gap-9 inline-flex">
							<p className="text-neutral-700 text-base font-bold">
								{data.totalActiveSignal}
							</p>
						</div>
					</div>

					<div className="flex-col justify-center items-start gap-0.5 py-3">
						<h3 className="text-neutral-700 text-sm font-normal leading-tight">
							Total Capital
						</h3>
						<div className="justify-center items-center gap-9 inline-flex">
							<p className="text-neutral-700 text-base font-bold">
								{data.totalCapital}.00 USD
							</p>
						</div>
					</div>

					<div className="py-3">
						<div className="w-80 h-px border border-stone-300 border-opacity-20 mb-4 sm:hidden block" />
						<div className="w-12 h-px origin-top-left rotate-90 border border-stone-300 border-opacity-20 sm:block hidden" />
						<div className="flex-col justify-center items-start gap-2 ml-0 sm:ml-3">
							<h3 className="text-neutral-700 text-sm font-semibold leading-tight">
								Best performer
							</h3>
							<div className="justify-start items-center gap-12 inline-flex">
								<div className="justify-start items-center gap-2 flex">
									<Image
										src={data.bestSignal?.image}
										alt={data.bestSignal?.name}
										className="w-6 h-6 relative"
										width={24}
										height={24}
									/>
									<p className="text-slate-900 text-xs font-semibold leading-none">
										{data.bestSignal?.name}
									</p>
								</div>
								<div className="justify-start items-center flex">
									<div className="w-4 h-4 relative origin-top-left -rotate-180" />
									<p className="text-emerald-700 text-sm font-normal">
										{data.bestSignal.percentage}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="py-3">
						<div className="w-80 h-px border border-stone-300 border-opacity-20 mb-4 sm:hidden block" />
						<div className="w-12 h-px origin-top-left rotate-90 border border-stone-300 border-opacity-20 sm:block hidden" />
						<div className="flex-col justify-center items-start gap-2 ml-0 sm:ml-3">
							<h3 className="text-neutral-700 text-sm font-semibold leading-tight">
								Worst performer
							</h3>
							<div className="justify-start items-center gap-12 inline-flex">
								<div className="justify-start items-center gap-2 flex">
									<Image
										src={data.worseSignal?.image}
										alt={data.worseSignal?.name}
										className="w-6 h-6 relative"
										width={24}
										height={24}
									/>
									<p className="text-slate-900 text-xs font-semibold leading-none">
										{data.worseSignal?.name}
									</p>
								</div>
								<div className="justify-start items-center flex">
									<div className="w-4 h-4 relative origin-top-left -rotate-180" />
									<p className="text-red-700 text-sm font-normal">
										{data.worseSignal.percentage}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		)
	);
}

function RecentTrades({ items, onOpenCloseTrade }: RecentTradesProps) {
	const { tableHead, tableBody } = openTradesDataTableSelector(items);
	const dataMobile = openTradesDataTableMobileSelector(items);

	return (
		<div>
			{items.length === 0 ? (
				<EmptyTransaction />
			) : (
				<div className="mt-2 mb-8">
					<div className="flex justify-between pb-4">
						<h2 className="text-slate-900 font-bold text-base">Open Trade</h2>
						<h2
							className="text-blue-800 text-sm font-bold cursor-pointer"
							onClick={onOpenCloseTrade}
						>
							Close Trade
						</h2>
					</div>
					<div className="hidden md:block p-2 bg-white rounded-2xl relative overflow-x-auto">
						<DataTable tHead={tableHead} tBody={tableBody} />
					</div>
					<div className="md:hidden relative">
						<DataTableMobile data={dataMobile} />
					</div>
				</div>
			)}
		</div>
	);
}

//This function opens the confirm dialog box to close all trades
function ConfirmCloseTrade({ openModal, onCancel, onConfirm }: ConfirmParam) {
	const [openConfirm, setOpenConfirm] = useState(false);
	const handleContinue = () => {
		handleCancel();
		setOpenConfirm(true);
	};
	const handleStageTwoContinue = () => {
		if (onConfirm) {
			onConfirm();
		}
		setOpenConfirm(false);
	};
	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
	};

	return (
		<>
			<Modal openModal={openModal} width="md:w-[539px]" onClose={onCancel}>
				<div className="wallet-modal-btn-div flex-col px-8 justify-center text-center space-y-4">
					<InfoIcon />
					<h2 className="text-[#102477] font-bold text-[24px] uppercase">Close trade</h2>
					<h3 className="text-[#666666] text-sm">
						Closing all trades cancels all open trade.
					</h3>
					<h3 className="text-[#666666] text-sm">
						Are you sure you want to close all positions/trade. this action cannot be
						undo.
					</h3>

					<button type="button" onClick={handleContinue}>
						Confirm
					</button>
					<button type="button" className="cancel" onClick={onCancel}>
						Cancel
					</button>
				</div>
			</Modal>
			<ConfirmCloseTradeValidate
				onConfirm={handleStageTwoContinue}
				onCancel={onCancel}
				openModal={openConfirm}
			/>
		</>
	);
}

function ConfirmCloseTradeValidate({ openModal, onConfirm, onCancel }: ConfirmParam) {
	const handleContinue = () => {
		if (onConfirm) {
			onConfirm();
		}
	};
	return (
		<Modal openModal={openModal} width="md:w-[539px]" onClose={onCancel}>
			<div className="wallet-modal-btn-div flex-col px-8 justify-center text-center space-y-4">
				<InfoIcon />
				<h2 className="text-[#102477] font-bold text-[24px] uppercase">Close trades</h2>
				<h3 className="text-[#666666] text-sm">
					Closing all trades cancels all open trade.
				</h3>
				<h3 className="text-[#666666] text-sm">
					Are you sure you want to close all positions/trade. this action cannot be undo.
				</h3>
				<h3 className="text-[#666666] text-sm">
					Type <span className="text-[#1836B2]">“close all Trades”</span> in the text
					filed below to confirm
				</h3>
				<input
					type="text"
					placeholder="Please enter the text above"
					className="bg-gray-50 outline-[#DEE3F6] outline-1 border-[#DEE3F6] focus:outline-[#DEE3F6] rounded-2xl text-[#808080] p-3 font-normal text-base text-center w-full"
				/>
				<button type="button" onClick={handleContinue}>
					Confirm
				</button>
			</div>
		</Modal>
	);
}

OpenTrades.getLayout = (page: React.ReactElement) => (
	<NestedPortfolioLayout>{page}</NestedPortfolioLayout>
);
export default OpenTrades;
