import React from "react";

interface OrderedListTileProps {
	items: string[];
}
const OrderedListTile: React.FC<OrderedListTileProps> = ({ items }) => {
	return (
		<ul className="flex flex-col gap-y-5 my-5">
			{items.map((text, index) => (
				<div key={index} className="flex gap-x-3 items-center">
					<div className="w-8 h-10 px-5 py-3 bg-gray-200 rounded-3xl justify-center items-center inline-flex">
						<div className="text-blue-800 text-base font-bold leading-normal">
							{index + 1}
						</div>
					</div>
					<li className="text-neutral-700 text-base font-bold leading-normal">{text}</li>
				</div>
			))}
		</ul>
	);
};

export default OrderedListTile;
