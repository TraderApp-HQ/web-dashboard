import type { ChangeEvent, FormEvent } from "react";
import React from "react";
import DropdownMenu, { DropdownMenuItem } from "../DropdownMenu";
import Select from "../Select";
import Button from "../Button";
import Date from "~/components/AccountLayout/Date";

interface IFilterDropdown {
	value: string;
	startDate: string;
	endDate: string;
	options: { value: string; text: string }[];
	setValue: (value: string) => void;
	onStartDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onEndDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const FilterDropdown: React.FC<IFilterDropdown> = ({
	value,
	setValue,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onSubmit,
	options,
}) => {
	return (
		<DropdownMenu
			className="w-[256px]"
			subClass=""
			btnClass="mt-7 mb-6 sm:mb-0 sm:mt-6 px-4 py-2 bg-gray-100 rounded-lg border"
			trigger={
				<>
					<div className="text-sky-900 text-base font-normal leading-snug">Filter</div>
					{/* <DropdownIcon /> */}
				</>
			}
			position="left"
		>
			<DropdownMenuItem className="flex flex-col gap-y-2">
				<form onSubmit={onSubmit} method="post">
					<Select
						name="assets"
						label="Assets"
						options={options}
						classNames={{
							input: "cursor-pointer",
						}}
						onChange={(e) => setValue(e.target.value)}
						selected={{ value }}
					/>
					<Date
						label="Start Date"
						name="startDate"
						value={startDate}
						onChange={onStartDateChange}
						required
					/>
					<Date
						label="End Date"
						name="endDate"
						value={endDate}
						onChange={onEndDateChange}
						required
					/>
					<Button type="submit" onClick={() => {}} fluid className="mt-2">
						Search
					</Button>
				</form>
			</DropdownMenuItem>
		</DropdownMenu>
	);
};

export default FilterDropdown;
