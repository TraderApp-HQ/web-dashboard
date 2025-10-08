import Modal from "~/components/Modal";
import { useState } from "react";
import InfoIcon from "~/components/icons/InfoIcon";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { NestedTradeCenterLayout } from "..";
import { TradingAccountSummaryCard } from "~/pages/admin/trade-center/open-trades";
import { useFetchOpenTrades } from "~/hooks/useTrades";
import TableLoader from "~/components/Loaders/TableLoader";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import ComponentError from "~/components/Error/ComponentError";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";

interface ConfirmParam {
	openModal?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

const OpenTrades = () => {
	const {
		error,
		isError,
		isLoading,
		isSuccess,
		tradesTableBody,
		tradesTableHead,
		mobileTableData,
		trades,
	} = useFetchOpenTrades({ isAdmin: false });
	const openTradesCount = trades && trades.length > 0 && trades.length;
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

	return (
		<div className="space-y-5">
			<TradingAccountSummaryCard
				isLoading={isLoading}
				isSuccess={isSuccess}
				isError={isError}
				totalBalanceStyle="text-4xl text-textGray"
				cardStyle="p-4 md:px-5 md:py-8 !rounded-2xl mb-10"
			/>
			{isLoading ? (
				<>
					<div className="hidden md:block">
						<TableLoader />
					</div>
					<div className="md:hidden">
						<MobileTableLoader />
					</div>
				</>
			) : !isLoading && isError ? (
				<section className="pb-3 rounded-2xl">
					<ComponentError errorMessage={error?.message} />
				</section>
			) : !isLoading && trades && trades.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<div className="pt-2 pb-8">
					<div className="flex justify-between items-center pb-4">
						<h2 className="text-slate-900 font-bold text-base">
							Open Trades ({openTradesCount})
						</h2>
						<h2
							className="text-blue-800 text-sm font-bold cursor-pointer"
							onClick={onOpenCloseTrade}
						>
							Close Trade
						</h2>
					</div>
					<div className="rounded-2xl bg-[#F3F4F6]">
						<div className="hidden md:block overflow-x-auto">
							{isSuccess && tradesTableBody && (
								<DataTable
									tHead={tradesTableHead}
									tBody={tradesTableBody}
									tableStyles="bg-white px-10"
									tableHeadStyles="bg-[#F3F4F6]"
									tableHeadItemStyles="text-center"
								/>
							)}
						</div>
						<div className="md:hidden relative">
							{isSuccess && <DataTableMobile data={mobileTableData} />}
						</div>
					</div>
				</div>
			)}

			<ConfirmCloseTrade openModal={openConfirm} onConfirm={onConfirm} onCancel={onCancel} />
		</div>
	);
};

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
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default OpenTrades;
