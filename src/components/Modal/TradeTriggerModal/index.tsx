import React, { useState } from "react";
import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";

interface ITradeTriggerModalProps {
	openModal: boolean;
	handleModalClose: () => void;
	selectedTrade: IMasterTrade;
}

const TradeTriggerModal: React.FC<ITradeTriggerModalProps> = ({
	openModal,
	handleModalClose,
	selectedTrade,
}) => {
	const [trade, setTrade] = useState<IMasterTrade>(selectedTrade);

	console.log("Trade", trade);

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
			onClose={handleModalClose}
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
							setTrade((prev) => ({
								...prev,
								entryPrice: Number(value),
							}));
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
								setTrade((prev) => ({
									...prev,
									takeProfitPrice: Number(value),
								}));
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
								setTrade((prev) => ({
									...prev,
									stopLossPrice: Number(value),
								}));
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
						labelText="Confirm"
						className="w-full !font-bold text-base"
						onClick={() => {}}
						disabled={
							!trade.takeProfitPrice || !trade.stopLossPrice || !trade.entryPrice
						}
					/>
				</section>
			</div>
		</Modal>
	);
};

export default TradeTriggerModal;
