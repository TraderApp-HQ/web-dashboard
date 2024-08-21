import Image from "next/image";
import React from "react";
import ConnectionIcon from "~/components/icons/ConnectionIcon";
import TraderAppIcon from "~/components/icons/TraderAppIcon";

interface ExchangeTileProps {
	imageUrl?: string;
	bgColor?: string;
	textColor?: string;
	size?: {
		width?: string;
		height?: string;
	};
}

const ExchangeTile: React.FC<ExchangeTileProps> = ({
	bgColor = "bg-indigo-50",
	textColor = "text-blue-800",
	size = { width: "w-[70px]", height: "h-[70px]" },
	imageUrl,
}) => {
	return (
		<div className="flex justify-center items-center">
			<TraderAppIcon />
			<ConnectionIcon />
			{imageUrl ? (
				<Image src={imageUrl} width={70} height={70} alt="" />
			) : (
				<div
					className={`flex justify-center items-center text-xs rounded-full p-2 md:text-sm font-semibold cursor-pointer ${textColor} ${bgColor} ${size.height} ${size.width}`}
				>
					N/A
				</div>
			)}
		</div>
	);
};

export default ExchangeTile;
