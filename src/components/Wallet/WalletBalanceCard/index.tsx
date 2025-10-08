import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supportedOperations } from "~/apis/handlers/wallets/constants";
import Card from "~/components/AccountLayout/Card";
import IconButton from "~/components/AccountLayout/IconButton";
import SelectBox from "~/components/common/SelectBox";
import EyesIcon from "~/components/icons/EyesIcon";
import OpenEyesIcon from "~/components/icons/OpenEyesIcon";
import { ISelectBoxOption } from "~/components/interfaces";
import { formatCurrency } from "~/lib/utils";
import HidenBalance from "../HidenBalance";
import ComponentError from "~/components/Error/ComponentError";
import { useGetUserWalletsBalance } from "~/hooks/useWallets";
import { WalletType } from "~/apis/handlers/wallets/enum";
import WalletBalanceCardLoader from "~/components/Loaders/WalletBalanceCardLoader";
import useFeatureFlag from "~/hooks/useFeatureFlag";
import useUserProfileData from "~/hooks/useUserProfileData";

interface ITotalBalanceSectionProps {
	showBalanceText?: string;
	btcBalance?: string;
	totalBalanceStyle?: string;
	cardStyle?: string;
}

export default function WalletBalanceCard({
	showBalanceText = "Total Balance",
	// btcBalance,
	totalBalanceStyle,
	cardStyle,
}: ITotalBalanceSectionProps) {
	// Get wallet balance hook
	const { data, isError, isLoading, isSuccess, refetch } = useGetUserWalletsBalance(
		WalletType.MAIN,
	);

	// Get User Id
	const { userId } = useUserProfileData();

	// Feature flag to show multiple wallet balances
	const showMultipleWalletBalance = useFeatureFlag({
		userId,
		flagName: "release-multiple-wallet-balance",
	});

	const router = useRouter();
	const [showBalance, setShowBalance] = useState<boolean>(true);
	const [walletTotalBalance, setWalletTotalBalance] = useState<number>(0);
	const [walletTotalBalanceOptions, setWalletTotalBalanceOptions] = useState<ISelectBoxOption[]>(
		[],
	);
	const [individualWalletBalanceOptions, setIndividualWalletBalanceOptions] = useState<
		ISelectBoxOption[]
	>([]);

	useEffect(() => {
		if (isSuccess && data) {
			setWalletTotalBalanceOptions(
				data.exchangeRateTotalBalances.map((bal) => ({
					displayText: bal.currency,
					value: bal.balance.toString(),
				})),
			);

			setIndividualWalletBalanceOptions(
				data.wallets.map((bal) => ({
					displayText: `${bal.currency.symbol} - ${bal.availableBalance}`,
					value: bal.availableBalance.toString(),
					imgUrl: bal.currency.logoUrl,
				})),
			);
		}
	}, [data, isSuccess]);

	// Refetch wallet balance every 2 minutes
	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 120000); // 2 minutes

		return () => clearInterval(interval);
	}, [refetch]);

	return (
		<>
			{isLoading ? (
				/////////////////// Loading State ///////////////
				<WalletBalanceCardLoader />
			) : !isLoading && isError ? (
				/////////////////// Error State ///////////////////
				<ComponentError errorMessage="Error fetching wallet balance. Please try again." />
			) : (
				isSuccess &&
				data && (
					<Card
						className={`flex flex-col sm:flex-row gap-3 sm:items-start sm:justify-between ${cardStyle ? cardStyle : "p-5"}`}
					>
						<section className="space-y-5">
							<section className="flex items-center space-x-2">
								<h4 className="text-sm text-black font-bold text-nowrap">
									{showBalanceText}
								</h4>

								<span
									onClick={() => setShowBalance(!showBalance)}
									className="cursor-pointer"
								>
									{showBalance ? <EyesIcon /> : <OpenEyesIcon />}
								</span>
							</section>

							<section className="min-h-8 flex items-center justify-start">
								{showBalance ? (
									<section className="space-y-5 mb-5 sm:mb-0">
										<section className="flex items-baseline gap-2 text">
											<SelectBox
												isSearchable={false}
												options={walletTotalBalanceOptions}
												option={walletTotalBalanceOptions[0]}
												setOption={(opt) =>
													setWalletTotalBalance(parseFloat(opt.value))
												}
												bgColor="bg-[#F1F5FF]"
												buttonClassName="px-3 py-2"
												fontStyles="text-base capitalize font-semibold text-textGray"
												optionsClass="!p-1"
											/>

											<h2
												className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl"}`}
											>
												{formatCurrency(walletTotalBalance)}
											</h2>
										</section>

										{showMultipleWalletBalance && (
											<section className="flex items-center">
												<SelectBox
													isSearchable={false}
													options={individualWalletBalanceOptions}
													option={individualWalletBalanceOptions[0]}
													bgColor="bg-[#F1F5FF]"
													buttonClassName="px-3 py-2"
													fontStyles="font-medium text-base capitalize text-[#1E1E1E]"
													optionsClass="!p-1"
												/>
											</section>
										)}
									</section>
								) : (
									<HidenBalance />
								)}
							</section>
						</section>

						<section className="flex flex-col sm:flex-row gap-3 items-center">
							{supportedOperations.map((item) => (
								<IconButton
									key={item.label}
									Icon={item.Icon}
									btnClass={`px-4 gap-2 border border-buttonColor font-semibold rounded-lg w-full sm:w-32 lg:w-48 h-12 ${item.label.toLowerCase() === "deposit" ? "bg-buttonColor text-white hover:opacity-80 hover:transition-colors" : "bg-white text-buttonColor"}`}
									onClick={() => router.push(item.url)}
									disabled={false}
								>
									{item.label}
								</IconButton>
							))}
						</section>
					</Card>
				)
			)}
		</>
	);
}
