import { useRouter } from "next/router";
import { useState } from "react";
import { supportedOperations } from "~/apis/handlers/wallets/constants";
import { IWalletConvertedBalance } from "~/apis/handlers/wallets/interface";
import Card from "~/components/AccountLayout/Card";
import IconButton from "~/components/AccountLayout/IconButton";
import SelectBox from "~/components/common/SelectBox";
import EyesIcon from "~/components/icons/EyesIcon";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import { ISelectBoxOption } from "~/components/interfaces";
import { formatCurrency } from "~/lib/utils";
import HidenBalance from "../HidenBalance";

interface ITotalBalanceSectionProps {
	showBalanceText?: string;
	btcBalance?: string;
	totalBalanceStyle?: string;
	padding?: string;
	walletConvertedBalance?: IWalletConvertedBalance[];
	isError?: boolean;
}

export default function WalletBalanceCard({
	showBalanceText = "Total Balance",
	// btcBalance,
	totalBalanceStyle,
	padding,
	walletConvertedBalance,
	isError,
}: ITotalBalanceSectionProps) {
	const router = useRouter();
	const [showBalance, handleShowBalance] = useState<boolean>(true);
	const [walletBalance, setWalletBalance] = useState<number>(0);
	const [walletBalanceOptions] = useState<ISelectBoxOption[]>(
		(walletConvertedBalance ?? []).map((bal) => ({
			displayText: bal.currency,
			value: bal.balance.toString(),
		})),
	);

	return (
		<Card
			className={`flex flex-col gap-3 md:items-start md:flex-row md:justify-between ${padding ? padding : "p-5"}`}
		>
			<section className="space-y-4">
				<section className="flex items-center space-x-2">
					<h4 className="text-sm text-black font-bold">{showBalanceText}</h4>

					{!isError && (
						<span
							onClick={() => handleShowBalance(!showBalance)}
							className="cursor-pointer"
						>
							{showBalance ? <EyesIcon /> : <OpenEyesIcon />}
						</span>
					)}
				</section>

				{isError ? (
					<p className="text-red-300">Error fetching wallet balance. Please try again.</p>
				) : (
					<section className="h-8 flex items-center justify-start">
						{showBalance ? (
							<section className="flex items-baseline gap-2">
								<h2
									className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl"}`}
								>
									{formatCurrency(walletBalance)}
								</h2>

								<SelectBox
									isSearchable={false}
									options={walletBalanceOptions}
									option={walletBalanceOptions[0]}
									setOption={(opt) => setWalletBalance(parseFloat(opt.value))}
									bgColor="transparent"
									buttonClassName="!p-0 !space-x-0"
									fontStyles="text-lg capitalize font-bold text-textGray"
									optionsClass="!p-1"
								/>
							</section>
						) : (
							<HidenBalance />
						)}
					</section>
				)}
			</section>

			{!isError && (
				<section className="grid grid-cols-1 space-y-3 md:space-y-0 md:flex gap-px md:gap-2 flex-wrap md:justify-between md:space-x-2 text-xs">
					{supportedOperations.map((item) => (
						<IconButton
							key={item.label}
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
			)}
		</Card>
	);
}
