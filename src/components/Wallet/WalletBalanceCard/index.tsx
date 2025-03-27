import Card from "~/components/AccountLayout/Card";
import EyesIcon from "~/components/icons/EyesIcon";
import type { JSXElementConstructor } from "react";
import { useState } from "react";
import data from "~/data/wallet/data.json";
import HidenBalance from "../HidenBalance";
import type { IconProps } from "~/components/AccountLayout/IconButton";
import IconButton from "~/components/AccountLayout/IconButton";
import { useRouter } from "next/router";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import { formatCurrency } from "~/lib/utils";

export interface ITotalBalanceItems {
	label: string;
	url: string;
	Icon: JSXElementConstructor<IconProps>;
}
interface ITotalBalanceSectionProps {
	supportedOperations: ITotalBalanceItems[];
	showBalanceText?: string;
	btcBalance?: string;
	totalBalanceStyle?: string;
	padding?: string;
}

export default function WalletBalanceCard({
	supportedOperations,
	showBalanceText = "Total Balance",
	// btcBalance,
	totalBalanceStyle,
	padding,
}: ITotalBalanceSectionProps) {
	const router = useRouter();
	const [showBalance, handleShowBalance] = useState(true);

	return (
		<Card
			className={`flex flex-col gap-3 md:items-start md:flex-row md:justify-between ${padding ? padding : "p-5"}`}
		>
			<section className="space-y-4">
				<section className="flex items-center space-x-2">
					<h4 className="text-sm text-black font-bold">{showBalanceText}</h4>

					<span
						onClick={() => handleShowBalance(!showBalance)}
						className="cursor-pointer"
					>
						{showBalance ? <EyesIcon /> : <OpenEyesIcon />}
					</span>
				</section>

				<section className="space-y-3">
					<section className="h-6 flex items-center">
						{showBalance ? (
							<h3
								className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl"}`}
							>
								{formatCurrency(data?.wallet?.totalBalance)}
								<span className="pl-2 text-xl">USD</span>
							</h3>
						) : (
							<HidenBalance />
						)}
					</section>
					<h4 className="text-sm font-normal text-[#585858]">
						<span className="pr-1 text-black font-semibold">≈</span>$
						{formatCurrency(data?.wallet?.totalBalance)}
					</h4>
				</section>
			</section>

			<section className="grid grid-cols-1 space-y-3 md:space-y-0 md:flex gap-px md:gap-2 flex-wrap md:justify-between md:space-x-2 text-xs">
				{supportedOperations.map((item, index) => (
					<IconButton
						key={index}
						Icon={item.Icon}
						btnClass={`px-4 gap-2 border border-buttonColor rounded-md text-sm font-medium w-full md:w-32 h-12 ${item.label.toLowerCase() === "deposit" ? "bg-buttonColor text-white hover:opacity-80 hover:transition-colors" : "bg-white text-buttonColor"}`}
						iconClass=""
						onClick={() => router.push(item.url)}
						disabled={false}
					>
						{item.label}
					</IconButton>
				))}
			</section>
		</Card>
	);
}
