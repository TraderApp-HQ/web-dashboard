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
	id?: string;
	signalValueInputLabel?: string;
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
	id,
	signalValueInputLabel,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const inputType = type === "password" && showPassword ? "text" : type;

	const normalizedValue = (() => {
		if (value === null || value === undefined) return undefined;
		if (value instanceof Date) {
			// For date inputs use YYYY-MM-DD (expected by <input type="date">)
			if (type === "date") {
				const year = value.getFullYear();
				const month = String(value.getMonth() + 1).padStart(2, "0");
				const day = String(value.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			}
			return value.toString();
		}
		if (typeof value === "number") return String(value);
		return value;
	})();

	const handleShowHidePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div>
			{labelText && (
				<label
					aria-label={labelText}
					className={`text-sm text-[#08123B] font-normal leading-none ${labelClassName}`}
				>
					{labelText}
				</label>
			)}
			<div className="relative mt-1">
				<input
					{...props}
					id={id}
					value={normalizedValue}
					onChange={(e) => {
						if (onChange) onChange(e.target.value);
					}}
					data-testid={labelText?.split(" ")[0]}
					pattern={pattern}
					type={inputType}
					disabled={disable}
					placeholder={placeholder}
					onKeyDown={onKeyDown}
					inputMode={props?.inputMode ?? (type === "number" ? "decimal" : undefined)}
					className={`placeholder-gray-400 w-full text-[#102477] bg-[#F5F8FE] rounded-lg font-normal p-[16px] outline-[1px] outline-[#6579CC] invalid:[&:not(:placeholder-shown)]:border-red-500 invalid:[&:not(:placeholder-shown)]:border-[1px] ${className}`}
				/>
				{signalValueInputLabel && (
					<p className="font-bold text-[#1836B2] text-[16px] absolute top-[50%] right-10 translate-y-[-50%] ">
						{signalValueInputLabel}
					</p>
				)}
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
						className="absolute top-0 right-2 h-full flex items-center cursor-pointer"
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
