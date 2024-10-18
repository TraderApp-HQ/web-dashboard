import React from "react";

interface TextAreaProps {
	label?: string;
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	rows?: number;
	cols?: number;
	className?: string;
	inputError?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
	label,
	value,
	onChange,
	placeholder,
	rows = 4,
	cols = 50,
	className,
	inputError,
}) => {
	return (
		<div className={`flex flex-col ${className}`}>
			{label && <label className="mb-2 font-medium text-gray-700">{label}</label>}
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={rows}
				cols={cols}
				className="placeholder-[#808080] w-full text-[#102477] bg-[#F5F8FE] rounded-lg font-normal p-[16px] pr-[54px] outline-[1px] outline-[#6579CC] invalid:[&:not(:placeholder-shown)]:border-red-500 invalid:[&:not(:placeholder-shown)]:border-[1px] resize-none"
			/>
			{inputError && (
				<p className="pl-2 font-normal text-red-600 text-[12px]">{inputError}</p>
			)}
		</div>
	);
};

export default TextArea;
