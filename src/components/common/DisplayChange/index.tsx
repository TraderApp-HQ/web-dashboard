const DisplayChange = ({ currentChange }: { currentChange?: number }) => {
	const positive = currentChange && currentChange >= 0;
	const colorTheme = positive ? "bg-[#EDFDF8] text-[#08875D]" : "bg-[#FEF1F2] text-[#E02D3C]";
	return (
		<p
			className={`p-2 text-sm font-normal leading-none whitespace-nowrap text-center rounded-md w-fit ml-auto md:mx-auto ${currentChange ? colorTheme : "text-zinc-600"}`}
		>
			{(positive ? `+${currentChange}` : currentChange) ?? "-"} %
		</p>
	);
};

export default DisplayChange;
