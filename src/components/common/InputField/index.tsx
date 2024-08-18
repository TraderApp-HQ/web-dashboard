/* eslint-disable @typescript-eslint/ban-types */
import React, { useState } from "react";

export type IInputFieldProps = {
	value?: string;
	onChange?: (value: string) => void;
	pattern?: string;
	type: "text" | "password" | "email" | "number" | "radio";
	placeholder?: string;
	labelText?: string;
	labelClassName?: string;
	className?: string;
	props?: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> & {};
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<IInputFieldProps> = ({
	props,
	value,
	onChange,
	pattern = ".{2,}",
	type,
	placeholder,
	labelText,
	labelClassName,
	className,
	onKeyDown,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputType = type === "password" && showPassword ? "text" : type;

	const handleShowHidePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div>
			{labelText && (
				<label className={`text-sm text-[#08123B] font-normal ${labelClassName}`}>
					{labelText}
				</label>
			)}
			<div className="relative">
				<input
					{...props}
					value={value}
					onChange={(e) => {
						if (onChange) onChange(e.target.value.trim());
					}}
					pattern={pattern}
					type={inputType}
					placeholder={placeholder}
					onKeyDown={onKeyDown}
					className={`placeholder-[#808080] w-full text-[#102477] bg-[#F5F8FE] rounded-lg font-normal p-[16px] pr-[54px] outline-[1px] outline-[#6579CC] invalid:[&:not(:placeholder-shown)]:border-red-500 invalid:[&:not(:placeholder-shown)]:border-[1px]",
             ${className}`}
				/>
				{type === "password" && (
					<p
						className="absolute top-0 right-[16px] font-bold text-[#1836B2] text-[12px] translate-y-[100%] cursor-pointer"
						onClick={handleShowHidePassword}
					>
						{showPassword ? "Hide" : "Show"}
					</p>
				)}
			</div>
		</div>
	);
};

export default InputField;
