import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { PaymentCategory, PaymentOperation } from "~/apis/handlers/wallets/enum";
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
import { useInitiateDeposit, useWalletDepositOptions } from "~/hooks/useWallets";

const Deposit = () => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(true);
	const [depositUrlModal, setDepositUrlModal] = useState(false);
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
		console.log("I was called");
		setOpenModal(false);
		setDepositUrlModal(false);
		handleClearDepositData();
		router.back();
	};
	const handleClearDepositData = () => {
		setSelectedCurrency(undefined);
		setSelectedPaymentOption(undefined);
		setSelectedNetwork(undefined);
		setAmount(undefined);
		setDepositWalletInfo(undefined);
	};
	const handleSwitchModal = () => {
		setDepositUrlModal(true);
		setOpenModal(false);
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
			console.log("Deposit URL data:", data);
			setDepositWalletInfo(data);

			// currency: "USDT";
			// customWalletId: "5718e30d-cb6e-4879-bb3d-000a3a87e131";
			// externalWalletId: "c838882d-f757-4c68-b9a6-cabfd7498966";
			// id: "c838882d-f757-4c68-b9a6-cabfd7498966";
			// network: "bnb_smart_chain";
			// payCurrency: "USDT";
			// paymentUri: "0x09aF90b9a733cf8FA9Ed795fa49aDB8A7C960F3E";
			// paymentUrl: "https://hosted-page.minfeesandbox.com/channels/c838882d-f757-4c68-b9a6-cabfd7498966";
			// shouldRedirect: false;
			// walletAddress: "0x09aF90b9a733cf8FA9Ed795fa49aDB8A7C960F3E";

			// 2nd trial
			// amount: 100;
			// createdAt: "2025-04-04T01:28:56+00:00";
			// currency: "USDT";
			// customWalletId: "3ed342ca-232d-43a2-9793-8731a3e6e005";
			// exchangePair: "BTCUSDT";
			// exchangeRate: 85153.0645;
			// expiresAt: "2025-04-04T01:38:56+00:00";
			// externalWalletId: "6b955268-4e72-4c0f-91de-4a81b0994252";
			// id: "6b955268-4e72-4c0f-91de-4a81b0994252";
			// network: "bnb_smart_chain";
			// payAmount: 0.001175;
			// payCurrency: "BTC";
			// paymentUri: "0xbC3fAC880b3fA61351e78D7D5c554eB3340cd12c";
			// paymentUrl: "https://hosted-page.minfeesandbox.com/invoices/6b955268-4e72-4c0f-91de-4a81b0994252";
			// shouldRedirect: false;
			// walletAddress: "0xbC3fAC880b3fA61351e78D7D5c554eB3340cd12c";

			// 3rd trial
			// createdAt: "2025-04-03T22:53:09.272Z"
			// customWalletId: "5718e30d-cb6e-4879-bb3d-000a3a87e131"
			// externalWalletId: "c838882d-f757-4c68-b9a6-cabfd7498966"
			// id: "67ef115564a7c5cd0388831d"
			// isActive: true
			// network: "bnb_smart_chain"
			// paymentCategoryName: "Crypto"
			// paymentMethod: "67d44fffa64c2a2d1fa6f6e4"
			// paymentMethodName: "Tether"
			// paymentProviderName: "CryptoPay"
			// paymentUrl: "https://hosted-page.minfeesandbox.com/channels/c838882d-f757-4c68-b9a6-cabfd7498966"
			// provider: "67d45000a64c2a2d1fa6f6ef"
			// shouldRedirect: false
			// updatedAt: "2025-04-03T22:53:09.272Z"
			// userId: "66e9471fc0fb1b4a83e849e1"
			// walletAddress: "0x09aF90b9a733cf8FA9Ed795fa49aDB8A7C960F3E"

			// Open the deposit URL modal
			handleSwitchModal();
		}
	}, [data, isSuccess]);

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
						<QRCode
							value={depositWalletInfo?.walletAddress ?? ""}
							size={256} // You can adjust the size as needed
							level="H" // Error correction level: L, M, Q, H
							className="bg-white rounded-lg mx-auto"
						/>

						<section className="rounded-xl bg-[#f8f9fc] px-4">
							<section className="space-y-2 py-4 border-b border-[#808080]">
								<p className="text-[#808080] font-normal text-sm">
									Currency to send
								</p>

								<section className="flex items-center space-x-2">
									<Image
										src={
											selectedPaymentOption?.logoUrl ||
											"/images/usdt_round.png"
										}
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
								<p className="text-black font-semibold text-sm">
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
									<p className="break-all text-[#08123B] text-base font-semibold">
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

						<section>
							<h4 className="text-textGray font-medium text-sm">
								⚠️ Important warning
							</h4>
							<p className="text-[#808080] font-normal text-sm mt-3">
								Send only to the specified network address. Sending funds via any
								other network will result in a permanent loss of your assets.
							</p>
						</section>
					</section>
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
