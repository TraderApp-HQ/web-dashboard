import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Modal from "~/components/Modal";
import SelectBox from "~/components/common/SelectBox";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import {
	useCompleteWithdrawal,
	useGetUserWalletsBalance,
	useGetWithdrawalFees,
	useInitiateWithdrawal,
	useSendWithdrawalOtp,
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
import SuccessIcon from "~/components/icons/SuccessIcon";
import { NestedWalletLayout } from "..";

const Withdraw = () => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(true);
	const [openOTPModal, setOpenOTPModal] = useState(false);

	const { userId } = useUserProfileData();

	const [selectedCurrency, setSelectedCurrency] = useState<IWalletSupportedCurrencies>();
	const [selectedNetwork, setSelectedNetwork] = useState<ISupportedNetworks>();
	const [amountInput, setAmountInput] = useState("");
	const [receivingAddress, setReceivingAddress] = useState("");
	const [currentWithdrawalRequestId, setCurrentWithdrawalRequestId] = useState<string>();

	const amountValue = useMemo(() => {
		const parsed = parseFloat(amountInput);
		return Number.isFinite(parsed) ? parsed : 0;
	}, [amountInput]);

	const [debouncedAmountValue, setDebouncedAmountValue] = useState(amountValue);

	const {
		data: walletBalanceData,
		// isError, isLoading, isSuccess, refetch
	} = useGetUserWalletsBalance(WalletType.MAIN);

	const {
		supportedCurrencies,
		paymentOptions,
		// isLoading, isError, isSuccess, error
	} = useWalletDepositOptions({
		category: PaymentCategory.CRYPTO,
		operation: PaymentOperation.WITHDRAWAL,
	});

	const currencyOptions = useMemo(
		() =>
			(supportedCurrencies ?? []).map((currency) => ({
				displayText: currency.symbol,
				value: currency.id,
				imgUrl: currency.logoUrl,
			})),
		[supportedCurrencies],
	);

	const networks = useMemo(() => {
		if (!selectedCurrency) return [];
		const option = paymentOptions?.find(
			(paymentOption) => paymentOption.symbol === selectedCurrency.symbol,
		);
		return option?.supportNetworks ?? [];
	}, [paymentOptions, selectedCurrency]);

	useEffect(() => {
		if (!networks.length) {
			setSelectedNetwork(undefined);
			return;
		}

		if (selectedNetwork && !networks.some((network) => network.name === selectedNetwork.name)) {
			setSelectedNetwork(undefined);
		}
	}, [networks, selectedNetwork]);

	const networkOptions = useMemo(
		() =>
			networks.map((network) => ({
				displayText: network.name,
				value: network.name,
			})),
		[networks],
	);

	const availableCurrencyBalance = useMemo(
		() =>
			walletBalanceData?.wallets.find(
				(wallet) => wallet.currencySymbol === selectedCurrency?.symbol,
			)?.availableBalance ?? 0,
		[selectedCurrency, walletBalanceData],
	);

	const {
		getWithdrawalFees,
		data: withdrawalFees,
		isPending: isWithdrawalFeesPending,
		isError: isWithdrawalFeesError,
		error: withdrawalFeesError,
	} = useGetWithdrawalFees();

	const minWithdrawal = useMemo(() => {
		if (!selectedCurrency) return 0;
		const symbol = selectedCurrency.symbol as keyof typeof WITHDRAWAL_LIMIT.MINIMUM_AMOUNTS;
		return WITHDRAWAL_LIMIT.MINIMUM_AMOUNTS[symbol] ?? 0;
	}, [selectedCurrency]);

	const amountError = useMemo(() => {
		if (!selectedCurrency || amountInput.trim() === "") return "";

		if (debouncedAmountValue < minWithdrawal) {
			return `Amount is below the minimum withdrawal of ${minWithdrawal} ${selectedCurrency.symbol}`;
		}

		if (
			withdrawalFees &&
			(debouncedAmountValue <=
				(withdrawalFees.processingFee || 0) + (withdrawalFees.networkFee || 0) ||
				(withdrawalFees.netAmount || 0) <= 0)
		) {
			return "Amount must exceed the withdrawal fees";
		}

		if (debouncedAmountValue > availableCurrencyBalance) {
			return "Your balance is insufficient to cover the withdrawal amount and total fees";
		}

		if (isWithdrawalFeesError) {
			return withdrawalFeesError?.message || "Failed to calculate withdrawal fees";
		}

		return "";
	}, [
		amountInput,
		debouncedAmountValue,
		minWithdrawal,
		selectedCurrency,
		availableCurrencyBalance,
		withdrawalFees,
		withdrawalFeesError,
		isWithdrawalFeesError,
	]);

	const handleModalClose = () => {
		setOpenModal(false);
		router.back();
	};

	const handleSelectCurrency = useCallback(
		(option: ISelectBoxOption) => {
			const newCurrency = supportedCurrencies?.find(
				(supportedCurrency) => supportedCurrency.id === option.value,
			);
			setSelectedCurrency(newCurrency);
		},
		[supportedCurrencies],
	);

	const handleSelectNetwork = useCallback(
		(option: ISelectBoxOption) => {
			const result = networks.find((network) => network.name === option.value);
			setSelectedNetwork(result);
		},
		[networks],
	);

	const handleAmountChange = useCallback((value: string) => {
		// strip leading zeros before digits, but preserve "0" or "0." for decimals
		const normalizedValue = value.replace(/^0+(?=\d)/, "");
		setAmountInput(normalizedValue);
	}, []);

	const handleReceivingAddressChange = useCallback((address: string) => {
		setReceivingAddress(address);
	}, []);

	const currencySymbol = selectedCurrency?.symbol ?? "USDT";

	const shouldShowFees = withdrawalFees && Boolean(!amountError) && amountValue;

	const isSubmitDisabled =
		!selectedCurrency ||
		!selectedNetwork ||
		!receivingAddress ||
		!withdrawalFees ||
		Boolean(amountError);

	const {
		initiateWithdrawal,
		data: initiateWithdrawalData,
		isPending: isInitiateWithdrawalPending,
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

	const {
		sendWithdrawalOtp,
		data: sendWithdrawalOtpData,
		isSuccess: isSendWithdrawalOtpSuccess,
		isPending: isSendWithdrawalOtpPending,
		isError: isSendWithdrawalOtpError,
		error: sendWithdrawalOtpError,
	} = useSendWithdrawalOtp();

	useEffect(() => {
		if (isInitiateWithdrawalSuccess && initiateWithdrawalData) {
			setOpenOTPModal(true);
			setCurrentWithdrawalRequestId(initiateWithdrawalData.withdrawalRequestId);
		}
	}, [isInitiateWithdrawalSuccess, initiateWithdrawalData]);

	useEffect(() => {
		if (isSendWithdrawalOtpSuccess && sendWithdrawalOtpData?.withdrawalRequestId) {
			setCurrentWithdrawalRequestId(sendWithdrawalOtpData.withdrawalRequestId);
		}
	}, [isSendWithdrawalOtpSuccess, sendWithdrawalOtpData]);

	useEffect(() => {
		if (isCompleteWithdrawalSuccess) {
			setOpenOTPModal(false);
		}
	}, [isCompleteWithdrawalSuccess]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedAmountValue(amountValue);
		}, 1000);

		return () => clearTimeout(timer);
	}, [amountValue]);

	useEffect(() => {
		if (debouncedAmountValue && selectedNetwork && selectedCurrency && paymentOptions?.length) {
			const paymentOption = paymentOptions?.find(
				(option) => option.symbol === selectedCurrency.symbol,
			);

			getWithdrawalFees({
				amount: debouncedAmountValue,
				paymentMethodId: paymentOption?.paymentMethodId ?? "",
				providerId: paymentOption?.providerId ?? "",
				network: selectedNetwork.slug,
			});
		}
	}, [debouncedAmountValue, selectedNetwork, selectedCurrency, paymentOptions]);

	const handleWithdraw = useCallback(() => {
		if (
			!userId ||
			!selectedCurrency ||
			!selectedNetwork ||
			!receivingAddress ||
			!withdrawalFees
		) {
			return;
		}

		const paymentOption = paymentOptions?.find(
			(option) => option.symbol === selectedCurrency.symbol,
		);

		initiateWithdrawal({
			userId,
			currencyId: selectedCurrency.id,
			paymentMethodId: paymentOption?.paymentMethodId ?? "",
			providerId: paymentOption?.providerId ?? "",
			network: selectedNetwork.slug,
			amount: amountValue,
			amountToReceive: withdrawalFees.netAmount,
			destinationAddress: receivingAddress,
			networkFee: withdrawalFees.networkFee,
			processingFee: withdrawalFees.processingFee,
		});
	}, [
		userId,
		selectedCurrency,
		selectedNetwork,
		receivingAddress,
		withdrawalFees,
		paymentOptions,
		initiateWithdrawal,
		amountValue,
	]);

	const handleCompleteWithdrawal = useCallback(
		(otp: string) => {
			if (!userId || !currentWithdrawalRequestId) return;

			completeWithdrawal({
				userId,
				otp,
				withdrawalRequestId: currentWithdrawalRequestId,
			});
		},
		[completeWithdrawal, currentWithdrawalRequestId, userId],
	);

	const handleResendOtp = useCallback(() => {
		if (!userId || !currentWithdrawalRequestId) return;

		sendWithdrawalOtp({
			userId,
			withdrawalRequestId: currentWithdrawalRequestId,
		});
	}, [currentWithdrawalRequestId, sendWithdrawalOtp, userId]);

	const shouldShowSuccessModal = isCompleteWithdrawalSuccess && !openOTPModal;

	return (
		<>
			{shouldShowSuccessModal ? (
				<Modal
					openModal
					onClose={() => {
						setOpenModal(false);
						router.back();
					}}
					width="md:w-[539px]"
				>
					<div className="flex flex-col items-center gap-5 text-center">
						<div className="inline-flex flex-col justify-center items-center gap-3">
							<SuccessIcon backgroundColor="#ECFDF5" tickColor="#047857" />
							<div className="justify-start text-blue-900 text-2xl font-semibold leading-9">
								Successful
							</div>
							<div className="w-80 text-center justify-start text-gray-700 text-sm font-medium">
								{`You have successfully withdrawn ${amountValue.toLocaleString(
									"en-US",
									{ maximumFractionDigits: 8 },
								)} ${currencySymbol} from your main account.`}
							</div>
						</div>
						<Button
							labelText="Continue"
							onClick={() => {
								setOpenModal(false);
								router.back();
							}}
							className="w-full"
						/>
					</div>
				</Modal>
			) : (
				<Modal
					openModal={openModal}
					width="md:w-[525px]"
					title="Withdraw crypto"
					onClose={handleModalClose}
					closeOnOutsideClick={!openOTPModal}
				>
					<section className="space-y-5 px-1">
						<SelectBox
							labelText="Currency"
							placeholder="Select Currency"
							isSearchable={false}
							options={currencyOptions}
							option={{
								displayText: selectedCurrency?.symbol ?? "",
								value: selectedCurrency?.id ?? "",
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
									className="w-full py-4 bg-[#F5F8FE] rounded-lg text-[0.9375rem]"
									onChange={handleReceivingAddressChange}
									value={receivingAddress}
								/>
							</div>
						</div>

						<SelectBox
							labelText="Network"
							placeholder="Select Network"
							isSearchable={false}
							options={networkOptions}
							option={{
								displayText: selectedNetwork?.name ?? "",
								value: selectedNetwork?.name ?? "",
							}}
							setOption={handleSelectNetwork}
							clear={!selectedNetwork}
						/>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="amount"
									className="text-textColor text-sm font-medium"
								>
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
									onChange={handleAmountChange}
									value={amountInput}
								/>
								<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-900 font-semibold">
									{currencySymbol}
								</div>
							</div>
							<p
								className={`mt-2 text-xs text-red-600 ${amountError ? "" : "invisible"}`}
							>
								{amountError || "\u00A0"}
							</p>
						</div>

						{isWithdrawalFeesPending && !amountError ? (
							<div
								className="bg-[#F5F8FE] rounded-lg p-4 flex items-center justify-center"
								aria-live="polite"
							>
								<div className="flex items-center gap-2">
									<span
										aria-label="Calculating fees"
										className="inline-block h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
									/>
									<span className="text-zinc-600 text-sm">
										Calculating fees...
									</span>
								</div>
							</div>
						) : shouldShowFees ? (
							<div className="bg-[#F5F8FE] rounded-lg p-4 space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-zinc-500 text-sm">Processing Fees</span>
									<span className="text-slate-900 text-base font-medium">
										{withdrawalFees.processingFee.toLocaleString("en-US", {
											maximumFractionDigits: 2,
											minimumFractionDigits: 2,
										})}{" "}
										{currencySymbol}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-zinc-500 text-sm">Network Fees</span>
									<span className="text-slate-900 text-base font-medium">
										{withdrawalFees.networkFee.toLocaleString("en-US", {
											maximumFractionDigits: 6,
											minimumFractionDigits: 2,
										})}{" "}
										{currencySymbol}
									</span>
								</div>
								<div className="border-t border-[#E5E7EB] pt-3 mt-3"></div>
								<div className="flex justify-between items-center">
									<span className="text-slate-900 text-sm">
										Amount To Receive
									</span>
									<span className="text-slate-900 text-base font-medium">
										{withdrawalFees.netAmount.toLocaleString("en-US", {
											maximumFractionDigits: 2,
											minimumFractionDigits: 2,
										})}{" "}
										{currencySymbol}
									</span>
								</div>
							</div>
						) : null}

						<Button
							labelText="Withdraw"
							className="w-full tracking-widest"
							isProcessing={isInitiateWithdrawalPending}
							onClick={handleWithdraw}
							disabled={isSubmitDisabled}
						/>
					</section>
				</Modal>
			)}
			<VerificationModal
				openModal={openOTPModal && !isCompleteWithdrawalSuccess}
				setOpenModal={setOpenOTPModal}
				notificationChannel={NotificationChannel.EMAIL}
				verificationType={[]}
				verificationFn={handleCompleteWithdrawal}
				width="480px"
				title="Verification code"
				isProcessing={isCompleteWithdrawalPending}
				resendOtpFn={handleResendOtp}
				isSendOtpSuccessProp={isSendWithdrawalOtpSuccess}
				isResendPending={isSendWithdrawalOtpPending}
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

			{isSendWithdrawalOtpError && (
				<Toast
					type="error"
					variant="filled"
					title="Withdrawal Error"
					message={sendWithdrawalOtpError?.message ?? "Something went wrong!"}
					autoVanish
					autoVanishTimeout={5}
				/>
			)}
		</>
	);
};

Withdraw.getLayout = (page: React.ReactElement) => <NestedWalletLayout>{page}</NestedWalletLayout>;
export default Withdraw;
