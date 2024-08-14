import type { ReactNode } from "react";
import React from "react";
import clsx from "clsx";

interface Option {
	value: string;
	text: string;
}

interface SelectProps {
	name: string;
	label: string;
	options: Option[];
	placeholder?: string;
	selected?: Pick<Option, "value">;
	error?: ReactNode;
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	classNames?: {
		input?: string;
		label?: string;
		wrapper?: string;
	};
	required?: boolean;
}

export default function Select({
	name,
	label,
	options,
	placeholder,
	selected,
	classNames,
	error,
	onChange,
	required = false,
}: SelectProps) {
	const hasSelected = Boolean(selected);

	return (
		<div className={clsx(classNames?.wrapper && classNames.wrapper)}>
			<label
				htmlFor={name}
				className={clsx(
					"text-zinc-500 text-sm font-normal",
					classNames?.label && classNames.label,
				)}
			>
				{label}
				{required && <span className="text-lg leading-normal">*</span>}
			</label>
			<div>
				<select
					onChange={onChange}
					defaultValue={selected?.value ?? "default"}
					value={selected?.value}
					id={name}
					name={name}
					className={clsx(
						"pl-1.5 py-2.5 text-zinc-500 font-bold leading-tight pr-10 block mt-1 w-full text-base sm:text-sm rounded-md border border-slate-300 focus:border-blue-800 focus:ring-0 focus:outline-none pointer-events-auto",
						classNames?.input && classNames.input,
					)}
				>
					<>
						{placeholder && !hasSelected && (
							<option value="default" disabled>
								{placeholder}
							</option>
						)}
						{options.map((option) => (
							<option value={option.value} key={option.value}>
								{option.text}
							</option>
						))}
					</>
				</select>
			</div>
			{error && <p className="h-4 text-sm leading-normal text-pink">{error}</p>}
		</div>
	);
}

export function OptionalSelect(props: SelectProps) {
	return (
		<Select
			{...props}
			options={props.options.concat({
				value: "none",
				text: "N/A",
			})}
		/>
	);
}
