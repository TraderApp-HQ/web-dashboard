import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";
import React, { SetStateAction, useEffect } from "react";
import { useBreakEvenActiveMasterTrade } from "~/hooks/useTrades";

interface ITradeBrealEvenModalProps {
	openModal: boolean;
	handleModalClose: () => void;
	selectedTrade: IMasterTrade;
	setShowToast: (value: SetStateAction<boolean>) => void;
	setToastType: (value: SetStateAction<"success" | "error" | undefined>) => void;
	setToastMessage: (value: SetStateAction<string>) => void;
}

const TradeBreakEvenModal: React.FC<ITradeBrealEvenModalProps> = ({
	openModal,
	handleModalClose,
	selectedTrade,
	setShowToast,
	setToastType,
	setToastMessage,
}) => {
	const { breakEvenActiveMasterTrade, data, error, isError, isPending, isSuccess } =
		useBreakEvenActiveMasterTrade();

	const handleActiveTradeBreakEven = () =>
		breakEvenActiveMasterTrade({
			masterTradeId: selectedTrade.id,
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
					Break Even
				</p>
			}
			headerDivider={true}
			onClose={isPending ? undefined : handleModalClose}
		>
			<div className="pt-5 px-2 space-y-5">
				{selectedTrade &&
					renderDisplayItem({
						itemImage: selectedTrade.baseAssetLogoUrl,
						itemText: {
							text: `${selectedTrade.baseAsset} / ${selectedTrade.quoteCurrency}`,
							style: "font-bold",
						},
						styles: "!mx-0 md:!mx-0 !justify-start",
						isAssetItem: true,
						assetTradeSide: renderStatus(
							selectedTrade.side,
							{ justify: "justify-center" },
							false,
							[],
							"uppercase text-[10px] font-semibold",
						),
					})}

				<section className="bg-[#F8F9FC] rounded-md p-5 space-y-5 font-semibold">
					<p className="flex items-center justify-between">
						<span className="text-[#414141] text-sm">Entry Price</span>
						<span className="text-[#808080] text-base">{selectedTrade.entryPrice}</span>
					</p>
					<p className="flex items-center justify-between">
						<span className="text-[#414141] text-sm">Market Price</span>
						<span className="text-[#808080] text-base">
							{selectedTrade.currentPrice}
						</span>
					</p>
				</section>

				<section className="bg-[#FFF6EB] rounded-md p-5 font-medium">
					<p className="text-[#595B60] text-sm">
						This will close 50% of your position at current market price and move your
						stop loss to your entry.
					</p>
				</section>
				<section className="pt-6">
					<Button
						labelText={isPending ? "Updating ..." : "Confirm"}
						className="w-full !font-bold text-base"
						onClick={handleActiveTradeBreakEven}
						disabled={isPending}
					/>
				</section>
			</div>
		</Modal>
	);
};

export default TradeBreakEvenModal;
