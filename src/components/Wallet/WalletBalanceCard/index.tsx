import { useRouter } from "next/router";
import { useState } from "react";
import { supportedOperations } from "~/apis/handlers/wallets/constants";
import { IUserWallet, IWalletConvertedBalance } from "~/apis/handlers/wallets/interface";
import Card from "~/components/AccountLayout/Card";
import IconButton from "~/components/AccountLayout/IconButton";
import SelectBox from "~/components/common/SelectBox";
import EyesIcon from "~/components/icons/EyesIcon";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import { ISelectBoxOption } from "~/components/interfaces";
import { formatCurrency } from "~/lib/utils";
import HidenBalance from "../HidenBalance";
import ComponentError from "~/components/Error/ComponentError";

interface ITotalBalanceSectionProps {
	showBalanceText?: string;
	btcBalance?: string;
	totalBalanceStyle?: string;
	padding?: string;
	walletConvertedTotalBalances?: IWalletConvertedBalance[];
	walletSeperateBalances?: IUserWallet[];
	isError?: boolean;
}

export default function WalletBalanceCard({
	showBalanceText = "Total Balance",
	// btcBalance,
	totalBalanceStyle,
	padding,
	walletConvertedTotalBalances,
	walletSeperateBalances,
	isError,
}: ITotalBalanceSectionProps) {
	const router = useRouter();
	const [showBalance, handleShowBalance] = useState<boolean>(true);
	const [walletTotalBalance, setWalletTotalBalance] = useState<number>(0);
	const [walletTotalBalanceOptions] = useState<ISelectBoxOption[]>(
		(walletConvertedTotalBalances ?? []).map((bal) => ({
			displayText: bal.currency,
			value: bal.balance.toString(),
		})),
	);
	const [individualBalance, setIndividualBalance] = useState<number>(0);
	const [individualWalletBalanceOptions] = useState<ISelectBoxOption[]>(
		(walletSeperateBalances ?? []).map((bal) => ({
			displayText: bal.currency.symbol,
			value: bal.availableBalance.toString(),
			imgUrl: bal.currency.logoUrl,
		})),
	);

	return (
		<>
			{isError ? (
				<ComponentError errorMessage="Error fetching wallet balance. Please try again." />
			) : (
				<Card
					className={`flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between ${padding ? padding : "p-5"}`}
				>
					<section className="space-y-4">
						<section className="flex items-center space-x-2">
							<h4 className="text-sm text-black font-bold text-nowrap">
								{showBalanceText}
							</h4>

							<span
								onClick={() => handleShowBalance(!showBalance)}
								className="cursor-pointer"
							>
								{showBalance ? <EyesIcon /> : <OpenEyesIcon />}
							</span>
						</section>

						<section className="min-h-8 flex items-center justify-start">
							{showBalance ? (
								<section className="space-y-4 mb-5 sm:mb-0">
									<section className="flex items-baseline gap-2">
										<SelectBox
											isSearchable={false}
											options={walletTotalBalanceOptions}
											option={walletTotalBalanceOptions[0]}
											setOption={(opt) =>
												setWalletTotalBalance(parseFloat(opt.value))
											}
											bgColor="bg-[#F1F5FF]"
											buttonClassName="px-2 py-[2px]"
											fontStyles="text-lg capitalize font-bold text-textGray"
											optionsClass="!p-1"
										/>

										<h2
											className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl"}`}
										>
											{formatCurrency(walletTotalBalance)}
										</h2>
									</section>

									<section className="flex items-center gap-4 bg-[#F1F5FF] px-1 rounded-md">
										<SelectBox
											isSearchable={false}
											options={individualWalletBalanceOptions}
											option={individualWalletBalanceOptions[0]}
											setOption={(opt) =>
												setIndividualBalance(parseFloat(opt.value))
											}
											bgColor="bg-[#F1F5FF]"
											buttonClassName="px-2 py-[2px]"
											fontStyles="text-lg capitalize font-bold text-textGray"
											optionsClass="!p-1"
										/>

										<h2 className="font-semibold text-base text-[#585858]">
											{individualBalance}
										</h2>
									</section>
								</section>
							) : (
								<HidenBalance />
							)}
						</section>
					</section>

					<section className="flex flex-col sm:flex-row gap-3 items-center text-xs">
						{supportedOperations.map((item) => (
							<IconButton
								key={item.label}
								Icon={item.Icon}
								btnClass={`px-4 gap-2 border border-buttonColor rounded-md text-sm font-medium w-full sm:w-32 lg:w-48 h-12 ${item.label.toLowerCase() === "deposit" ? "bg-buttonColor text-white hover:opacity-80 hover:transition-colors" : "bg-white text-buttonColor"}`}
								iconClass=""
								onClick={() => router.push(item.url)}
								disabled={false}
							>
								{item.label}
							</IconButton>
						))}
					</section>
				</Card>
			)}
		</>
	);
}
