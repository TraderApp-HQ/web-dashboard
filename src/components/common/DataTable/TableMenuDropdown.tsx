import React from "react";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import DottedIcon from "~/components/icons/DottedIcon";
import type { ITableActions } from "./config";
import Toggle from "../Toggle/Toggle";

interface ITableMenuDropdown {
	dataTableMenuItems: ITableActions[];
}

const TableMenuDropdown: React.FC<ITableMenuDropdown> = ({ dataTableMenuItems }) => {
	return (
		<div>
			<DropdownMenu
				className="w-[206px] justify-start"
				btnClass="z-0"
				subClass="z-10"
				trigger={<DottedIcon />}
				position="left"
			>
				{dataTableMenuItems.map((item, index) => {
					if (item.onClick) {
						return (
							<DropdownMenuItem key={index} onClick={item.onClick} type="button">
								{item.label}
							</DropdownMenuItem>
						);
					}
					if (item.url) {
						return (
							<DropdownMenuItem key={index} type="link" to={item.url}>
								{item.label}
							</DropdownMenuItem>
						);
					}
					return (
						<DropdownMenuItem key={index} type="text">
							<Toggle
								label={item.label}
								isToggledOn={item.isToggle!}
								onClick={item.setToggle!}
							/>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenu>
		</div>
	);
};

export default TableMenuDropdown;
