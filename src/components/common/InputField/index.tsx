/* eslint-disable @typescript-eslint/ban-types */
import React, { useState } from "react";

export type IInputFieldProps = {
	value?: string | Date;
	onChange?: (value: string) => void;
	pattern?: string;
	type: "text" | "password" | "email" | "number" | "radio" | "date";

	placeholder?: string;
	labelText?: string;
	labelClassName?: string;
	className?: string;
	icon?: { name: React.ReactNode; onClick?: () => void };
	props?: React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> & {};
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	inputError?: string;
	disable?: boolean;
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
	icon,
	onKeyDown,
	inputError,
	disable,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputType = type === "password" && showPassword ? "text" : type;

	const handleShowHidePassword = () => {
		setShowPassword(!showPassword);
	};

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
			<div className="relative">
				<input
					{...props}
					value={value?.toLocaleString()}
					onChange={(e) => {
						if (onChange) onChange(e.target.value);
					}}
					data-testid={labelText?.split(" ")[0]}
					pattern={pattern}
					type={inputType}
					disabled={disable}
					placeholder={placeholder}
					onKeyDown={onKeyDown}
					className={`placeholder-[#808080] w-full text-[#102477] bg-[#F5F8FE] rounded-lg font-normal p-[16px] outline-[1px] outline-[#6579CC] invalid:[&:not(:placeholder-shown)]:border-red-500 invalid:[&:not(:placeholder-shown)]:border-[1px]",
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
				{icon && (
					<div
						onClick={icon.onClick}
						className="absolute top-0 right-[6px] h-full flex items-center cursor-pointer"
					>
						{icon.name}
					</div>
				)}
			</div>
			{inputError && (
				<p className="pl-2 font-normal text-red-600 text-[12px]">{inputError}</p>
			)}
		</div>
	);
};

export default InputField;
