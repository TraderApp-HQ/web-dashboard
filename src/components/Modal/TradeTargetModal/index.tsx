import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";
import { useUpdateMasterTradeTpAndSl } from "~/hooks/useTrades";
import { SetStateAction, useEffect } from "react";

interface ITradeTargetModalProps {
	openModal: boolean;
	handleModalClose: () => void;
	trade: IMasterTrade;
	setSelectedTrade: (data: IMasterTrade) => void;
	setShowToast: (value: SetStateAction<boolean>) => void;
	setToastType: (value: SetStateAction<"success" | "error" | undefined>) => void;
	setToastMessage: (value: SetStateAction<string>) => void;
}

const TradeTargetModal: React.FC<ITradeTargetModalProps> = ({
	openModal,
	handleModalClose,
	trade,
	setSelectedTrade,
	setShowToast,
	setToastType,
	setToastMessage,
}) => {
	// Update trades TP & SL
	const { data, error, isError, isPending, isSuccess, updateMasterTradeTpAndSl } =
		useUpdateMasterTradeTpAndSl();

	const handleUpdateTradeTpAndSl = () =>
		updateMasterTradeTpAndSl({
			masterTradeId: trade.id,
			stopLossPrice: trade.stopLossPrice,
			takeProfitPrice: trade.takeProfitPrice,
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
					Set TP/SL
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

				<section className="bg-[#F8F9FC] rounded-md p-5 space-y-5 font-semibold">
					<p className="flex items-center justify-between">
						<span className="text-[#414141] text-sm">Entry Price</span>
						<span className="text-[#808080] text-base">{trade.entryPrice}</span>
					</p>
					<p className="flex items-center justify-between">
						<span className="text-[#414141] text-sm">Market Price</span>
						<span className="text-[#808080] text-base">{trade.currentPrice}</span>
					</p>
				</section>

				<section className="space-y-4">
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

				<section className="pt-6">
					<Button
						labelText={isPending ? "Updating ..." : "Confirm"}
						className="w-full !font-bold text-base"
						onClick={handleUpdateTradeTpAndSl}
						disabled={!trade.stopLossPrice || trade.stopLossPrice < 0 || isPending}
					/>
				</section>
			</div>
		</Modal>
	);
};

export default TradeTargetModal;
