import Image from "next/image";

const DisplayChange = ({ currentChange, imgSrc }: { currentChange?: number; imgSrc?: string }) => {
	const positive = currentChange && currentChange >= 0;
	const colorTheme = positive ? "bg-[#EDFDF8] text-[#08875D]" : "bg-[#FEF1F2] text-[#E02D3C]";
	return (
		<>
			<div
				className={`flex justify-start items-center gap-2 p-2 rounded-md w-fit ml-auto md:mx-auto ${currentChange ? colorTheme : "text-zinc-600"}`}
			>
				{imgSrc && <Image src={imgSrc} alt="Direction" width={8} height={8} />}
				<p className="text-sm font-normal leading-none whitespace-nowrap text-center">
					{(positive ? `+${currentChange}` : currentChange) ?? "-"} %
				</p>
			</div>
		</>
	);
};

export default DisplayChange;
