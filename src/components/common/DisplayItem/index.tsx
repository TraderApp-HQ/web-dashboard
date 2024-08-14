import React from "react";
import type { IDisplayItem } from "~/lib/types";

const DisplayItem: React.FC<IDisplayItem> = ({ itemText, itemImage, itemSubText, styles }) => {
	return (
		<div className={`flex items-center md:justify-center justify-end space-x-4 ${styles}`}>
			{itemImage && <img src={itemImage} alt="Asset Logo" className="w-[30px] h-[30px]" />}
			<div className={`flex flex-col gap-y-0.5 md:gap-y-2 md:items-start`}>
				<span className={`text-stone-900 ${itemText?.style}`}>{itemText.text}</span>
				<span className={`text-xs font-normal ${itemSubText?.style}`}>
					{itemSubText?.text}
				</span>
			</div>
		</div>
	);
};

export default DisplayItem;
