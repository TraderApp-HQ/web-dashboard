import Image from "next/image";
import React from "react";
import UserTile from "~/components/AccountLayout/UserTile";
import type { IDisplayItem } from "~/lib/types";

const DisplayItem: React.FC<IDisplayItem> = ({
	itemText,
	itemImage,
	itemSubText,
	isAssetItem,
	styles,
	useAvatar,
	avatarInitials,
	assetTradeSide,
	assetleverage,
}) => {
	return (
		<div
			className={`flex items-center space-x-3 md:justify-center justify-end ${styles} ${isAssetItem ? "md:w-[60%] md:mx-auto md:!justify-start" : ""}`}
		>
			{itemImage && !useAvatar && (
				<Image
					src={itemImage}
					alt="Asset Logo"
					className="w-[32px] h-[32px]"
					width={30}
					height={30}
				/>
			)}

			{useAvatar && <UserTile nameIntitials={avatarInitials ?? ""} />}
			<div
				className={`flex flex-col gap-y-0.5 max-w-[150px] md:max-w-none md:gap-y-1 md:items-start`}
			>
				<span className={`text-stone-900 ${itemText?.style}`}>{itemText.text}</span>
				{itemSubText?.text && (
					<span className={`text-xs font-normal ${itemSubText?.style}`}>
						{itemSubText.text}
					</span>
				)}
				{isAssetItem && (
					<div className="flex items-center gap-2">
						{assetTradeSide} {assetleverage}
					</div>
				)}
			</div>
		</div>
	);
};

export default DisplayItem;
