import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import AccountLayout from "~/components/AccountLayout/Layout";
import SelectBox from "~/components/common/SelectBox";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import {
	useCompleteWithdrawal,
	useGetUserWalletsBalance,
	useInitiateWithdrawal,
	useWalletDepositOptions,
} from "~/hooks/useWallets";
import { PaymentCategory, PaymentOperation, WalletType } from "~/apis/handlers/wallets/enum";
import { ISupportedNetworks, IWalletSupportedCurrencies } from "~/apis/handlers/wallets/interface";
import { ISelectBoxOption } from "~/components/interfaces";
import { WITHDRAWAL_LIMIT } from "~/apis/handlers/wallets/constants";
import useUserProfileData from "~/hooks/useUserProfileData";
import VerificationModal from "~/components/AuthLayout/Modal/VerificationModal";
import { NotificationChannel } from "~/apis/handlers/users/enums";
import Toast from "~/components/common/Toast";

const Withdraw = () => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(true);
	const [openOTPModal, setOpenOTPModal] = useState(false);

	const { userId } = useUserProfileData();

	const processingFee = 2;
	const networkFee = 1;

	const [selectedCurrency, setSelectedCurrency] = useState<
		IWalletSupportedCurrencies | undefined
	>(undefined);
	const [networks, setNetworks] = useState<ISupportedNetworks[] | undefined>([]);
	const [selectedNetwork, setSelectedNetwork] = useState<ISupportedNetworks | undefined>(
		undefined,
	);
	const [amount, setAmount] = useState<number | undefined>(undefined);
	const [amountToRecieve, setAmountToRecieve] = useState<number>(0);
	const [receivingAddress, setReceivingAddress] = useState("");

	const {
		data: walletBalanceData,
		// isError, isLoading, isSuccess, refetch
	} = useGetUserWalletsBalance(WalletType.MAIN);

	const availableCurrencyBalance = useMemo(
		() =>
			walletBalanceData?.wallets.find(
				(wallet) => wallet.currencySymbol === selectedCurrency?.symbol,
			)?.availableBalance ?? 0,
		[selectedCurrency, walletBalanceData],
	);

	const amountError = useMemo(() => {
		if (amount === undefined || !selectedCurrency) return "";

		const totalFees = processingFee + networkFee;
		const minWithdrawal =
			WITHDRAWAL_LIMIT.MINIMUM_AMOUNTS[
				selectedCurrency.symbol as keyof typeof WITHDRAWAL_LIMIT.MINIMUM_AMOUNTS
			];

		if (amount <= totalFees || amountToRecieve <= 0) {
			return `Amount must be greater than total fees`;
		}

		if (amount < minWithdrawal) {
			return `Amount is below the minimum withdrawal of ${minWithdrawal} ${selectedCurrency.symbol}`;
		}

		if (amount > availableCurrencyBalance) {
			return "Your balance is insufficient to cover the withdrawal amount and total fees";
		}

		return "";
	}, [
		amount,
		amountToRecieve,
		selectedCurrency,
		availableCurrencyBalance,
		processingFee,
		networkFee,
	]);

	const handleMeClose = () => {
		setOpenModal(false);
		router.back();
	};

	const handleSelectCurrency = (currency: ISelectBoxOption) => {
		const newCurrency = supportedCurrencies?.find(
			(supportedCurrency) => supportedCurrency.id === currency.value,
		);

		const paymentOption = paymentOptions?.find(
			(paymentOption) => paymentOption.symbol === newCurrency?.symbol,
		);
		setSelectedCurrency(newCurrency);
		setNetworks(paymentOption?.supportNetworks);
	};

	const handleSelectNetwork = (option: ISelectBoxOption) => {
		const result = networks?.find((network) => network.name === option.value);
		setSelectedNetwork(result);
	};

	const {
		supportedCurrencies,
		paymentOptions,
		// isLoading, isError, isSuccess, error
	} = useWalletDepositOptions({
		category: PaymentCategory.CRYPTO,
		operation: PaymentOperation.WITHDRAWAL,
	});

	const {
		initiateWithdrawal,
		data: initiateWithdrawalData,
		isPending,
		isSuccess: isInitiateWithdrawalSuccess,
		isError: isInitiateWithdrawalError,
		error: initiateWithdrawalError,
	} = useInitiateWithdrawal();

	const {
		completeWithdrawal,
		isSuccess: isCompleteWithdrawalSuccess,
		isPending: isCompleteWithdrawalPending,
		isError: isCompleteWithdrawalError,
		error: completeWithdrawalError,
	} = useCompleteWithdrawal();

	useEffect(() => {
		setAmountToRecieve(Math.max((amount ?? 0) - (processingFee + networkFee), 0));
	}, [amount]);

	useEffect(() => {
		if (isInitiateWithdrawalSuccess && initiateWithdrawalData) {
			setOpenOTPModal(true);
		}
	}, [isInitiateWithdrawalSuccess, initiateWithdrawalData]);

	return (
		<>
			<Modal
				openModal={openModal}
				width="md:w-[525px]"
				title="Withdraw crypto"
				onClose={handleMeClose}
				closeOnOutsideClick={!openOTPModal}
			>
				<section className="space-y-5 px-1">
					<SelectBox
						labelText="Currency"
						placeholder="Select Currency"
						isSearchable={false}
						options={(supportedCurrencies ?? [])?.map((currency) => ({
							displayText: currency.symbol,
							value: currency.id,
							imgUrl: currency.logoUrl,
						}))}
						option={{
							displayText: selectedCurrency?.symbol || "",
							value: selectedCurrency?.id || "",
							imgUrl: selectedCurrency?.logoUrl,
						}}
						setOption={handleSelectCurrency}
						clear={!selectedCurrency}
					/>

					<div>
						<label
							htmlFor="receiving-address"
							className="text-textColor text-sm font-medium block mb-2"
						>
							Receiving Address
						</label>
						<div className="relative">
							<InputField
								type="text"
								placeholder="Enter Receiving Address"
								className="pr-16 w-full py-4 bg-[#F5F8FE] rounded-lg"
								onChange={(address) => setReceivingAddress(address)}
								value={receivingAddress}
							/>
						</div>
					</div>

					<SelectBox
						labelText="Network"
						placeholder="Select Network"
						isSearchable={false}
						options={(networks ?? []).map((network) => ({
							displayText: network.name,
							value: network.name,
						}))}
						option={{
							displayText: selectedNetwork?.name ?? "",
							value: selectedNetwork?.name ?? "",
						}}
						setOption={handleSelectNetwork}
						clear={!selectedNetwork}
					/>

					{/* Amount field */}
					{/* <div>
						<label
							htmlFor="amount"
							className="text-textColor text-sm font-medium block mb-2"
						>
							Amount
						</label>

						{selectedCurrency && (
							<div className="flex justify-between -mt-2 mb-2">
								<p className="text-xs text-gray-500">
									Balance:{" "}
									{availableCurrencyBalance.toLocaleString("en-US", {
										maximumFractionDigits: 4,
									})}{" "}
									{selectedCurrency?.symbol}
								</p>
								<button
									type="button"
									onClick={() => {
										setAmount(Math.max(availableCurrencyBalance, 0));
									}}
									className="text-xs text-buttonColor font-semibold"
								>
									Max
								</button>
							</div>
						)}

						<div className="relative">
							<InputField
								type="number"
								placeholder="00.000"
								className="pr-16 no-spin-buttons w-full py-4 bg-[#F5F8FE] rounded-lg"
								onChange={(amount) => {
									setAmount(Math.abs(+amount));
								}}
								value={amount?.toString()}
							/>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-900 font-semibold">
								USDT
							</div>
						</div>
						{amountError && <p className="mt-2 text-xs text-red-600">{amountError}</p>}
					</div> */}
					<div>
						<div className="flex items-center justify-between">
							<label htmlFor="amount" className="text-textColor text-sm font-medium">
								Amount
							</label>

							{selectedCurrency && (
								<p className="text-xs text-gray-500">
									Balance:{" "}
									{availableCurrencyBalance.toLocaleString("en-US", {
										maximumFractionDigits: 4,
									})}{" "}
									{selectedCurrency?.symbol}
								</p>
							)}
						</div>

						<div className="relative mt-2">
							<InputField
								type="number"
								id="amount"
								placeholder="00.00"
								className="pr-16 no-spin-buttons w-full py-4 bg-[#F5F8FE] rounded-lg"
								onChange={(amount) => {
									setAmount(Math.abs(+amount));
								}}
								value={amount?.toString()}
							/>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-900 font-semibold">
								USDT
							</div>
						</div>
						<p
							className={`mt-2 text-xs text-red-600 ${amountError ? "" : "invisible"}`}
						>
							{amountError || "\u00A0"}
						</p>
					</div>

					<div className="bg-[#F5F8FE] rounded-lg p-4 space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-zinc-500 text-sm">Processing Fees</span>
							<span className="text-slate-900 text-base font-medium">
								{processingFee.toLocaleString("en-US", {
									maximumFractionDigits: 2,
									minimumFractionDigits: 2,
								})}{" "}
								USDT
							</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-zinc-500 text-sm">Network Fees</span>
							<span className="text-slate-900 text-base font-medium">
								{networkFee.toLocaleString("en-US", {
									maximumFractionDigits: 2,
									minimumFractionDigits: 2,
								})}{" "}
								USDT
							</span>
						</div>

						<div className="border-t border-[#E5E7EB] pt-3 mt-3"></div>

						<div className="flex justify-between items-center">
							<span className="text-slate-900 text-sm">Amount To Receive</span>
							<span className="text-slate-900 text-base font-medium">
								{amountToRecieve.toLocaleString("en-US", {
									maximumFractionDigits: 2,
									minimumFractionDigits: 2,
								})}{" "}
								USDT
							</span>
						</div>
					</div>

					<Button
						labelText="Withdraw"
						className="w-full tracking-widest"
						isProcessing={isPending}
						onClick={() => {
							if (
								!selectedCurrency ||
								!selectedNetwork ||
								!receivingAddress ||
								!paymentOptions
							) {
								return;
							}
							const paymentOption = paymentOptions.find(
								(paymentOption) => paymentOption.symbol === selectedCurrency.symbol,
							);
							initiateWithdrawal({
								userId,
								currencyId: selectedCurrency.id,
								paymentMethodId: paymentOption?.paymentMethodId ?? "",
								providerId: paymentOption?.providerId ?? "",
								network: selectedNetwork.slug,
								amount: amountToRecieve,
								destinationAddress: receivingAddress,
							});
						}}
						disabled={
							!selectedCurrency ||
							!selectedNetwork ||
							!receivingAddress ||
							amountToRecieve <= 0 ||
							!!amountError
						}
					/>
				</section>
			</Modal>
			<VerificationModal
				openModal={openOTPModal && !isCompleteWithdrawalSuccess}
				setOpenModal={setOpenOTPModal}
				notificationChannel={NotificationChannel.EMAIL}
				verificationType={[]}
				verificationFn={(otp) => {
					completeWithdrawal({
						userId,
						otp,
						withdrawalRequestId: initiateWithdrawalData?.withdrawalRequestId ?? "",
					});
				}}
				width="480px"
				title="Verification code"
				isProcessing={isCompleteWithdrawalPending}
			/>

			{isInitiateWithdrawalError && (
				<Toast
					type="error"
					variant="filled"
					title="Withdrawal Error"
					message={initiateWithdrawalError?.message ?? "Something went wrong!"}
					autoVanish
					autoVanishTimeout={5}
				/>
			)}

			{isCompleteWithdrawalSuccess && (
				<Toast
					type="success"
					variant="filled"
					title="Withdrawal Success"
					message={`You have successfully withdrawn ${amount} ${selectedCurrency?.symbol} from your main account`}
					autoVanish
					autoVanishTimeout={5}
				/>
			)}

			{isCompleteWithdrawalError && (
				<Toast
					type="error"
					variant="filled"
					title="Withdrawal Error"
					message={completeWithdrawalError?.message ?? "Something went wrong!"}
					autoVanish
					autoVanishTimeout={5}
				/>
			)}
		</>
	);
};

Withdraw.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Withdraw;
