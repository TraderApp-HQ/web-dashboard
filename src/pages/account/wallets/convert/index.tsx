import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import ConvertItem from "~/components/Wallet/ConvertItem";
import data from "~/data/wallet/data.json";
import type { Asset } from "~/lib/types";
import { useState } from "react";
import ArrowSwap from "~/components/icons/ArrowSwap";
import Button from "~/components/AccountLayout/Button";
import { NestedWalletsLayout } from "..";

const WalletConvert = () => {
	const router = useRouter();
	const assets: Asset[] = data.assets;
	const [fromAsset, setFromAsset] = useState(
		assets.filter((asset) => asset?.shortName?.toLocaleLowerCase() === "btc")[0],
	);
	const [toAsset, setToAsset] = useState(
		assets.filter((asset) => asset?.shortName?.toLocaleLowerCase() === "usdt")[0],
	);
	const [openModal, setOpenModal] = useState(true);

	const onToAssetSelected = (asset: Asset) => {
		setToAsset(asset);
		setFromAsset(assets.filter((x) => x?.name !== asset?.name)[0]);
	};

	const onFromAssetSelected = (asset: Asset) => {
		setFromAsset(asset);
		setToAsset(assets.filter((x) => x?.name !== asset?.name)[0]);
	};
	const handleSwap = () => {
		const from = fromAsset;
		const to = toAsset;

		setFromAsset(to);
		setToAsset(from);
	};
	const onClose = () => {
		setOpenModal(false);
		router.back();
	};

	return (
		<>
			<Modal
				openModal={openModal}
				width="md:w-[450px]"
				onClose={onClose}
				title="Convert Currency"
			>
				<div className="space-y-5">
					<ConvertItem
						assets={assets}
						selectedDefault={fromAsset}
						onSelected={onFromAssetSelected}
						title="You Sell"
					/>
					<div className="flex justify-center cursor-pointer" onClick={handleSwap}>
						<ArrowSwap />
					</div>
					<ConvertItem
						assets={assets}
						selectedDefault={toAsset}
						onSelected={onToAssetSelected}
						title="You Buy"
					/>

					<div className="py-2 text-sm rounded px-4 bg-[#ECF2FF] text-[#65686C]">
						<h3>exchange rate (1USDT) = $098.00000</h3>
					</div>

					<div className="wallet-modal-btn-div">
						<Button fluid>Convert</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

WalletConvert.getLayout = (page: React.ReactElement) => (
	<NestedWalletsLayout>{page}</NestedWalletsLayout>
);
export default WalletConvert;
