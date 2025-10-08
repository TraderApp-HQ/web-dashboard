import { useState } from "react";
import { IMasterTrade } from "~/apis/handlers/trading-engine/interfaces";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import { renderDisplayItem, renderStatus } from "~/helpers";
import Modal from "..";
import ConfirmationModal from "../ConfirmationModal";

interface ICloseTradeModalProps {
	openModal: boolean;
	handleModalClose: () => void;
	selectedTrade: IMasterTrade;
}

const CloseTradeModal: React.FC<ICloseTradeModalProps> = ({
	openModal,
	handleModalClose,
	selectedTrade,
}) => {
	const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
	const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
	const percentageRange = [10, 25, 50, 75, 100];

	const handleConfirmationModalClose = () => {
		setOpenConfirmationModal(false);
	};

	return (
		<Modal
			openModal={openModal}
			title={
				<p
					data-testid="trade-modal-form"
					className="font-bold text-lg md:text-2xl text-textColor flex items-center"
				>
					Close Trade
				</p>
			}
			headerDivider={true}
			onClose={handleModalClose}
		>
			<div className="pt-5 space-y-5">
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

				<section className="space-y-4">
					<InputField
						type="number"
						labelText="Quantity"
						labelClassName="!text-black !font-semibold"
						props={{ name: "quantity" }}
						placeholder="Quantity"
						value={String(selectedTrade.baseQuantity) ?? ""}
						className="no-spin-buttons disabled:cursor-not-allowed !font-semibold !text-base"
						disable={true}
					/>

					<section className="flex items-center gap-8">
						{percentageRange.map((percentage) => (
							<section
								key={percentage}
								className={`w-20 h-12 rounded-xl text-center place-content-center cursor-pointer hover:bg-buttonColor hover:text-white transition-colors duration-300 ${selectedPercentage === percentage ? "bg-buttonColor text-white" : "bg-[#F0F1F4]"}`}
								onClick={() => {
									if (selectedPercentage === percentage) {
										setSelectedPercentage(null);
									} else {
										setSelectedPercentage(percentage);
									}
								}}
							>
								{percentage}%
							</section>
						))}
					</section>

					<section className="pt-6">
						<Button
							labelText="Confirm"
							className="w-full !font-bold text-base"
							onClick={() => setOpenConfirmationModal(true)}
							disabled={!selectedPercentage}
						/>
					</section>
				</section>
			</div>

			<ConfirmationModal
				title="Close Trade"
				description={`You are about to close ${selectedPercentage}% of ${selectedTrade.pair} trade.`}
				openModal={openConfirmationModal}
				btnCancle={handleConfirmationModalClose}
				onClose={handleConfirmationModalClose}
				btnConfirm={() => {}}
			/>
		</Modal>
	);
};

export default CloseTradeModal;
