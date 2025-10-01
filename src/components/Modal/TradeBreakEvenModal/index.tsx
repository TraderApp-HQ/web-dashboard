import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";

const TradeBreakEvenModal = ({
	openModal,
	handleModalClose,
	selectedTrade,
}: {
	openModal: boolean;
	handleModalClose: () => void;
	selectedTrade: IMasterTrade;
}) => {
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
					<p className="text-[#5959B60] text-sm">
						This will close 50% of your position at current market price and move your
						stop loss to your entry.
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

export default TradeBreakEvenModal;
