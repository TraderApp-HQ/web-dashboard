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

const Withdraw = () => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(true);
	const [openOTPModal, setOpenOTPModal] = useState(false);

	const { userId } = useUserProfileData();

	// TODO: fetch processing fee and network fee from server
	// and update hardcoded "USDT" currency to use {selectedCurrency?.symbol}
	// const oldProcessingFee = 2;
	// const networkFee = 1;

	const [selectedCurrency, setSelectedCurrency] = useState<
		IWalletSupportedCurrencies | undefined
	>(undefined);
	const [networks, setNetworks] = useState<ISupportedNetworks[] | undefined>([]);
	const [selectedNetwork, setSelectedNetwork] = useState<ISupportedNetworks | undefined>(
		undefined,
	);
	const [amount, setAmount] = useState<number | undefined>(undefined);
	const [amountToReceive, setAmountToReceive] = useState<number>(0);
	const [receivingAddress, setReceivingAddress] = useState("");
	const [currentWithdrawalRequestId, setCurrentWithdrawalRequestId] = useState<
		string | undefined
	>(undefined);

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

	const processingFee = useMemo(() => {
		if (!amount) return 0;
		const res = Math.max(0.003 * amount, 5);
		return res;
	}, [amount]);

	console.log({ processingFee });

	const amountError = useMemo(() => {
		if (amount === undefined || !selectedCurrency) return "";

		// const totalFees = processingFee + networkFee;
		const networkFee = Number(selectedNetwork?.fees?.average ?? 0);
		const totalFees = processingFee + networkFee;
		const minWithdrawal =
			WITHDRAWAL_LIMIT.MINIMUM_AMOUNTS[
				selectedCurrency.symbol as keyof typeof WITHDRAWAL_LIMIT.MINIMUM_AMOUNTS
			];

		if (amount < minWithdrawal) {
			return `Amount is below the minimum withdrawal of ${minWithdrawal} ${selectedCurrency.symbol}`;
		}

		if (amount <= totalFees || amountToReceive <= 0) {
			return `Amount must be greater than total fees`;
		}
		console.log({ amount, minWithdrawal });

		// if (amount < minWithdrawal) {
		// 	return `Amount is below the minimum withdrawal of ${minWithdrawal} ${selectedCurrency.symbol}`;
		// }

		if (amount > availableCurrencyBalance) {
			return "Your balance is insufficient to cover the withdrawal amount and total fees";
		}

		return "";
	}, [
		amount,
		amountToReceive,
		selectedCurrency,
		availableCurrencyBalance,
		processingFee,
		selectedNetwork,
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

	console.log({ paymentOptions });

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

	const {
		sendWithdrawalOtp,
		data: sendWithdrawalOtpData,
		isSuccess: isSendWithdrawalOtpSuccess,
		isPending: isSendWithdrawalOtpPending,
		isError: isSendWithdrawalOtpError,
		error: sendWithdrawalOtpError,
	} = useSendWithdrawalOtp();

	useEffect(() => {
		const networkFee = Number(selectedNetwork?.fees?.average ?? 0);
		const res = Number(Math.max((amount ?? 0) - (processingFee + networkFee), 0));
		setAmountToReceive(res);
	}, [amount, selectedNetwork]);

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

	return (
		<>
			{/* Conditional Modal: Show success modal if withdrawal is successful, otherwise show withdrawal form */}
			{isCompleteWithdrawalSuccess && !openOTPModal ? (
				<Modal
					openModal={true}
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
								{`You have successfully withdrawn ${amount} ${selectedCurrency?.symbol} from your main account.`}
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
									className="w-full py-4 bg-[#F5F8FE] rounded-lg text-[0.9375rem]"
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

						{selectedNetwork?.fees?.average && !!processingFee && !amountError && (
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
										{/* {selectedNetwork?.fees.toLocaleString("en-US", {
											maximumFractionDigits: 2,
											minimumFractionDigits: 2,
										})}{" "} */}
										{selectedNetwork.fees.average} USDT
									</span>
								</div>

								<div className="border-t border-[#E5E7EB] pt-3 mt-3"></div>

								<div className="flex justify-between items-center">
									<span className="text-slate-900 text-sm">
										Amount To Receive
									</span>
									<span className="text-slate-900 text-base font-medium">
										{amountToReceive.toLocaleString("en-US", {
											maximumFractionDigits: 2,
											minimumFractionDigits: 2,
										})}{" "}
										USDT
									</span>
								</div>
							</div>
						)}

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
									(paymentOption) =>
										paymentOption.symbol === selectedCurrency.symbol,
								);
								initiateWithdrawal({
									userId,
									currencyId: selectedCurrency.id,
									paymentMethodId: paymentOption?.paymentMethodId ?? "",
									providerId: paymentOption?.providerId ?? "",
									network: selectedNetwork.slug,
									amount: amount ?? 0,
									amountToReceive,
									destinationAddress: receivingAddress,
								});
							}}
							disabled={
								!selectedCurrency ||
								!selectedNetwork ||
								!receivingAddress ||
								amountToReceive <= 0 ||
								!!amountError
							}
						/>
					</section>
				</Modal>
			)}
			<VerificationModal
				openModal={openOTPModal && !isCompleteWithdrawalSuccess}
				setOpenModal={setOpenOTPModal}
				notificationChannel={NotificationChannel.EMAIL}
				verificationType={[]}
				verificationFn={(otp) => {
					completeWithdrawal({
						userId,
						otp,
						withdrawalRequestId: currentWithdrawalRequestId ?? "",
					});
				}}
				width="480px"
				title="Verification code"
				isProcessing={isCompleteWithdrawalPending}
				resendOtpFn={() =>
					sendWithdrawalOtp({
						userId,
						withdrawalRequestId: currentWithdrawalRequestId ?? "",
					})
				}
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

Withdraw.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Withdraw;
