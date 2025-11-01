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
import { SupportedCurrency, WalletType } from "~/apis/handlers/wallets/enum";
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
	const [walletLockedBalance, setWalletLockedBalance] = useState<number>(0);
	const [selectedWalletCurrency, setSelectedWalletCurrency] = useState<string | undefined>(
		undefined,
	);
	const [walletTotalBalanceOptions, setWalletTotalBalanceOptions] = useState<ISelectBoxOption[]>(
		[],
	);
	const [individualWalletBalanceOptions, setIndividualWalletBalanceOptions] = useState<
		ISelectBoxOption[]
	>([]);

	useEffect(() => {
		if (isSuccess && data) {
			const totalBalanceOptions = data.exchangeRateTotalBalances.map((bal) => ({
				displayText: bal.currency,
				value: bal.balance.toString(),
			}));
			setWalletTotalBalanceOptions(totalBalanceOptions);

			setIndividualWalletBalanceOptions(
				data.wallets.map((bal) => ({
					displayText: `${bal.currency.symbol} - ${bal.availableBalance}`,
					value: bal.availableBalance.toString(),
					imgUrl: bal.currency.logoUrl,
				})),
			);

			setSelectedWalletCurrency((prev) => prev ?? totalBalanceOptions[0]?.displayText);
		}
	}, [data, isSuccess]);

	// Handles locked balance conversion to selected wallet currency
	useEffect(() => {
		if (!isSuccess || !data || !selectedWalletCurrency) return;
		// Convert locked balance from USDT to selected wallet currency
		const rate =
			data.exchangeRates.find((rate) => rate.pair.endsWith(selectedWalletCurrency))?.rate ??
			0;
		const lockedBalance =
			data.wallets.find(
				(wallet) =>
					wallet.walletTypeName === WalletType.MAIN &&
					wallet.currencySymbol === SupportedCurrency.USDT,
			)?.lockedBalance ?? 0;

		setWalletLockedBalance(lockedBalance * rate);
	}, [data, isSuccess, selectedWalletCurrency]);

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
										<section className="flex items-center gap-3">
											<h2
												className={`font-bold ${totalBalanceStyle ? totalBalanceStyle : "text-xl"}`}
											>
												{formatCurrency(walletTotalBalance)}
											</h2>

											<SelectBox
												isSearchable={false}
												options={walletTotalBalanceOptions}
												option={walletTotalBalanceOptions[0]}
												setOption={(opt) => {
													setWalletTotalBalance(parseFloat(opt.value));
													setSelectedWalletCurrency(opt.displayText);
												}}
												bgColor="bg-[#F1F5FF]"
												buttonClassName="px-1.5 py-2 !space-x-1"
												fontStyles="text-xs capitalize font-medium text-textGray"
												optionsClass="!p-1"
											/>
										</section>

										<h4 className={`font-medium text-sm text-textGray`}>
											Locked balance:{" "}
											<span className="font-semibold">
												{formatCurrency(walletLockedBalance)}
											</span>
										</h4>

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
