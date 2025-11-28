import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OpenTradesActionType } from "~/apis/handlers/trading-engine/enums";
import {
	IMasterTrade,
	ITradeAggregate,
	IUserTrade,
} from "~/apis/handlers/trading-engine/interfaces";
import Card from "~/components/AccountLayout/Card";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import SelectBox from "~/components/common/SelectBox";
import ComponentError from "~/components/Error/ComponentError";
import EyesIcon from "~/components/icons/EyesIcon";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import WalletBalanceCardLoader from "~/components/Loaders/WalletBalanceCardLoader";
import CloseTradeModal from "~/components/Modal/CloseTradeModal";
import HiddenBalances from "~/components/Wallet/HidenBalance";
import { useFetchOpenTrades } from "~/hooks/useTrades";
import { formatCurrency } from "~/lib/utils";
import { AdminNestedTradeCenterLayout } from "..";
import TradeTargetModal from "~/components/Modal/TradeTargetModal";
import TradeBreakEvenModal from "~/components/Modal/TradeBreakEvenModal";
import CancelTradeModal from "~/components/Modal/CancelTradeModal";
import TradeTriggerModal from "~/components/Modal/TradeTriggerModal";
import Toast from "~/components/common/Toast";

function OpenTrades() {
	const router = useRouter();
	const { action, id, trade } = router.query;
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [selectedTrade, setSelectedTrade] = useState<IMasterTrade | IUserTrade | null>(null);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [toastType, setToastType] = useState<"success" | "error">();

	// Fetch active trades
	const {
		error,
		isError,
		isLoading,
		isSuccess,
		tradesTableBody,
		tradesTableHead,
		mobileTableData,
		trades,
		tradesAggregate,
	} = useFetchOpenTrades({ isAdmin: true });
	const openTradesCount = trades && trades.length > 0 && trades.length;

	const handleModalClose = () => {
		const url = window.location.pathname; // Get the current pathname
		window.history.replaceState(null, "", url); // Clears query params
		setOpenModal(false);
		setSelectedTrade(null);
	};

	useEffect(() => {
		if (!action || !id) return;

		const foundTrade = trades?.find((trade) => trade.id === id) ?? null;
		setSelectedTrade(foundTrade);

		setOpenModal(true);
	}, [action, id, trades]);

	useEffect(() => {
		if (trade && trade === "true") {
			setShowToast(true);
			setToastType("success");
			setToastMessage("Trade created successfully.");
		}

		if (trade === "true") {
			const url = window.location.pathname; // Get the current pathname
			window.history.replaceState(null, "", url); // Clears query params
		}
	}, [trade]);

	const handleToastClose = () => {
		setShowToast(false);
		setToastType(undefined);
		setToastMessage("");
	};

	return (
		<section>
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
				<div>
					{tradesAggregate && (
						<TradingAccountSummaryCard
							isLoading={isLoading}
							isSuccess={isSuccess}
							isError={isError}
							totalBalanceStyle="text-4xl"
							cardStyle="p-4 md:px-5 md:py-8 !rounded-2xl mb-10"
							tradesAggregate={tradesAggregate}
						/>
					)}
					<div className="pt-2 pb-8">
						<p className="font-bold text-base text-textColor mb-2">
							Open Trades ({openTradesCount})
						</p>
						<div className="rounded-2xl bg-[#F3F4F6]">
							<div className="hidden xl:block overflow-x-auto">
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
							<div className="xl:hidden relative">
								{isSuccess && <DataTableMobile data={mobileTableData} />}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* /////////////////////////// Modals ///////////////////////////// */}
			{openModal && action === OpenTradesActionType.CLOSE_TRADE && selectedTrade && (
				<CloseTradeModal
					openModal
					handleModalClose={handleModalClose}
					selectedTrade={selectedTrade as IMasterTrade}
					setShowToast={setShowToast}
					setToastType={setToastType}
					setToastMessage={setToastMessage}
				/>
			)}

			{openModal && action === OpenTradesActionType.SET_TP_N_SL && selectedTrade && (
				<TradeTargetModal
					openModal
					handleModalClose={handleModalClose}
					trade={selectedTrade as IMasterTrade}
					setSelectedTrade={setSelectedTrade}
					setShowToast={setShowToast}
					setToastType={setToastType}
					setToastMessage={setToastMessage}
				/>
			)}

			{openModal && action === OpenTradesActionType.BREAK_EVEN && selectedTrade && (
				<TradeBreakEvenModal
					openModal
					handleModalClose={handleModalClose}
					selectedTrade={selectedTrade as IMasterTrade}
					setShowToast={setShowToast}
					setToastType={setToastType}
					setToastMessage={setToastMessage}
				/>
			)}

			{openModal && action === OpenTradesActionType.CANCEL_TRADE && selectedTrade && (
				<CancelTradeModal
					openModal
					handleModalClose={handleModalClose}
					selectedTrade={selectedTrade as IMasterTrade}
					setShowToast={setShowToast}
					setToastType={setToastType}
					setToastMessage={setToastMessage}
				/>
			)}

			{openModal &&
				action === OpenTradesActionType.TRIGGER_ORDER_PLACEMENT &&
				selectedTrade && (
					<TradeTriggerModal
						openModal
						handleModalClose={handleModalClose}
						trade={selectedTrade as IMasterTrade}
						setSelectedTrade={setSelectedTrade}
						setShowToast={setShowToast}
						setToastType={setToastType}
						setToastMessage={setToastMessage}
					/>
				)}

			{showToast && (
				<Toast
					type={toastType}
					variant="filled"
					title={toastType === "success" ? "Success" : "Error"}
					message={toastMessage}
					autoVanish
					autoVanishTimeout={10}
					onToastClose={handleToastClose}
					showToast={showToast}
				/>
			)}
		</section>
	);
}

