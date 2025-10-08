import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";
import React from "react";

interface ICancelTradeModalProps {
	openModal: boolean;
	handleModalClose: () => void;
	selectedTrade: IMasterTrade;
}

const CancelTradeModal: React.FC<ICancelTradeModalProps> = ({
	openModal,
	handleModalClose,
	selectedTrade,
}) => {
	return (
		<Modal
			openModal={openModal}
			title={
				<p
					data-testid="trade-modal-form"
					className="font-bold text-lg md:text-2xl text-textColor flex items-center"
				>
					Cancel Trade
				</p>
			}
			headerDivider={true}
			onClose={handleModalClose}
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

				<section className="bg-[#FFF6EB] rounded-md p-5 font-medium">
					<p className="text-[#595B60] text-sm">
						This will cancel trade and close any pending orders for users
					</p>
				</section>
				<section className="pt-6">
					<Button
						labelText="Confirm"
						className="w-full !font-bold text-base"
						onClick={() => {}}
					/>
				</section>
			</div>
		</Modal>
	);
};

export default CancelTradeModal;
