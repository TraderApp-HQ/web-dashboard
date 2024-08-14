import React from "react";
import clsx from "clsx";
import { useDropdownMenu, DropdownMenuProvider } from "./DropdownMenuProvider";

interface DropdownMenuProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	classNames?: Partial<
		Record<"rootClass" | "dropDownClass" | "dropDownItemClass" | "triggerBtnClass", string>
	>;
	className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
	trigger,
	children,
	classNames,
	className,
}) => {
	const { isOpen, toggle, ref, positionRef, position } = useDropdownMenu();

	return (
		<div ref={ref} className={clsx("ml-3 relative", className, classNames?.rootClass)}>
			<button
				type="button"
				className={clsx(
					"mt-6 px-1.5 py-3 bg-sky-200 bg-opacity-20 rounded-lg border focus:outline-none ring-0 focus:ring-0",
					classNames?.triggerBtnClass,
				)}
				onClick={toggle}
			>
				<div className="justify-center items-center gap-2.5 flex">{trigger}</div>
			</button>
			{isOpen && (
				<div
					className={clsx(
						"absolute z-50 mt-2 bg-white p-4 border border-gray-100 rounded-md shadow-lg origin-top",
						classNames?.dropDownClass,
					)}
					style={{
						top: position.top,
						left: position.left,
					}}
				>
					<div className={clsx("", classNames?.dropDownItemClass)}>{children}</div>
				</div>
			)}
		</div>
	);
};

const DropdownMenuWrapper: React.FC<DropdownMenuProps> = (props) => (
	<DropdownMenuProvider>
		<DropdownMenu {...props} />
	</DropdownMenuProvider>
);

export default DropdownMenuWrapper;
