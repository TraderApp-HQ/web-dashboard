import clsx from "clsx";
import { useState } from "react";
import type { Asset } from "~/lib/types";
import CustomSelect from "../CustomSelect";
import RoundedTextDiv from "~/components/AccountLayout/RoundedTextDiv";
import InputField from "~/components/common/InputField";
import { handleKeyDown } from "~/lib/utils";

interface ConvertItemParam {
	className?: string;
	assets: Asset[];
	selectedDefault: Asset;
	title?: string;
	onSelected?: (asset: Asset) => void;
}

export default function ConvertItem({
	className,
	assets,
	selectedDefault,
	onSelected,
	title,
}: ConvertItemParam) {
	const [selectedAsset, setSelectedAsset] = useState(selectedDefault);
	const handleSelect = (asset: Asset) => {
		setSelectedAsset(asset);
		if (onSelected) {
			onSelected(asset);
		}
	};

	return (
		<div
			className={clsx(
				"rounded-xl border border-[#D1D7F0] cursor-pointer p-4 flex flex-col text-left bg-[#F9FBFF]",
				className,
			)}
		>
			<h2 className="text-[#08123B] text-base font-semibold sha"> {title}</h2>
			<div className="flex justify-between items-center my-2">
				<CustomSelect
					className="w-24"
					assets={assets}
					onSelected={handleSelect}
					selectedDefault={selectedAsset}
				/>
				<RoundedTextDiv className=" w-44 h-[35px] rounded-md px-3 bg-[#FFFFFF]">
					<InputField
						onKeyDown={handleKeyDown}
						type="number"
						placeholder="00.0000"
						className="h-[32px] no-spin-buttons border-0 font-normal text-base w-full text-[13px] bg-[#FFFFFF] rounded-none outline-none outline-[white] text-[#808080] p-[0px] pr-[1px]"
					/>
					<h3 className="text-[#808080] text-[13px] flex items-center">
						{selectedAsset?.shortName}
					</h3>
				</RoundedTextDiv>
			</div>
			<div className="flex justify-between items-center">
				<h3 className="text-[#102477] text-xs font-bold">{selectedAsset?.name}</h3>
				<div className="flex justify-between mt-2 text-[#08123B] text-[12px]">
					<h3 className="me-1">23.300,000</h3>
					<h3 className="">{selectedAsset?.shortName}</h3>
				</div>
			</div>
		</div>
	);
}