interface ITradingAccountSummaryCardProps {
	totalBalanceStyle?: string;
	cardStyle?: string;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	tradesAggregate: ITradeAggregate;
}

export const TradingAccountSummaryCard: React.FC<ITradingAccountSummaryCardProps> = ({
	isLoading,
	isError,
	isSuccess,
	totalBalanceStyle,
	cardStyle,
	tradesAggregate,
}) => {
	const [showBalance, setShowBalance] = useState<boolean>(true);

	const pnlValue = tradesAggregate.accummulatedUnrealisedPnL;
	const pnlPercentage = tradesAggregate.accummulatedUnrealisedPnLPercentage;

	return (
		<>
			{isLoading ? (
				/////////////////// Loading State ///////////////
				<WalletBalanceCardLoader />
			) : !isLoading && isError ? (
				/////////////////// Error State ///////////////////
				<ComponentError errorMessage="Error fetching trading account balance. Please try again." />
			) : (
				isSuccess && (
					<Card
						className={`flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between ${cardStyle ? cardStyle : "p-5"}`}
					>
						<section className="space-y-5">
							<section className="flex items-center space-x-2">
								<h4 className="text-sm text-black font-bold text-nowrap">
									Total Balance
								</h4>

								<span
									onClick={() => setShowBalance(!showBalance)}
									className="cursor-pointer"
								>
									{showBalance ? <EyesIcon /> : <OpenEyesIcon />}
								</span>
							</section>

							<section className="min-h-8 flex items-center justify-start">
								{showBalance ? (
									<section className="space-y-3">
										<section className="flex items-center gap-2 text">
											<h2
												className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl"} ${tradesAggregate.accummulatedTotalBalance >= 0 ? "text-[#08875D]" : "text-[#E02D3C]"}`}
											>
												{formatCurrency(
													tradesAggregate.accummulatedTotalBalance,
												)}
											</h2>

											<SelectBox
												isSearchable={false}
												options={[
													{
														displayText: "USDT",
														value: tradesAggregate.accummulatedTotalBalance.toString(),
													},
												]}
												option={{
													displayText: "USDT",
													value: tradesAggregate.accummulatedTotalBalance.toString(),
												}}
												// setOption={(opt) =>
												// 	setTradingAccountBalance(parseFloat(opt.value))
												// }
												bgColor="transparent"
												buttonClassName="!p-0 !space-x-1"
												fontStyles="text-base font-semibold text-textGray"
												optionsClass="!p-1"
											/>
										</section>

										<section className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4 text-textColor">
											<section className="flex items-baseline gap-2">
												<h4 className="font-bold text-sm">Total Risk</h4>
												<span className="font-medium text-xs">
													{tradesAggregate.accummulatedTotalRisk}{" "}
													<span className="font-normal text-[10px]">
														USDT
													</span>
												</span>
											</section>
											<section className="flex items-baseline gap-2">
												<h4 className="font-bold text-sm">
													Unrealized P&L
												</h4>
												<span
													className={`font-medium text-xs flex items-baseline ${pnlPercentage >= 0 ? "text-[#08875D]" : "text-[#E02D3C]"}`}
												>
													{pnlPercentage > 0
														? `+${pnlPercentage}`
														: pnlPercentage}
													%<span>({pnlValue} USDT)</span>
												</span>
											</section>
										</section>
									</section>
								) : (
									<HiddenBalances />
								)}
							</section>
						</section>
					</Card>
				)
			)}
		</>
	);
};

OpenTrades.getLayout = (page: React.ReactElement) => (
	<AdminNestedTradeCenterLayout>{page}</AdminNestedTradeCenterLayout>
);
export default OpenTrades;
