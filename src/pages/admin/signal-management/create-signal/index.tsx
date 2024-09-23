import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "~/components/common/old/Button";
import PlusIcon from "~/components/icons/PlusIcon";
import UploadButton from "~/components/AccountLayout/UploadButton";
import { useDropzone } from "react-dropzone";
import Modal from "~/components/Modal";
import InputField from "~/components/common/InputField";
import IconButton from "~/components/AccountLayout/IconButton";
import MessageModal from "~/components/Modal/MessageModal";
import SuccessIcon from "~/components/icons/SuccessIcon";
import { convertEnumToOptions, handleKeyDown } from "~/lib/utils";
import SelectBox from "~/components/common/SelectBox";
import type { ICheckedBoxOption, ISelectBoxOption } from "~/components/interfaces";
import CancelIcon from "~/components/icons/CancelIcon";
import { Candlestick, SignalRisk } from "~/apis/handlers/assets/enums";
import type { IExchange, ISignalAsset, ISignalMilestone } from "~/apis/handlers/assets/interfaces";
import Toast from "~/components/common/Toast";
import Checkbox from "~/components/common/CheckBox";
import TextArea from "~/components/common/TextArea";
import useAssets from "~/hooks/useAssets";
import useCurrencies from "~/hooks/useCurrencies";
import useSupportedExchanges from "~/hooks/useSupportedExchanges";
import { useCreateSignal } from "~/hooks/useCreateSignal";

