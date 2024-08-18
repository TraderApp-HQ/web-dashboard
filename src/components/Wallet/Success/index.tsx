import Button from "~/components/AccountLayout/Button";
import Modal from "~/components/Modal";
import SuccessIcon from "~/components/icons/SuccessIcon";

interface SuccessParam {
	openModal?: boolean;
	onClose: () => void;
	message?: string;
}

const WalletSuccess: React.FC<SuccessParam> = ({ openModal, message, onClose }) => {
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};
	return (
		<Modal openModal={openModal} width="md:w-[539px]">
			<div className="wallet-modal-btn-div flex-col px-8 justify-center space-y-8">
				<h2 className="text-[#021921] font-semibold text-[26px]">Successful</h2>
				<SuccessIcon />
				<h3 className="text-[#354052] text-base">{message}</h3>
				<Button fluid onClick={handleClose}>
					Continue
				</Button>
			</div>
		</Modal>
	);
};

export default WalletSuccess;
