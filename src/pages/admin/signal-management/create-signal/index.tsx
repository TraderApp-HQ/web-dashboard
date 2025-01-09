import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Candlestick, SignalRisk } from "~/apis/handlers/assets/enums";
import type { IExchange, ISignalAsset, ISignalMilestone } from "~/apis/handlers/assets/interfaces";
import IconButton from "~/components/AccountLayout/IconButton";
import UploadButton from "~/components/AccountLayout/UploadButton";
import AdminLayout from "~/components/AdminLayout/Layout";
import Modal from "~/components/Modal";
import Checkbox from "~/components/common/CheckBox";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import TextArea from "~/components/common/TextArea";
import Toast from "~/components/common/Toast";
import Button from "~/components/common/old/Button";
import BackBtnIcon from "~/components/icons/BackBtnIcon";
import CancelIcon from "~/components/icons/CancelIcon";
import PlusIcon from "~/components/icons/PlusIcon";
import type { ICheckedBoxOption, ISelectBoxOption } from "~/components/interfaces";
import { Category, TradeSide, TradeSignalModalScreen, TradeType } from "~/config/enum";
import useGetAssets from "~/hooks/useAssets";
import { useCreateSignal } from "~/hooks/useCreateSignal";
import useCurrencies from "~/hooks/useCurrencies";
import useSupportedExchanges from "~/hooks/useSupportedExchanges";
import { convertEnumToOptions, handleKeyDown } from "~/lib/utils";

