/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type { Asset } from "~/lib/types";
import ArrowDown from "~/components/icons/ArrowDown";
import Image from "next/image";

interface CustomSelectParam {
	label?: string;
	className?: string;
	assets: Asset[];
	selectedDefault: Asset;
	selectedItemCss?: string;
	onSelected: (asset: Asset) => void;
}

const CustomSelect: React.FC<CustomSelectParam> = ({
	label,
	className,
	assets,
	selectedItemCss,
	selectedDefault,
	onSelected,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (asset: Asset) => {
		onSelected(asset);
		setIsOpen(!isOpen);
	};

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: { target: any }) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsOpen && setIsOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [setIsOpen]);

	return (
		<div ref={ref} className={clsx("relative cursor-pointer", className)}>
			<label className={clsx("text-slate-900 text-sm font-normal leading-none")}>
				{label}
			</label>
			<div
				onClick={handleClick}
				className={clsx(
					"flex bg-slate-50 justify-between border border-gray items-center rounded pl-1.5 py-2.5 mt-2",
					selectedItemCss,
				)}
			>
				<div className="flex ml-2 space-x-2 items-center bg-slate-50">
					{selectedDefault?.image && (
						<Image
							src={selectedDefault?.image}
							alt={selectedDefault.name}
							className="w-6 h-6"
							width={24}
							height={24}
						/>
					)}
					<span className="text-slate-900 text-base">{selectedDefault?.shortName}</span>
				</div>
				<ArrowDown />
			</div>
			<div
				className={clsx(
					"z-10 dropdown-content bg-white absolute rounded-lg shadow w-full",
					isOpen ? "block" : "hidden",
				)}
			>
				<ul className="py-2 text-sm text-gray-700 ">
					{assets &&
						assets.map((item, index) => {
							const key = item?.id || `item-${index}`;
							return (
								<li key={key} onClick={() => handleSelect(item)}>
									<button
										type="button"
										className="inline-flex w-full px-4 py-2 text-sm hover:text-white hover:bg-blue-800"
									>
										<div className="inline-flex items-center">
											{item?.image && (
												<Image
													src={item?.image}
													alt={item.name}
													className="w-6 h-6 mr-2"
													width={24}
													height={24}
												/>
											)}
											{item?.name}
										</div>
									</button>
								</li>
							);
						})}
				</ul>
			</div>
		</div>
	);
};

export default CustomSelect;
