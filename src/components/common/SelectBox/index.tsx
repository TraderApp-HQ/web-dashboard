import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../icons/SearchIcon";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { ISelectBoxOption } from "~/components/interfaces";
import Image from "next/image";

/**
 * Represents the props for the SelectBox component.
 */
interface ISelectBoxProps {
	options: ISelectBoxOption[];
	option?: ISelectBoxOption;
	setOption?: (option: ISelectBoxOption) => void;
	placeholder?: string;
	labelText?: string;
	labelClassName?: string;
	className?: string;
	containerStyle?: string;
	bgColor?: string;
	isSearchable?: boolean;
}

/**
 * SelectBox component.
 * @param {SelectBoxProps} props - The props for the SelectBox component.
 * @param {string[]} props.options - The array of selectBox options.
 * @param {string} props.placeholder - The placeholder text for the selectBox.
 * @param {string} [props.label] - The label for the selectBox.
 * @returns {JSX.Element} The rendered SelectBox component.
 */
const SelectBox: React.FC<ISelectBoxProps> = ({
	options,
	option,
	setOption,
	placeholder,
	labelText,
	labelClassName,
	className,
	bgColor,
	containerStyle,
	isSearchable,
}: ISelectBoxProps): JSX.Element => {
	const [selectedOption, setSelectedOption] = useState<ISelectBoxOption>();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const selectBoxRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const filteredOptions = options.filter((option) =>
		option.displayText.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Close selectBox when clicked outside
	useEffect(() => {
		/**
		 * Handles the click outside the selectBox.
		 * @param {MouseEvent} event - The mouse event.
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (selectBoxRef.current && !selectBoxRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		// Focus the input element when the component mounts
		if (isSearchable && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Set default option or externally provided option
	useEffect(() => {
		if (option) {
			setSelectedOption(option);
		}
	}, [option]);

	// Notify external setOption handler when the selected option changes
	useEffect(() => {
		if (setOption && selectedOption) setOption(selectedOption);
	}, [selectedOption]);

	return (
		<div>
			{labelText && (
				<label
					aria-label={labelText}
					className={`text-sm text-[#08123B] font-normal ${labelClassName}`}
				>
					{labelText}
				</label>
			)}
			<div
				className={`relative ${containerStyle}`}
				aria-labelledby={labelText}
				ref={selectBoxRef}
			>
				{/* for testing */}
				{filteredOptions.map(({ value, displayText }) => (
					<div key={value} data-testid={displayText} />
				))}

				<div
					// data-testid={options.map(({ displayText }) => displayText).join("")}
					className={`p-[16px] placeholder-[#808080] w-full text-[#102477] invalid:text-[#808080] rounded-lg font-normal outline-[1px] outline-[#6579CC] appearance-none bg-no-repeat bg-[center_right_1em] invalid:[&:not(:empty)]:visited:border-red-500 invalid:[&:not(:placeholder-shown)]:border-[1px] ${
						isOpen ? "border-[#7949FF]" : "border-gray-100"
					} rounded-md p-2 flex justify-between items-center cursor-pointer ${bgColor ? bgColor : "bg-[#F5F8FE]"}`}
					onClick={() => setIsOpen(!isOpen)}
				>
					{!selectedOption && (
						<span className="text-[#808080]">{placeholder || "Select option"}</span>
					)}
					{selectedOption && (
						<SelectBoxOption
							displayText={selectedOption.displayText}
							imgUrl={selectedOption.imgUrl}
						/>
					)}
					{isOpen ? <FiChevronUp /> : <FiChevronDown />}
				</div>
				{isOpen && (
					<div className="absolute mt-1 w-full bg-white border border-gray-300 shadow-lg z-10 transition-all duration-300 ease-out transform scale-100">
						{isSearchable && (
							<div className="p-2 flex items-center justify-between bg-slate-50">
								<SearchIcon />
								<input
									type="text"
									placeholder="Search option"
									className="w-full p-2 bg-transparent rounded-md flex-1 focus:outline-none focus:ring-0 focus:border-none"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									ref={inputRef}
								/>
							</div>
						)}
						<ul role="listbox" className={`max-h-60 overflow-auto ${className}`}>
							{filteredOptions.map((option, index) => (
								<li
									key={index}
									className={`p-3 hover:bg-gray-100 cursor-pointer ${
										option.value === selectedOption?.value ? "bg-gray-100" : ""
									}`}
									onClick={() => {
										setSelectedOption(option);
										setIsOpen(false);
										setSearchTerm("");
									}}
								>
									<SelectBoxOption
										displayText={option.displayText}
										imgUrl={option.imgUrl}
									/>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default SelectBox;

// SelectBox option component
interface ISelectBoxOptionProps {
	displayText: string;
	imgUrl?: string;
	alt?: string;
	className?: string;
}
const SelectBoxOption: React.FC<ISelectBoxOptionProps> = ({
	displayText,
	imgUrl,
	alt,
	className,
}) => {
	return (
		<div className="flex items-center space-x-2">
			{imgUrl && (
				<Image
					src={imgUrl}
					alt={alt ?? displayText}
					className={`w-5 h-5 ${className}`}
					width={20}
					height={20}
				/>
			)}
			<div>{displayText}</div>
		</div>
	);
};
