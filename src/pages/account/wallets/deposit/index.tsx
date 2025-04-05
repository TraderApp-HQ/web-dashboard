import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ModalType, PaymentCategory, PaymentOperation } from "~/apis/handlers/wallets/enum";
import {
	IFactoryPaymentProviderDepositResponse,
	IPaymentOptions,
	ISupportedNetworks,
	IWalletSupportedCurrencies,
} from "~/apis/handlers/wallets/interface";
import AccountLayout from "~/components/AccountLayout/Layout";
import TaskViewLoader from "~/components/Loaders/TaskViewLoader";
import Modal from "~/components/Modal";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import Toast from "~/components/common/Toast";
import { CopyIcon2 } from "~/components/icons/CopyIcon";
import { ISelectBoxOption } from "~/components/interfaces";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import useUserProfileData from "~/hooks/useUserProfileData";
import useWalletTransactionCountDownTimer from "~/hooks/useWalletTransactionCountDownTimer";
import { useInitiateDeposit, useWalletDepositOptions } from "~/hooks/useWallets";

const Deposit = () => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(true);
	const [depositUrlModal, setDepositUrlModal] = useState(false);
	const [depositExpiredModal, setDepositExpiredModal] = useState(false);
	const [selectedCurrency, setSelectedCurrency] = useState<
		IWalletSupportedCurrencies | undefined
	>(undefined);
	const [selectedPaymentOption, setSelectedPaymentOption] = useState<IPaymentOptions | undefined>(
		undefined,
	);
	const [selectedNetwork, setSelectedNetwork] = useState<ISupportedNetworks | undefined>(
		undefined,
	);
	const [amount, setAmount] = useState<number | undefined>(undefined);
	const [depositWalletInfo, setDepositWalletInfo] = useState<
		IFactoryPaymentProviderDepositResponse | undefined
	>(undefined);
	const [disableButton, setDisableButton] = useState<boolean>(true);

	// Hooks
	const { userId } = useUserProfileData();
	const { copyMessage, copyToClipboard } = useCopyToClipboard();
	const { timeIsExpired, setTimeIsExpired, timeLeft } = useWalletTransactionCountDownTimer({
		expiresAt: depositWalletInfo?.expiresAt ?? "",
	});

	// Fetch the supported currencies and payment options for deposit
	const { supportedCurrencies, paymentOptions, isLoding, isError, error } =
		useWalletDepositOptions({
			category: PaymentCategory.CRYPTO,
			operation: PaymentOperation.DEPOSIT,
		});

	// Initiate deposit transaction
	const {
		initiateDeposit,
		data,
		isPending,
		isSuccess,
		isError: initiateDepositIsError,
		error: initiateDepositError,
	} = useInitiateDeposit();

	// Handle initiate deposit transaction logic here
	const handleDepositTransaction = () => {
		if (
			userId &&
			selectedCurrency?.id &&
			selectedPaymentOption?.paymentMethodId &&
			selectedPaymentOption?.providerId &&
			selectedNetwork?.name
		) {
			initiateDeposit({
				userId,
				currencyId: selectedCurrency.id,
				paymentMethodId: selectedPaymentOption.paymentMethodId,
				providerId: selectedPaymentOption.providerId,
				network: selectedNetwork.slug,
				amount,
			});
		}
	};

	// Handlers
	const handleSelectCurrency = (currency: ISelectBoxOption) => {
		const selectedCurrency = supportedCurrencies?.find((cur) => cur.id === currency.value);
		setSelectedCurrency(selectedCurrency);
		setSelectedNetwork(undefined); // Reset network when currency changes
	};
	const handleSelectPaymentOption = (option: ISelectBoxOption) => {
		const selectedOption = paymentOptions?.find((opt) => opt.paymentMethodId === option.value);
		setSelectedPaymentOption(selectedOption);
		setSelectedNetwork(undefined); // Reset network when payment option changes
	};
	const handleSelectNetwork = (network: ISelectBoxOption) => {
		const selectedNetwork = selectedPaymentOption?.supportNetworks?.find(
			(net) => net.name === network.value,
		);
		setSelectedNetwork(selectedNetwork);
	};
	const handleChangeAmount = (amount: string) => setAmount(Number(amount));
	const handleModalClose = () => {
		router.back();

		setOpenModal(false);
		setDepositUrlModal(false);
		setDepositExpiredModal(false);
		setTimeIsExpired(false); // Reset time expired state
		handleClearDepositData(); // Clear deposit data when modal is closed
	};
	const handleClearDepositData = () => {
		setSelectedCurrency(undefined);
		setSelectedPaymentOption(undefined);
		setSelectedNetwork(undefined);
		setAmount(undefined);
		setDepositWalletInfo(undefined);
	};
	const handleSwitchModal = (mode: ModalType) => {
		if (mode === ModalType.EXPIRED) {
			setDepositExpiredModal(true);
			setDepositUrlModal(false);
			setOpenModal(false);
			return;
		}

		setDepositUrlModal(true);
		setOpenModal(false);
		setDepositExpiredModal(false);
	};

	// Check if the button should be disabled
	useEffect(() => {
		const isButtonDisabled =
			!selectedCurrency ||
			!selectedPaymentOption ||
			!selectedNetwork ||
			(selectedCurrency?.symbol !== selectedPaymentOption?.symbol &&
				(amount === undefined || amount <= 0));
		setDisableButton(isButtonDisabled);
	}, [selectedCurrency, selectedPaymentOption, selectedNetwork, amount]);

	// Set depoit data to state if deposit is successful
	useEffect(() => {
		if (!isPending && !initiateDepositIsError && isSuccess && data) {
			// Handle wallet deposit URL transaction
			setDepositWalletInfo(data);

			// Open the deposit URL modal
			handleSwitchModal(ModalType.ADDRESS);
		}
	}, [data, isSuccess]);

	// Check if the deposit transaction is expired
	useEffect(() => {
		if (timeIsExpired) {
			handleSwitchModal(ModalType.EXPIRED);
			handleClearDepositData(); // Clear deposit data when time is expired
		}
	}, [timeIsExpired]);

	return (
		<>
			{openModal && (
				<Modal
					openModal={openModal}
					width="md:w-[525px]"
					onClose={handleModalClose}
					title="Make a Deposit"
				>
					{isLoding ? (
						<TaskViewLoader />
					) : !isLoding && isError ? (
						<p className="text-red-300">
							{error?.message ?? "Sorry, an error occured. Try again."}
						</p>
					) : (
						<section className="space-y-5 px-1">
							<SelectBox
								labelText="Currency"
								placeholder="Select a currency"
								isSearchable={false}
								options={(supportedCurrencies ?? [])?.map((currency) => ({
									displayText: currency.symbol,
									value: currency.id,
									imgUrl:
										currency.logoUrl ??
										"https://sandbox-cs-ledger.s3.eu-west-1.amazonaws.com/public/currencies/USDT.svg",
								}))}
								setOption={handleSelectCurrency}
							/>
							<SelectBox
								labelText="Payment Options"
								placeholder="Select a payment option"
								isSearchable={false}
								options={(paymentOptions ?? [])?.map((option) => ({
									displayText: option.symbol,
									value: option.paymentMethodId,
									imgUrl: option.logoUrl,
								}))}
								setOption={handleSelectPaymentOption}
							/>
							<SelectBox
								labelText="Network"
								placeholder="Select network"
								isSearchable={false}
								options={(selectedPaymentOption?.supportNetworks ?? [])?.map(
									(network) => ({
										displayText: network.name,
										value: network.name,
									}),
								)}
								option={{
									displayText: selectedNetwork?.name ?? "Select network",
									value: selectedNetwork?.name ?? "",
								}}
								setOption={handleSelectNetwork}
								fontStyles={`${!selectedNetwork?.name && "text-textGray"}`}
							/>

							{selectedCurrency &&
								selectedPaymentOption &&
								selectedCurrency?.symbol !== selectedPaymentOption?.symbol && (
									<InputField
										type="number"
										labelText="Amount in USDT"
										props={{ name: "amount" }}
										placeholder="Enter Amount you wish to deposit in USDT"
										className="no-spin-buttons"
										value={amount !== undefined ? amount.toString() : ""}
										onChange={handleChangeAmount}
									/>
								)}

							<Button
								labelText="Continue"
								className="w-full tracking-widest"
								isProcessing={isPending}
								onClick={handleDepositTransaction}
								disabled={disableButton || isPending}
							/>
						</section>
					)}
				</Modal>
			)}

			{depositUrlModal && (
				<Modal
					openModal={depositUrlModal}
					width="md:w-[525px]"
					onClose={handleModalClose}
					title="Make a Deposit"
				>
					<section className="space-y-5 px-1">
						<section className="flex flex-col items-center justify-center">
							{depositWalletInfo?.walletAddress && (
								<QRCode
									value={depositWalletInfo?.walletAddress}
									size={256} // You can adjust the size as needed
									level="H" // Error correction level: L, M, Q, H
									className="bg-white p-4 rounded-2xl"
								/>
							)}

							{depositWalletInfo?.amount && depositWalletInfo.currency && (
								<section className="space-y-1 text-center">
									<p className="text-textGray font-semibold text-sm">Amount</p>
									<p className="text-[#102477] font-semibold text-base">
										{`${depositWalletInfo?.amount} ${depositWalletInfo?.currency}`}
									</p>
								</section>
							)}
						</section>

						<section className="rounded-xl bg-[#f8f9fc] px-4 py-2">
							{depositWalletInfo?.payAmount && depositWalletInfo.payCurrency && (
								<section className="space-y-2 py-4 border-b border-[#808080]">
									<p className="text-[#808080] font-normal text-sm">
										Amount to send
									</p>

									<section className="flex items-start justify-between">
										<p className="break-all text-textColor text-sm sm:text-base font-semibold">
											{`${depositWalletInfo?.payAmount} ${depositWalletInfo?.payCurrency}`}
										</p>
										<p
											className="ml-2 cursor-pointer"
											onClick={() =>
												copyToClipboard(
													depositWalletInfo?.payAmount?.toString() ?? "",
												)
											}
										>
											<CopyIcon2 />
										</p>
									</section>
								</section>
							)}
							<section className="space-y-2 py-4 border-b border-[#808080]">
								<p className="text-[#808080] font-normal text-sm">
									Currency to send
								</p>

								<section className="flex items-center space-x-2">
									<Image
										src={selectedPaymentOption?.logoUrl || ""}
										alt="Currency Logo"
										className="w-[30px] h-[30px]"
										width={30}
										height={30}
									/>
									<p className="text-textColor font-semibold text-sm">
										{depositWalletInfo?.payCurrency ??
											selectedPaymentOption?.symbol}
									</p>
								</section>
							</section>
							<section className="space-y-2 py-4 border-b border-[#808080]">
								<p className="text-[#808080] font-normal text-xs">Network</p>
								<p className="text-black font-semibold text-xs sm:text-sm">
									{depositWalletInfo?.network === selectedNetwork?.slug &&
										selectedNetwork?.name}
								</p>
								<p className="text-[#808080] font-normal text-xs">
									Contract Information
								</p>
							</section>

							<section className="space-y-2 py-4">
								<p className="text-[#808080] font-normal text-xs">Deposit ddress</p>
								<section className="flex items-start justify-between">
									<p className="break-all text-textColor text-sm sm:text-base font-semibold">
										{depositWalletInfo?.walletAddress}
									</p>
									<p
										className="ml-2 cursor-pointer"
										onClick={() =>
											copyToClipboard(depositWalletInfo?.walletAddress ?? "")
										}
									>
										<CopyIcon2 />
									</p>
								</section>
							</section>
						</section>

						{depositWalletInfo?.exchangeRate && depositWalletInfo.expiresAt && (
							<section className="py-3 space-y-3 text-textGray font-medium text-xs sm:text-sm">
								<section className="flex items-center justify-between space-x-2">
									<p>Exchange Rate</p>
									<p className="text-[#808080]">{`1 ${depositWalletInfo?.payCurrency} = ${depositWalletInfo?.exchangeRate} ${depositWalletInfo?.currency}`}</p>
								</section>
								<section className="flex items-center justify-between space-x-2">
									<section className="flex items-center space-x-2">
										<p>Rate Expires in</p>
										<Image
											src="/images/questionMarkIcon.svg"
											alt="question icon"
											width={15}
											height={15}
										/>
									</section>

									<p className="text-[#040E37] bg-[#F8F9FC] px-4 py-1 rounded-md">
										{timeLeft}
									</p>
								</section>
							</section>
						)}

						<section className="bg-[#F8F9FC] p-4 rounded-lg">
							<h4 className="text-textGray font-medium text-xs sm:text-sm">
								⚠️ Important warning
							</h4>
							<p className="text-[#808080] font-normal text-xs sm:text-sm mt-3">
								Send only to the specified network address. Sending funds via any
								other network will result in a permanent loss of your assets.
							</p>
						</section>
					</section>
				</Modal>
			)}

			{depositExpiredModal && (
				<Modal
					openModal={depositExpiredModal}
					width="md:w-[525px]"
					onClose={handleModalClose}
					title="Make a Deposit"
				>
					<Image
						src="/images/expired.svg"
						alt="Expired Icon"
						className="mx-auto"
						width={180}
						height={150}
					/>

					<section className="space-y-3 mb-5">
						<section className="bg-[#F8F9FC] px-3 py-6 rounded-2xl text-center">
							<h4 className="text-[#3F3B3B] font-semibold text-sm sm:text-base">
								Wallet Address Expired
							</h4>
							<p className="text-[#6B6868] font-normal text-xs sm:text-sm mt-1">
								Don&apos;t send to the previous address as the rate has expired.{" "}
								<br className="hidden sm:block" />
								Please restart the process to generate a new wallet address.
							</p>
						</section>

						<section className="flex items-center justify-between space-x-2 text-sm sm:text-base">
							<section className="flex items-center space-x-2">
								<p>Rate Expires in</p>
								<Image
									src="/images/questionMarkIcon.svg"
									alt="question icon"
									width={15}
									height={15}
								/>
							</section>

							<p className="text-[#040E37] bg-[#F8F9FC] px-4 py-1 rounded-md">
								{timeLeft}
							</p>
						</section>
					</section>

					<Button
						labelText="Okay"
						className="w-full tracking-widest !py-2"
						onClick={handleModalClose}
					/>
				</Modal>
			)}

			{/* // Copy action success message */}
			{copyMessage && (
				<Toast
					type="success"
					variant="outlined"
					title="Success"
					message={copyMessage}
					autoVanish
				/>
			)}

			{initiateDepositIsError && (
				<Toast
					type="error"
					variant="filled"
					title="Deposit Error"
					message={
						initiateDepositError?.message ??
						"Error initiating deposit! Try again later."
					}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
};

Deposit.getLayout = (page: React.ReactElement) => <AccountLayout>{page}</AccountLayout>;
export default Deposit;
