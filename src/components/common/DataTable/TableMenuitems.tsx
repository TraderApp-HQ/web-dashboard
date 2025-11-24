import type { ITableActions } from "./config";
import Button from "~/components/AccountLayout/Button";
import { useRouter } from "next/router";
import IconButton from "~/components/AccountLayout/IconButton";

interface tableMenuItemsProps {
	dataTableMenuItems: ITableActions[];
	menueItemType?: "button" | "icon-button";
	justifyMenueItem?: string;
}

const TableMenuItems: React.FC<tableMenuItemsProps> = ({
	justifyMenueItem = "justify-center",
	dataTableMenuItems,
	menueItemType = "button",
}) => {
	const router = useRouter();

	return (
		<div className={`flex gap-x-3 text-xs ${justifyMenueItem}`}>
			{dataTableMenuItems.map((item, i) =>
				menueItemType === "button" ? (
					<Button
						size="small"
						key={`${i}-${item.label}`}
						bgColor="bg-stone-50"
						innerClassName="px-4 text-zinc-500 gap-2 normal-case"
						onClick={() => router.push(item.url ? item.url : "#")}
					>
						<span className="mt-1">{item.label}</span>
					</Button>
				) : (
					<IconButton
						key={`${i}-${item.url}`}
						Icon={item.icon}
						onClick={
							item.deleteAction
								? item.onClick
								: () => router.push(item.url ? item.url : "#")
						}
						aria-label={item.label}
						disabled={false}
					>
						{item.label}
					</IconButton>
				),
			)}
		</div>
	);
};

export default TableMenuItems;
