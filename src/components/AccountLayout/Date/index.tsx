import type { ChangeEvent } from "react";
import React from "react";

interface DateProps {
	label: string;
	name: string;
	value: string;
	required: boolean;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Date: React.FC<DateProps> = ({ label, name, value, onChange, required = false }) => {
	return (
		<div>
			<label className="block text-zinc-500 text-sm font-normal mb-2" htmlFor={name}>
				{label}
			</label>
			<input
				required={required}
				type="date"
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				className="px-3 py-2 w-full border border-slate-300 leading-tight rounded-lg text-zinc-500 text-sm font-bold focus:outline-none focus:border-blue-500"
			/>
		</div>
	);
};

export default Date;