function CreateSignal() {
	const router = useRouter();

	// Modal state handler
	const [isModalOpen, setIsModalOpen] = useState({
		tradeAsset: true,
		tradeType: false,
		tradePrice: false,
		tradeChart: false,
	});

	const [assetOptions, setAssetOptions] = useState<ISelectBoxOption[]>([]);
	const [baseCurrencyOptions, setBaseCurrencyOptions] = useState<ISelectBoxOption[]>([]);
	const [exchangeOptions, setExchangeOptions] = useState<ICheckedBoxOption[]>([]);

	const [assetCategory, setAssetCategory] = useState<ISelectBoxOption>();
	const [tradeType, setTradeType] = useState<TradeType>();
	const [tradeSide, setTradeSide] = useState<TradeSide>();
	const [selectedAsset, setSelectedAsset] = useState<ISignalAsset>();
	const [selectedBaseCurrency, setSelectedBaseCurrency] = useState<ISignalAsset>();
	const [selectedSupportedExchange, setSelectedSupportedExchange] = useState<IExchange[]>();
	const [entryPrice, setEntryPrice] = useState<string>();
	const [stopLoss, setStopLoss] = useState<ISignalMilestone>();
	const [leverage, setLeverage] = useState<number>();
	const [targetProfits, setTargetProfits] = useState<ISignalMilestone[]>();
	const [selectedCandle, setSelectedCandle] = useState<ISelectBoxOption>();
	const [selectedRisk, setSelectedRisk] = useState<ISelectBoxOption>();
	const [tradeNote, setTradeNote] = useState<string>();
	const [signalImage, setSignalImage] = useState("");

	const [resetSelectedAsset, setResetSelectedAsset] = useState(false);
	const [resetSelectedBaseCurrency, setResetSelectedBaseCurrency] = useState(false);
	const [resetSelectedCandle, setResetSelectedCandle] = useState(false);
	const [resetSelectedRisk, setResetSelectedRisk] = useState(false);

	// ================= Handlers ==============================

	// close create signal modals handler
	const handleModalClose = () => {
		router.push(".");
		setIsModalOpen({
			tradeAsset: false,
			tradeType: false,
			tradePrice: false,
			tradeChart: false,
		});
	};

	// handle modal change
	const handleModalChange = (modal: TradeSignalModalScreen) => {
		const updateState = {
			tradeAsset: modal === TradeSignalModalScreen.TRADE_ASSET,
			tradeType: modal === TradeSignalModalScreen.TRADE_TYPE,
			tradePrice: modal === TradeSignalModalScreen.TRADE_PRICE,
			tradeChart: modal === TradeSignalModalScreen.TRADE_CHART,
		};

		setIsModalOpen(updateState);
	};

	// ================ Validation function ====================
	// Validation function to check if any state value is empty
	const assetModalButton =
		assetCategory &&
		selectedAsset &&
		selectedBaseCurrency &&
		selectedSupportedExchange &&
		selectedSupportedExchange.length > 0;

	const tradeTypeModalButton =
		tradeType === TradeType.SPOT || (tradeType === TradeType.FUTURES && tradeSide);

	const tradePriceModalButton =
		entryPrice &&
		stopLoss &&
		leverage &&
		targetProfits &&
		targetProfits[0].price !== 0 &&
		targetProfits?.length === 4;

	const validCredentials =
		assetModalButton &&
		tradeTypeModalButton &&
		tradePriceModalButton &&
		selectedCandle &&
		selectedRisk &&
		signalImage &&
		tradeNote;

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
	} = useGetAssets({
		category: assetCategory?.value as Category,
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
		const entryValue = Number(entryPrice);
		const stopValue = Number(value);
		const stopPercentage = Math.round(((stopValue - entryValue) / entryValue) * 100);
		setStopLoss({
			price: stopValue,
			percent: stopPercentage,
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
		setSelectedAsset(undefined);
	};

	// Setup query to backend
	const { createSignal, isError, isPending, error, isSuccess, data } = useCreateSignal();

	// Make call to backend
	const handleCreateSignal = () => {
		createSignal({
			asset: Number(selectedAsset?.id ?? 0),
			assetName: selectedAsset?.symbol as string,
			baseCurrency: Number(selectedBaseCurrency?.id ?? 0),
			baseCurrencyName: selectedBaseCurrency?.symbol as string,
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
			category: assetCategory?.value as Category,
			tradeType: tradeType,
			tradeSide: tradeSide,
			leverage: leverage,
		});
	};

	// Close signal modal after successful signal creation.
	useEffect(() => {
		if (isSuccess && data) {
			router.push(`/admin/signal-management/active?signal=${isSuccess}`);
			setIsModalOpen({
				tradeAsset: false,
				tradeType: false,
				tradePrice: false,
				tradeChart: false,
			});
		}
	}, [isSuccess, data]);

	// Resets asset when category is changed
	useEffect(() => onReset(), [assetCategory]);

	const handleRemoveTargetProfit = (index: number) => {
		setTargetProfits((prev) => prev?.filter((_, i) => i !== index));
	};

	const handleFirstTargetProfit = (index: number, newValue: number) => {
		const entryValue = Number(entryPrice);
		const ftpPercentage = Math.round(((newValue - entryValue) / entryValue) * 100);

		setTargetProfits((prevTargetProfits) => {
			if (prevTargetProfits == undefined) {
				return [{ price: newValue, percent: ftpPercentage, isReached: false }];
			} else {
				return prevTargetProfits?.map((profit, i) =>
					i === index ? { ...profit, price: newValue, percent: ftpPercentage } : profit,
				);
			}
		});
	};

	const handleValueChange = (index: number, newValue: number) => {
		const entryValue = Number(entryPrice);
		const ftpPercentage = Math.round(((newValue - entryValue) / entryValue) * 100);
		setTargetProfits((prev) =>
			prev?.map((profit, i) =>
				i === index ? { ...profit, price: newValue, percent: ftpPercentage } : profit,
			),
		);
	};

	const handleEntryPriceChange = (value: string) => {
		setEntryPrice(value);
	};

	return (
		<>
			{/* Asset Category Modal */}
			{isModalOpen.tradeAsset && (
				<Modal
					openModal={isModalOpen.tradeAsset}
					title={
						<p
							data-testid="create-new-signal-form"
							className="font-bold text-lg md:text-2xl text-textColor"
						>
							Select Asset Pair
						</p>
					}
					headerDivider={true}
					onClose={handleModalClose}
				>
					<section className="flex flex-col gap-y-4 pt-4">
						<SelectBox
							labelText="Category"
							isSearchable={false}
							options={[
								{ displayText: Category.FOREX, value: Category.FOREX },
								{ displayText: Category.CRYPTO, value: Category.CRYPTO },
							]}
							placeholder={"Select Asset Category"}
							option={assetCategory}
							setOption={(opt) => {
								setAssetOptions([]);
								setAssetCategory(opt);
							}}
						/>

						<SelectBox
							labelText="Quote Asset"
							isSearchable={true}
							options={assetOptions}
							placeholder={
								isAssetLoading
									? "Loading..."
									: isAssetError
										? `${assetError} `
										: assets?.length === 0
											? "No asset found"
											: "Select Quote Asset"
							}
							option={assetOptions.find(
								(opt) => opt.displayText === selectedAsset?.name,
							)}
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
							option={baseCurrencyOptions.find(
								(opt) => opt.displayText === selectedBaseCurrency?.name,
							)}
							setOption={handleBaseCurrencyChange}
							clear={resetSelectedBaseCurrency}
						/>

						<div>
							<label
								htmlFor="Supported Exchanges"
								className="text-textColor text-sm font-normal leading-none"
							>
								Choose Trading Platforms
							</label>

							{isExchangeLoading ? (
								<p>Loading....</p>
							) : exchangeOptions.length === 0 ? (
								<p className="bg-[#F5F8FE] text-red-500 text-center py-9 px-4 rounded-md">
									Please select asset and base currency.
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

						<Button
							onClick={() =>
								handleModalChange(
									assetCategory?.value === Category.CRYPTO
										? TradeSignalModalScreen.TRADE_TYPE
										: TradeSignalModalScreen.TRADE_PRICE,
								)
							}
							disabled={!assetModalButton}
							type="submit"
							className="mt-2 flex justify-center"
							innerClassName="px-[20%] py-4 capitalize"
						>
							Continue
						</Button>
					</section>
				</Modal>
			)}

			{/* Asset Trade Type Modal */}
			{isModalOpen.tradeType && (
				<Modal
					openModal={isModalOpen.tradeType}
					title={
						<p
							data-testid="create-new-signal-form"
							className="font-bold text-lg md:text-2xl text-textColor flex items-center"
						>
							<span
								className="mr-4"
								onClick={() =>
									handleModalChange(TradeSignalModalScreen.TRADE_ASSET)
								}
							>
								{" "}
								<BackBtnIcon />
							</span>{" "}
							Set Trade Type
						</p>
					}
					headerDivider={true}
					onClose={handleModalClose}
				>
					<section className="flex flex-col gap-y-5 pt-3">
						<SelectBox
							labelText="Trade Type"
							isSearchable={false}
							options={[
								{ displayText: TradeType.SPOT, value: TradeType.SPOT },
								{ displayText: TradeType.FUTURES, value: TradeType.FUTURES },
							]}
							placeholder="Select trade type"
							option={{
								displayText: tradeType as string,
								value: tradeType as string,
							}}
							setOption={(opt) => setTradeType(opt.value as TradeType)}
						/>

						{tradeType === TradeType.FUTURES && (
							<SelectBox
								labelText="Trade Side"
								isSearchable={false}
								options={[
									{ displayText: TradeSide.LONG, value: TradeSide.LONG },
									{ displayText: TradeSide.SHORT, value: TradeSide.SHORT },
								]}
								placeholder="Select trade side"
								option={{
									displayText: tradeSide as string,
									value: tradeSide as string,
								}}
								setOption={(opt) => setTradeSide(opt.value as TradeSide)}
							/>
						)}

						<Button
							onClick={() => handleModalChange(TradeSignalModalScreen.TRADE_PRICE)}
							disabled={!tradeTypeModalButton}
							type="submit"
							className="flex justify-center"
							innerClassName="px-[20%] py-4 capitalize"
						>
							Continue
						</Button>
					</section>
				</Modal>
			)}

			{/* Asset Trade Prices Modal */}
			{isModalOpen.tradePrice && (
				<Modal
					openModal={isModalOpen.tradePrice}
					title={
						<p
							data-testid="create-new-signal-form"
							className="font-bold text-lg md:text-2xl text-textColor flex items-center"
						>
							<span
								className="mr-4"
								onClick={() =>
									handleModalChange(
										assetCategory?.value === Category.CRYPTO
											? TradeSignalModalScreen.TRADE_TYPE
											: TradeSignalModalScreen.TRADE_ASSET,
									)
								}
							>
								{" "}
								<BackBtnIcon />
							</span>{" "}
							Set Prices
						</p>
					}
					headerDivider={true}
					onClose={handleModalClose}
				>
					<section className="flex flex-col gap-y-4 pt-4 px-2">
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

						<InputField
							type="number"
							labelText="Stop loss"
							props={{ name: "stopLoss" }}
							placeholder="Input trade stop loss"
							value={String(stopLoss?.price) ?? ""}
							onChange={(value: string) => handleStopLoss(value)}
							className="no-spin-buttons disabled:cursor-not-allowed"
							onKeyDown={handleKeyDown}
							disable={!Number(entryPrice)}
						/>

						<InputField
							type="number"
							labelText="Leverage"
							props={{ name: "leverage" }}
							placeholder="Input trade leverage"
							value={String(leverage) ?? ""}
							onChange={(value: string) => setLeverage(+value)}
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
								className="no-spin-buttons my-2 disabled:cursor-not-allowed"
								onKeyDown={handleKeyDown}
								disable={!Number(entryPrice)}
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
									Add another target profit (Target profit must be 4)
								</IconButton>
							)}
						</div>

						<Button
							onClick={() => handleModalChange(TradeSignalModalScreen.TRADE_CHART)}
							disabled={!tradePriceModalButton}
							type="submit"
							className="mt-2 flex justify-center"
							innerClassName="px-[20%] py-4 capitalize"
						>
							Continue
						</Button>
					</section>
				</Modal>
			)}

			{/* Asset Trade Chart Modal */}
			{isModalOpen.tradeChart && (
				<Modal
					openModal={isModalOpen.tradeChart}
					title={
						<p
							data-testid="create-new-signal-form"
							className="font-bold text-lg md:text-2xl text-textColor flex items-center"
						>
							<span
								className="mr-4"
								onClick={() =>
									handleModalChange(TradeSignalModalScreen.TRADE_PRICE)
								}
							>
								{" "}
								<BackBtnIcon />
							</span>{" "}
							Finish Creating Signal
						</p>
					}
					headerDivider={true}
					onClose={handleModalClose}
				>
					<section className="flex flex-col gap-y-4 pt-4">
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

						<TextArea
							label="Trade Note"
							value={tradeNote ?? ""}
							onChange={handleTradeNote}
							placeholder="Leave a comment"
						/>

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
							{isPending ? "Creating Signal..." : "Create Signal"}
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
					</section>
				</Modal>
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

CreateSignal.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default CreateSignal;
