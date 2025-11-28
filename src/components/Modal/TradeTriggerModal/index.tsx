import React, { SetStateAction, useEffect } from "react";
import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";
import { useTriggerMasterTradeOrder } from "~/hooks/useTrades";

interface ITradeTriggerModalProps {
	openModal: boolean;
	handleModalClose: () => void;
	trade: IMasterTrade;
	setSelectedTrade: (data: IMasterTrade) => void;
	setShowToast: (value: SetStateAction<boolean>) => void;
	setToastType: (value: SetStateAction<"success" | "error" | undefined>) => void;
	setToastMessage: (value: SetStateAction<string>) => void;
}

const TradeTriggerModal: React.FC<ITradeTriggerModalProps> = ({
	openModal,
	handleModalClose,
	trade,
	setSelectedTrade,
	setShowToast,
	setToastMessage,
	setToastType,
}) => {
	const { triggerMasterTradeOrder, data, error, isError, isPending, isSuccess } =
		useTriggerMasterTradeOrder();

	const handleTriggerMasterTrade = () =>
		triggerMasterTradeOrder({
			masterTradeId: trade.id,
		});

	// Handle update success and error
	useEffect(() => {
		if (isSuccess && data) {
			setShowToast(true);
			setToastType("success");
			setToastMessage(data);
			handleModalClose();
			return;
		}

		if (isError && error) {
			setShowToast(true);
			setToastType("error");
			setToastMessage(error.message);
		}
	}, [isSuccess, data, isError, error]);

	return (
		<Modal
			openModal={openModal}
			title={
				<p
					data-testid="trade-modal-form"
					className="font-bold text-lg md:text-2xl text-textColor flex items-center"
				>
					Trigger Order Placement
				</p>
			}
			headerDivider={true}
			onClose={isPending ? undefined : handleModalClose}
		>
			<div className="pt-5 px-2 space-y-5">
				{trade &&
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

				<section className="space-y-4">
					<InputField
						type="number"
						labelText="Entry Price"
						labelClassName="!text-black !font-semibold"
						props={{ name: "entry" }}
						placeholder="Entry price"
						value={String(trade.entryPrice) ?? ""}
						onChange={(value: string) => {
							setSelectedTrade({
								...trade,
								entryPrice: Number(value),
							});
						}}
						className="no-spin-buttons !font-semibold !text-base"
					/>

					<div>
						<InputField
							type="number"
							labelText="Take Profit Price"
							labelClassName="!text-black !font-semibold"
							props={{ name: "tp" }}
							placeholder="Take profit price"
							value={String(trade.takeProfitPrice) ?? ""}
							onChange={(value: string) => {
								setSelectedTrade({
									...trade,
									takeProfitPrice: Number(value),
								});
							}}
							className="no-spin-buttons !font-semibold !text-base"
						/>
						<p className="text-black font-medium text-sm mt-1">
							Est. PnL <span className="text-[#08875D] ml-2">120 USDT</span>{" "}
						</p>
					</div>

					<div>
						<InputField
							type="number"
							labelText="Stop Loss Price"
							labelClassName="!text-black !font-semibold"
							props={{ name: "sl" }}
							placeholder="Stop loss price"
							value={String(trade.stopLossPrice) ?? ""}
							onChange={(value: string) => {
								setSelectedTrade({
									...trade,
									stopLossPrice: Number(value),
								});
							}}
							className="no-spin-buttons !font-semibold !text-base"
						/>
						<p className="text-black font-medium text-sm mt-1">
							Est. PnL <span className="text-[#E02D3C] ml-2">-120 USDT</span>{" "}
						</p>
					</div>
				</section>

				<section className="bg-[#FFF6EB] rounded-md p-5 font-medium">
					<p className="text-[#595B60] text-sm">
						This will trigger orders placement for users at the specified entry price,
						take profit price and stop loss price.
					</p>
				</section>

				<section className="pt-6">
					<Button
						labelText={isPending ? "Placing trades ..." : "Trigger Trade"}
						className="w-full !font-bold text-base"
						onClick={handleTriggerMasterTrade}
						disabled={isPending}
					/>
				</section>
			</div>
		</Modal>
	);
};

export default TradeTriggerModal;
