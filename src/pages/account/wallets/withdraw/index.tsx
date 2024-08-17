import { useState } from "react";
import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import Otp from "~/components/Wallet/Otp";
import CustomSelect from "~/components/Wallet/CustomSelect";
import data from "~/data/wallet/data.json";
import type { Asset } from "~/lib/types";
import Button from "~/components/AccountLayout/Button";
import RoundedTextDiv from "~/components/AccountLayout/RoundedTextDiv";
import InputField from "~/components/common/InputField";
import { handleKeyDown } from "~/lib/utils";
import { NestedWalletsLayout } from "..";

const Withdraw = () => {
	const router = useRouter();
	const [openOTP, setOpenOTP] = useState(false);
	const [openModal, setOpenModal] = useState(true);

	const assets: Asset[] = data.assets;
	const [fromAsset, setFromAsset] = useState(
		assets.filter((assets) => assets?.shortName?.toLocaleLowerCase() === "btc")[0],
	);
	const [toAsset, setToAsset] = useState(
		assets.filter((assets) => assets?.shortName?.toLocaleLowerCase() === "usdt")[0],
	);

	const OpenOtp = () => {
		setOpenOTP(true);
		handleMeClose();
	};
	const onFromAssetSelected = (asset: Asset) => {
		setFromAsset(asset);
	};
	const onToAssetSelected = (asset: Asset) => {
		setToAsset(asset);
	};

	const handleMeClose = () => {
		setOpenModal(false);
		router.back();
	};

	const handleOtpClose = () => {
		setOpenOTP(false);
	};

	return (
		<>
			<Modal
				openModal={openModal}
				width="md:w-[807px]"
				title="Withdraw crypto"
				onClose={handleMeClose}
			>
				<div className="space-y-5 text-left">
					<div className="w-full py-4 px-4 rounded-3xl bg-[#F4F5FA] flex-col space-y-5">
						<div>
							<label htmlFor="select-coin" className="wallet-form-label">
								Select Coin
							</label>
							<CustomSelect
								assets={assets}
								selectedDefault={fromAsset}
								onSelected={onFromAssetSelected}
								selectedItemCss="bg-white h-16 rounded-2xl px-3"
							/>
						</div>
						<div>
							<InputField
								type="text"
								className="bg-[#FFFFFF]"
								labelClassName="wallet-form-label"
								placeholder="email address"
								labelText="Send To"
							/>
						</div>
						<div>
							<label htmlFor="network" className="wallet-form-label">
								Network
							</label>
							<CustomSelect
								assets={assets}
								selectedDefault={toAsset}
								onSelected={onToAssetSelected}
								selectedItemCss="bg-white h-16 rounded-2xl px-3"
							/>
						</div>
					</div>
					<div className="w-full pb-3">
						<h5 className="wallet-form-label">Enter amount to withdraw</h5>
						<RoundedTextDiv className="p-1 px-3 rounded-2xl">
							<InputField
								onKeyDown={handleKeyDown}
								type="number"
								placeholder="$000.00"
								className="textbox no-spin-buttons bg-[#FFFFFF]"
							/>
							<span className="text-[#08123B] text-base mt-2">USDT</span>
						</RoundedTextDiv>
						<div className="flex justify-between p-3 rounded-b-xl mt-1 text-xs bg-[#F2F4FA]">
							<span>Main Wallet:</span>
							<div className="flex">
								<span>213344.4884 USDT</span>
								<span className="text-[#102477] font-bold ml-1">MAX</span>
							</div>
						</div>
					</div>
					<div className="flex justify-between text-sm text-[#08123B] font-semibold">
						<div className="flex space-x-1">
							<span>Minimum withdrawal</span>
							<span>10 USDT</span>
						</div>
						<span>25.00 USDT</span>
					</div>

					<div className="flex text-[#08123B] font-bold text-base">
						<span>Total amount :</span>
						<span>21334.80000 USDT</span>
					</div>

					<div className="wallet-modal-btn-div">
						<Button fluid onClick={OpenOtp}>
							Withdraw
						</Button>
					</div>
				</div>
			</Modal>
			<Otp openModal={openOTP} onClose={handleOtpClose} />
		</>
	);
};

Withdraw.getLayout = (page: React.ReactElement) => (
	<NestedWalletsLayout>{page}</NestedWalletsLayout>
);
export default Withdraw;