export default function CreateSignal() {
	const [toggleSuccess, setToggleSuccess] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const router = useRouter();

	const [assetOptions, setAssetOptions] = useState<ISelectBoxOption[]>([]);
	const [baseCurrencyOptions, setBaseCurrencyOptions] = useState<ISelectBoxOption[]>([]);
	const [exchangeOptions, setExchangeOptions] = useState<ICheckedBoxOption[]>([]);

	const [selectedAsset, setSelectedAsset] = useState<ISignalAsset>();
	const [selectedBaseCurrency, setSelectedBaseCurrency] = useState<ISignalAsset>();
	const [selectedSupportedExchange, setSelectedSupportedExchange] = useState<IExchange[]>();
	const [signalImage, setSignalImage] = useState("");
	const [targetProfits, setTargetProfits] = useState<ISignalMilestone[]>();
	const [entryPrice, setEntryPrice] = useState<string>();
	const [stopLoss, setStopLoss] = useState<ISignalMilestone>();
	const [selectedCandle, setSelectedCandle] = useState<ISelectBoxOption>();
	const [selectedRisk, setSelectedRisk] = useState<ISelectBoxOption>();
	const [tradeNote, setTradeNote] = useState<string>();

	const [resetSelectedAsset, setResetSelectedAsset] = useState(false);
	const [resetSelectedBaseCurrency, setResetSelectedBaseCurrency] = useState(false);
	const [resetSelectedCandle, setResetSelectedCandle] = useState(false);
	const [resetSelectedRisk, setResetSelectedRisk] = useState(false);

	const {
		data: exchanges,
		isSuccess: isExchangeSuccess,
		isLoading: isExchangeLoading,
	} = useSupportedExchanges({
		coinId: Number(selectedAsset?.id ?? 0),
		currencyId: Number(selectedBaseCurrency?.id ?? 0),
	});

	const {
		data: assets,
		isSuccess: isAssetSuccess,
		isError: isAssetError,
		error: assetError,
		isLoading: isAssetLoading,
	} = useAssets({
		page: 1,
		rowsPerPage: 100,
		orderBy: "asc",
		sortBy: "rank",
	});

	const {
		data: currencies,
		isSuccess: isCurrencySuccess,
		isError: isCurrencyError,
		error: currencyError,
		isLoading: isCurrencyLoading,
	} = useCurrencies();

	useEffect(() => {
		if (isCurrencySuccess && currencies) {
			const baseCurrency: ISelectBoxOption<ISignalAsset>[] = currencies.map((currency) => ({
				displayText: currency.name,
				value: currency.id,
				imgUrl: currency.logo,
				symbol: currency.symbol,
				data: currency,
			}));
			setBaseCurrencyOptions(baseCurrency);
		}
	}, [isCurrencySuccess, currencies]);

	useEffect(() => {
		if (isAssetSuccess && assets) {
			const assetsOptions: ISelectBoxOption<ISignalAsset>[] = assets.map((asset) => ({
				displayText: asset.name,
				value: asset.id,
				imgUrl: asset.logo,
				data: asset,
			}));
			setAssetOptions(assetsOptions);
		}
	}, [isAssetSuccess, assets]);

	useEffect(() => {
		if (isExchangeSuccess && exchanges) {
			const options = exchanges.map((exchange) => ({
				displayText: exchange.name?.toString(),
				value: exchange._id,
				imgUrl: exchange.logo?.toString(),
			}));
			setExchangeOptions(options);
		}
	}, [isExchangeSuccess, exchanges]);

	const handleBaseCurrencyChange = (option: ISelectBoxOption<ISignalAsset>) => {
		setResetSelectedBaseCurrency(false);
		setSelectedBaseCurrency({
			id: option.data?.id ?? "",
			name: option.data?.name ?? "",
			symbol: option.data?.symbol ?? "",
			logo: option.data?.logo ?? "",
		});
	};

	const handleAssetChange = (option: ISelectBoxOption<ISignalAsset>) => {
		setResetSelectedAsset(false);
		setSelectedAsset({
			id: option.data?.id ?? "",
			name: option.data?.name ?? "",
			symbol: option.data?.symbol ?? "",
			logo: option.data?.logo ?? "",
		});
	};

	const handleCandleChange = (option: ISelectBoxOption) => {
		setResetSelectedCandle(false);
		setSelectedCandle(option);
	};

	const handleRiskChange = (option: ISelectBoxOption) => {
		setResetSelectedRisk(false);
		setSelectedRisk(option);
	};

	const handleStopLoss = (value: string) => {
		setStopLoss({
			price: Number(value),
			percent: 1,
			isReached: false,
		});
	};

	const handleExchangeChange = (option: ICheckedBoxOption) => {
		setSelectedSupportedExchange((prev) => {
			// Ensure prev is always an array
			const currentExchanges = prev ?? [];

			// Check if the exchange already exists
			const exists = currentExchanges.some((x) => x._id === option.value);

			// If it exists, remove the exchange
			if (exists) {
				return currentExchanges.filter((x) => x._id !== option.value);
			}

			// If it does not exist, add the new exchange
			return [
				...currentExchanges,
				{
					_id: option.value,
					name: option.displayText,
					logo: option.imgUrl ?? "",
				},
			];
		});
	};

	const handleTradeNote = (value: string) => {
		setTradeNote(value);
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		acceptedFiles.forEach((file) => {
			// Check if the file is an image
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = () => {
					// Convert file to base64 and store it in state
					const base64String = reader.result as string;
					setSignalImage(base64String);
				};

				reader.readAsDataURL(file);
			} else {
				console.log("File is not an image:", file.name);
			}
		});
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const handleSuccessClose = () => {
		setToggleSuccess(false);
	};

	const handleModalClose = () => {
		router.push(".");
		setIsOpen(false);
	};

	// Validation function to check if any state value is empty
	const validCredentials =
		selectedAsset &&
		selectedCandle &&
		signalImage &&
		entryPrice &&
		stopLoss &&
		selectedBaseCurrency &&
		selectedRisk &&
		targetProfits &&
		selectedSupportedExchange &&
		tradeNote;

	const onReset = () => {
		setSignalImage("");
		setTargetProfits(undefined);
		setResetSelectedAsset(true);
		setResetSelectedBaseCurrency(true);
		setResetSelectedCandle(true);
		setEntryPrice(undefined);
		setStopLoss(undefined);
		setSelectedBaseCurrency(undefined);
		setResetSelectedRisk(true);
		setSelectedSupportedExchange(undefined);
		setTradeNote(undefined);
	};

	// Setup query to backend
	const { createSignal, isError, isPending, error, isSuccess, data } = useCreateSignal();

	// Make call to backend
	const handleCreateSignal = () => {
		createSignal({
			asset: Number(selectedAsset?.id ?? 0),
			baseCurrency: Number(selectedBaseCurrency?.id ?? 0),
			targetProfits: targetProfits as ISignalMilestone[],
			stopLoss: stopLoss as ISignalMilestone,
			entryPrice: Number(entryPrice),
			tradeNote: tradeNote as string,
			candlestick: selectedCandle?.value as Candlestick,
			risk: selectedRisk?.value as SignalRisk,
			isSignalTradable: false,
			chart: signalImage.split(",")[1],
			supportedExchanges: selectedSupportedExchange?.map((exchange) =>
				Number(exchange._id),
			) ?? [0],
		});
	};

	// user creation successful. Display success toast
	useEffect(() => {
		if (isSuccess && data) {
			setToggleSuccess(!toggleSuccess);
		}
	}, [isSuccess, data]);

	const handleRemoveTargetProfit = (index: number) => {
		setTargetProfits((prev) => prev?.filter((_, i) => i !== index));
	};

	const handleFirstTargetProfit = (index: number, newValue: number) => {
		setTargetProfits((prevTargetProfits) => {
			if (prevTargetProfits == undefined) {
				return [{ price: newValue, percent: 1, isReached: false }];
			} else {
				return prevTargetProfits?.map((profit, i) =>
					i === index ? { ...profit, price: newValue } : profit,
				);
			}
		});
	};

	const handleValueChange = (index: number, newValue: number) => {
		setTargetProfits((prev) =>
			prev?.map((profit, i) => (i === index ? { ...profit, price: newValue } : profit)),
		);
	};

	const handleEntryPriceChange = (value: string) => {
		setEntryPrice(value);
	};

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[807px]"
				title="Create Signal Form"
				description="System will immediately notify users after upload"
				onClose={handleModalClose}
			>
				<div>
					<div className="flex flex-col gap-y-4">
						<SelectBox
							labelText="Quote Asset"
							isSearchable={true}
							options={assetOptions}
							placeholder={
								isAssetLoading
									? "Loading..."
									: isAssetError
										? `${assetError} `
										: "Select Quote Asset"
							}
							setOption={handleAssetChange}
							clear={resetSelectedAsset}
						/>
						<SelectBox
							labelText="Base Currency"
							isSearchable={true}
							options={baseCurrencyOptions}
							placeholder={
								isCurrencyLoading
									? "Loading..."
									: isCurrencyError
										? `${currencyError}`
										: "Select Base Currency"
							}
							setOption={handleBaseCurrencyChange}
							clear={resetSelectedBaseCurrency}
						/>
						<SelectBox
							labelText="Timeframe/ Candles"
							isSearchable={false}
							options={convertEnumToOptions(Candlestick)}
							placeholder="Select TimeFrame/ Candles"
							setOption={handleCandleChange}
							clear={resetSelectedCandle}
						/>
						<SelectBox
							labelText="Risk Level"
							isSearchable={false}
							options={convertEnumToOptions(SignalRisk)}
							placeholder="Select Risk Level"
							option={selectedRisk}
							setOption={handleRiskChange}
							clear={resetSelectedRisk}
						/>
						<InputField
							type="number"
							labelText="Entry Price"
							props={{ name: "entryPrice", step: "0.01" }}
							placeholder="Input trade entry price"
							value={entryPrice ?? ""}
							onChange={handleEntryPriceChange}
							className="no-spin-buttons"
							onKeyDown={handleKeyDown}
						/>
						<div>
							<InputField
								type="number"
								value={
									targetProfits && targetProfits?.length > 0
										? targetProfits[0]?.price.toString()
										: ""
								}
								labelText="Target Profits"
								onChange={(value) => handleFirstTargetProfit(0, Number(value))}
								props={{ name: "targetProfit", step: "0.01" }}
								placeholder="Enter target profit"
								className="no-spin-buttons my-2"
								onKeyDown={handleKeyDown}
							/>
							{targetProfits?.slice(1).map((profit, index) => (
								<div key={index + 1}>
									<InputField
										type="number"
										value={profit ? profit.price.toString() : ""}
										onChange={(value) =>
											handleValueChange(index + 1, Number(value))
										}
										props={{ name: "targetProfit", step: "0.01" }}
										placeholder="Enter target profit"
										className="no-spin-buttons my-2"
										onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
										icon={{
											name: <CancelIcon />,
											onClick: () => handleRemoveTargetProfit(index + 1),
										}}
									/>
								</div>
							))}

							{targetProfits && targetProfits.length < 4 && (
								<IconButton
									btnClass="text-amber-600 text-xs font-bold leading-none"
									Icon={PlusIcon}
									onClick={() =>
										setTargetProfits(
											(prev) =>
												prev && [
													...prev,
													{ price: 0, percent: 1, isReached: false },
												],
										)
									}
									aria-label="add target profit"
								>
									Add another target profit
								</IconButton>
							)}
						</div>
						<InputField
							type="number"
							labelText="Stop loss"
							props={{ name: "stopLoss" }}
							placeholder="Input trade stop loss"
							value={String(stopLoss?.price) ?? ""}
							onChange={(value: string) => handleStopLoss(value)}
							className="no-spin-buttons"
							onKeyDown={handleKeyDown}
						/>
						<TextArea
							label="Trade Note"
							value={tradeNote ?? ""}
							onChange={handleTradeNote}
							placeholder="Leave a comment"
						/>
						<div>
							<label
								htmlFor="Supported Exchanges"
								className="text-slate-900 text-sm font-normal leading-none"
							>
								Supported Exchanges
							</label>

							{isExchangeLoading ? (
								<p>Loading....</p>
							) : exchangeOptions.length === 0 ? (
								<p className="bg-[#F5F8FE] text-red-500 text-center py-9 px-4 rounded-md">
									Please select currency and asset pairs
								</p>
							) : (
								exchangeOptions.map((exchange) => (
									<Checkbox
										key={exchange.displayText}
										label={exchange.displayText}
										onChange={() => handleExchangeChange(exchange)}
										checked={
											selectedSupportedExchange?.some(
												(x) => x._id === exchange.value,
											) ?? false
										}
										imageUrl={exchange.imgUrl}
										className="bg-[#F5F8FE] py-3 px-4 rounded-md cursor-pointer"
									/>
								))
							)}
						</div>

						<label
							htmlFor="image upload"
							className="text-slate-900 text-sm font-normal leading-none"
						>
							Upload signal image
						</label>
						<UploadButton
							acceptedFiles={signalImage}
							getRootProps={getRootProps}
							getInputProps={getInputProps}
						/>
						<Button
							onClick={handleCreateSignal}
							disabled={!validCredentials || isPending}
							type="submit"
							className="mt-2 flex justify-center"
							innerClassName="px-[20%] py-4 capitalize"
						>
							Create Signal
						</Button>
						<Button
							onClick={onReset}
							type="reset"
							innerClassName="normal-case"
							className="mt-2 flex justify-center"
							color="text-blue-800"
							bgColor="bg-white"
						>
							Reset all signal
						</Button>
					</div>
				</div>
			</Modal>
			{isSuccess && data && (
				<MessageModal
					title={"Successful"}
					description={"You have successfully created a new signal"}
					icon={SuccessIcon}
					openModal={toggleSuccess}
					onClose={handleSuccessClose}
				/>
			)}
			{isError && (
				<Toast
					type="error"
					variant="filled"
					title="Signal Creation Error"
					message={error?.message ?? "Create Signal Error"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
}
