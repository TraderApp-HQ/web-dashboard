import React from "react";
import Image from "next/image";

interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: () => void;
	imageUrl?: string;
	className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, imageUrl, className }) => {
	return (
		<div
			data-testId="checkbox-data"
			className={`flex my-3 flex-row items-center justify-between w-full, ${className}`}
			onClick={onChange}
		>
			<div className="flex gap-x-2">
				{imageUrl && <Image src={imageUrl} width={28} height={28} alt={label} />}
				<span className="ml-2">{label}</span>
			</div>

			<div
				className={`w-6 h-6 flex items-center justify-center cursor-pointer border-2 rounded-lg ${
					checked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
				}`}
			/>
		</div>
	);
};

export default Checkbox;
