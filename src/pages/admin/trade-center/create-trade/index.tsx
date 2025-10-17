import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaArrowsRotate } from "react-icons/fa6";
import { Candlestick, SignalRisk } from "~/apis/handlers/assets/enums";
import type { ISignalAsset, ITradingPlatform } from "~/apis/handlers/assets/interfaces";
import UploadButton from "~/components/AccountLayout/UploadButton";
import Modal from "~/components/Modal";
import Checkbox from "~/components/common/CheckBox";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import TextArea from "~/components/common/TextArea";
import Toast from "~/components/common/Toast";
import Button from "~/components/common/old/Button";
import BackBtnIcon from "~/components/icons/BackBtnIcon";
import type { ICheckedBoxOption, ISelectBoxOption } from "~/components/interfaces";
import { AccountType, Category, TradeSide, TradeSignalModalScreen, TradeType } from "~/config/enum";
import { getSignalPriceInputValidationMessage, renderDisplayItem, renderStatus } from "~/helpers";
import useGetAssetCurrentPrice from "~/hooks/useAssetCurrentPrice";
import useGetAssets from "~/hooks/useAssets";
import useCurrencies from "~/hooks/useCurrencies";
import useSupportedTradingPlatforms from "~/hooks/useSupportedTradingPlatforms";
import { convertEnumToOptions, handleKeyDown } from "~/lib/utils";
import { AdminNestedTradeCenterLayout } from "..";
import { useCreateTrade } from "~/hooks/useTrades";
import {
	MasterTradeStatus,
	OrderPlacementType,
	TradingPlatform,
} from "~/apis/handlers/trading-engine/enums";

function CreateTrade() {
	const router = useRouter();

	// Modal state handler
	const [isModalOpen, setIsModalOpen] = useState({
		tradeAsset: true,
		tradeType: false,
		tradePrice: false,
		tradeChart: false,
	});

	const [baseAssetOptions, setBaseAssetOptions] = useState<ISelectBoxOption[]>([]);
	const [quoteCurrencyOptions, setQuoteCurrencyOptions] = useState<ISelectBoxOption[]>([]);
	const [tradingPlatformOptions, setTradingPlatformOptions] = useState<ICheckedBoxOption[]>([]);

	const [assetCategory, setAssetCategory] = useState<ISelectBoxOption>();
	const [tradeType, setTradeType] = useState<TradeType>(TradeType.FUTURES); // Defaults to futures
	const [tradeSide, setTradeSide] = useState<TradeSide>();
	const [selectedBaseAsset, setSelectedBaseAsset] = useState<ISignalAsset>();
	const [selectedQuoteCurrency, setSelectedQuoteCurrency] = useState<ISignalAsset>();
	const [selectedSupportedTradingPlatform, setSelectedSupportedTradingPlatform] =
		useState<ITradingPlatform[]>();
	const [ordersTriggerPrice, setOrdersTriggerPrice] = useState<number>();
	const [maxOrders, setMaxOrders] = useState<number>(100000000); // Temporary default for btc
	const [entryPrice, setEntryPrice] = useState<number>();
	const [stopLoss, setStopLoss] = useState<number>();
	const [targetProfit, setTargetProfit] = useState<number>();
	const [selectedCandle, setSelectedCandle] = useState<ISelectBoxOption>();
	const [selectedRisk, setSelectedRisk] = useState<ISelectBoxOption>();
	const [tradeNote, setTradeNote] = useState<string>();
	const [signalImage, setSignalImage] = useState("");
	const [selectedAssetCurrentPrice, setSelectedAssetCurrentPrice] = useState<number>();

	const [resetSelectedBaseAsset, setResetSelectedBaseAsset] = useState(false);
	const [resetSelectedQuoteCurrency, setResetSelectedQuoteCurrency] = useState(false);
	const [resetSelectedCandle, setResetSelectedCandle] = useState(false);
	const [resetSelectedRisk, setResetSelectedRisk] = useState(false);

	// ================= Handlers ==============================

	// close create trade modals handler
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
		selectedBaseAsset &&
		selectedQuoteCurrency &&
		selectedSupportedTradingPlatform &&
		selectedSupportedTradingPlatform.length > 0;

	const tradeTypeModalButton =
		tradeType === TradeType.SPOT || (tradeType === TradeType.FUTURES && tradeSide);

	const tradePriceModalButton =
		selectedAssetCurrentPrice &&
		entryPrice &&
		ordersTriggerPrice &&
		maxOrders &&
		stopLoss &&
		targetProfit &&
		targetProfit !== 0 &&
		(tradeSide === TradeSide.LONG
			? stopLoss < entryPrice && targetProfit > entryPrice
			: stopLoss > entryPrice && targetProfit < entryPrice);

	const validCredentials =
		assetModalButton &&
		tradeTypeModalButton &&
		tradePriceModalButton &&
		selectedCandle &&
		selectedRisk &&
		signalImage &&
		tradeNote;

	const {
		data: tradingPlatforms,
		isSuccess: isTradingPlatformsSuccess,
		isLoading: isTradingPlatformsLoading,
	} = useSupportedTradingPlatforms({
		baseAssetId: Number(selectedBaseAsset?.id),
		quoteCurrencyId: Number(selectedQuoteCurrency?.id),
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
			const quoteCurrency: ISelectBoxOption<ISignalAsset>[] = currencies.map((currency) => ({
				displayText: currency.name,
				value: currency.id,
				imgUrl: currency.logo,
				symbol: currency.symbol,
				data: currency,
			}));
			setQuoteCurrencyOptions(quoteCurrency);
		}
	}, [isCurrencySuccess, currencies]);

	useEffect(() => {
		if (isAssetSuccess && assets) {
			const baseAssetsOptions: ISelectBoxOption<ISignalAsset>[] = assets.map((asset) => ({
				displayText: asset.name,
				value: asset.id,
				imgUrl: asset.logo,
				data: asset,
			}));
			setBaseAssetOptions(baseAssetsOptions);
		}
	}, [isAssetSuccess, assets]);

	// Boolean flag that triggers asset price fecth
	const fetchAssetCurrentPriceFlag =
		!!selectedBaseAsset && !!selectedQuoteCurrency && isModalOpen.tradePrice;
	const {
		data: assetCurrentPrice,
		isLoading: isCurrentPriceLoading,
		isSuccess: isCurrentPriceSuccess,
		isError: isCurrentPriceError,
		refetch: refetchCurrentPrice,
		isFetching: isCurrentPriceFetching,
		isRefetchError: isCurrentPriceRefetchError,
	} = useGetAssetCurrentPrice({
		asset: selectedBaseAsset?.id as string,
		quote: selectedQuoteCurrency?.symbol as string,
		fetch: fetchAssetCurrentPriceFlag,
	});

	const handleAssetCurrentPriceRefetch = () => {
		if (isCurrentPriceLoading || isCurrentPriceFetching || !fetchAssetCurrentPriceFlag) return;

		refetchCurrentPrice();
	};

	useEffect(() => {
		if (isCurrentPriceSuccess && assetCurrentPrice) {
			const price = Number(assetCurrentPrice.price.toFixed(4));
			const calcStopLoss = tradeSide === TradeSide.LONG ? price * 0.97 : price * 1.03; // 3% markup against price based on trade side

			setSelectedAssetCurrentPrice(price); // Set current price to state
			setEntryPrice(price); // Defaults entry price to current price
			handleStopLoss(Number(calcStopLoss.toFixed(4))); // Defaults stop loss to difference of 3% based on trade side
		}
	}, [isCurrentPriceSuccess, assetCurrentPrice, refetchCurrentPrice]);

	useEffect(() => {
		if (isTradingPlatformsSuccess && tradingPlatforms) {
			const options = tradingPlatforms.map((platform) => ({
				displayText: platform.name?.toString(),
				value: platform._id,
				imgUrl: platform.logo?.toString(),
			}));
			setTradingPlatformOptions(options);
		}
	}, [isTradingPlatformsSuccess, tradingPlatforms]);

	const handleQuoteCurrencyChange = (option: ISelectBoxOption<ISignalAsset>) => {
		setResetSelectedQuoteCurrency(false);
		setSelectedQuoteCurrency({
			id: option.data?.id ?? "",
			name: option.data?.name ?? "",
			symbol: option.data?.symbol ?? "",
			logo: option.data?.logo ?? "",
		});
	};

	const handleBaseAssetChange = (option: ISelectBoxOption<ISignalAsset>) => {
		setResetSelectedBaseAsset(false);
		setSelectedBaseAsset({
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

	const handleStopLoss = (value: number) => setStopLoss(value);
	const handleTargetProfit = (value: number) => setTargetProfit(value);
	const handleEntryPriceChange = (value: number) => setEntryPrice(value);
	const handleOrdersTriggerPrice = (value: number) => setOrdersTriggerPrice(value);
	const handleMaxOrders = (value: number) => setMaxOrders(value);

	const handleExchangeChange = (option: ICheckedBoxOption) => {
		setSelectedSupportedTradingPlatform((prev) => {
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

	const handleTradeNote = (value: string) => setTradeNote(value);

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
		setTargetProfit(undefined);
		setResetSelectedBaseAsset(true);
		setResetSelectedQuoteCurrency(true);
		setResetSelectedCandle(true);
		setEntryPrice(undefined);
		setOrdersTriggerPrice(undefined);
		// setMaxOrders(undefined);
		setStopLoss(undefined);
		setSelectedQuoteCurrency(undefined);
		setResetSelectedRisk(true);
		setSelectedSupportedTradingPlatform(undefined);
		setTradeNote(undefined);
		setSelectedBaseAsset(undefined);
		setSelectedAssetCurrentPrice(undefined);
	};

	// Setup query to backend
	const { createTrade, isError, isPending, error, isSuccess, data } = useCreateTrade();

	// Make call to backend
	const handleCreateSignal = () => {
		const newTrade = {
			baseAsset: selectedBaseAsset?.symbol as string,
			baseAssetLogoUrl: selectedBaseAsset?.logo as string,
			baseQuantity: 0, // Temporary default
			currentPrice: selectedAssetCurrentPrice ?? 0,
			entryPrice: entryPrice ?? 0,
			stopLossPrice: stopLoss ?? 0,
			takeProfitPrice: targetProfit ?? 0,
			ordersTriggerPrice: ordersTriggerPrice ?? 0,
			targetOrdersAmountToFill: maxOrders,
			chartUrl: signalImage.split(",")[1],
			tradeNote: tradeNote as string,
			quoteCurrency: selectedQuoteCurrency?.symbol as string,
			quoteTotal: 0, // Temporary default
			pair: `${selectedBaseAsset?.symbol}${selectedQuoteCurrency?.symbol}`,
			side: tradeSide as TradeSide,
			estimatedProfit: 0, // Temporary default
			estimatedLoss: 0, // Temporary default
			status: MasterTradeStatus.PENDING,
			orderPlacementType: OrderPlacementType.LIMIT,
			accountType: tradeType as unknown as AccountType, // Ensure correct type
			supportedTradingPlatforms: selectedSupportedTradingPlatform?.map((platform) =>
				platform.name.toUpperCase(),
			) as TradingPlatform[],
			candlestick: selectedCandle?.value as Candlestick,
			risk: selectedRisk?.value as SignalRisk,
			category: assetCategory?.value as Category,
		};

		createTrade(newTrade);
	};

	// Close trade modal after successful trade creation.
	useEffect(() => {
		if (isSuccess && data) {
			router.push(`/admin/trade-center/open-trades?trade=${isSuccess}`);
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
								setBaseAssetOptions([]);
								setAssetCategory(opt);
							}}
						/>

						<SelectBox
							labelText="Base Asset"
							isSearchable={true}
							options={baseAssetOptions}
							placeholder={
								isAssetLoading
									? "Loading..."
									: isAssetError
										? `${assetError} `
										: assets?.length === 0
											? "No asset found"
											: "Select Base Asset"
							}
							option={baseAssetOptions.find(
								(opt) => opt.displayText === selectedBaseAsset?.name,
							)}
							setOption={handleBaseAssetChange}
							clear={resetSelectedBaseAsset}
						/>

						<SelectBox
							labelText="Quote Currency"
							isSearchable={true}
							options={quoteCurrencyOptions}
							placeholder={
								isCurrencyLoading
									? "Loading..."
									: isCurrencyError
										? `${currencyError}`
										: "Select Quote Currency"
							}
							option={quoteCurrencyOptions.find(
								(opt) => opt.displayText === selectedQuoteCurrency?.name,
							)}
							setOption={handleQuoteCurrencyChange}
							clear={resetSelectedQuoteCurrency}
						/>

						<div>
							<label
								htmlFor="Supported Exchanges"
								className="text-textColor text-sm font-normal leading-none"
							>
								Choose Supported Exchanges
							</label>

							{isTradingPlatformsLoading ? (
								<p>Loading....</p>
							) : tradingPlatformOptions.length === 0 ? (
								<p className="bg-[#F5F8FE] text-red-500 text-center py-9 px-4 rounded-md">
									Please select Base Asset and Quote Currency.
								</p>
							) : (
								tradingPlatformOptions.map((platform) => (
									<Checkbox
										key={platform.displayText}
										label={platform.displayText}
										onChange={() => handleExchangeChange(platform)}
										checked={
											selectedSupportedTradingPlatform?.some(
												(x) => x._id === platform.value,
											) ?? false
										}
										imageUrl={platform.imgUrl}
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
							fluid
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
					className="min-h-[40vh]"
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
							className="flex justify-center mt-5"
							innerClassName="px-[20%] py-4 capitalize"
							fluid
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
						{renderDisplayItem({
							itemText: {
								text: `${selectedBaseAsset?.symbol} / ${selectedQuoteCurrency?.symbol}`,
								style: "font-bold",
							},
							styles: "!mx-0 md:!mx-0 !justify-start",
							itemImage: selectedBaseAsset?.logo,
							isAssetItem: true,
							assetTradeSide: renderStatus(
								tradeSide ?? "",
								{ justify: "justify-center" },
								false,
								[],
								"uppercase text-[10px] font-semibold",
							),
						})}
						<InputField
							type="number"
							labelText="Orders trigger price"
							props={{ name: "ordersTriggerPrice" }}
							placeholder="Enter orders trigger price"
							value={String(ordersTriggerPrice) ?? ""}
							onChange={(value: string) => handleOrdersTriggerPrice(Number(value))}
							className="no-spin-buttons disabled:cursor-not-allowed"
							onKeyDown={handleKeyDown}
							disable={!Number(entryPrice)}
							inputError={
								tradeSide && entryPrice && !ordersTriggerPrice
									? "Enter orders trigger price"
									: undefined
							}
						/>
						<InputField
							type="number"
							labelText="Max orders amount"
							props={{ name: "maxOrders" }}
							placeholder="Enter max orders amount to fill"
							value={String(maxOrders) ?? ""}
							onChange={(value: string) => handleMaxOrders(Number(value))}
							className="no-spin-buttons disabled:cursor-not-allowed"
							onKeyDown={handleKeyDown}
							disable={true} // disabled temporarily
							inputError={
								tradeSide && entryPrice && !maxOrders
									? "Enter max orders amount"
									: undefined
							}
						/>

						<hr className="h-[3px] mb-5 border-0 bg-[#D5D8DD] rounded-md" />

						<section className="relative">
							<div className="absolute right-2 top-0 flex items-center gap-3">
								{isCurrentPriceLoading || isCurrentPriceFetching ? (
									<span className="text-[#808080] text-base">
										Fetching Price ...
									</span>
								) : (
									<span
										className={`${isCurrentPriceError || isCurrentPriceRefetchError ? "text-[#E02D3C]" : "text-[#08123B]"} text-base`}
									>
										{isCurrentPriceError || isCurrentPriceRefetchError
											? "Reload !!!"
											: isCurrentPriceSuccess && selectedAssetCurrentPrice}
									</span>
								)}
								<FaArrowsRotate
									onClick={handleAssetCurrentPriceRefetch}
									className={`cursor-pointer ${isCurrentPriceLoading || isCurrentPriceFetching ? "animate-spin cursor-not-allowed" : ""}`}
									color={
										isCurrentPriceLoading || isCurrentPriceFetching
											? "#E02D3C"
											: "#5F6570"
									}
								/>
							</div>
							<InputField
								type="number"
								labelText="Entry Price"
								props={{ name: "entryPrice", step: "0.01" }}
								placeholder={
									isCurrentPriceLoading
										? "Fetching price ..."
										: "Input trade entry price"
								}
								value={String(entryPrice) ?? ""}
								onChange={(value: string) => handleEntryPriceChange(Number(value))}
								className="no-spin-buttons"
								onKeyDown={handleKeyDown}
								disable={isCurrentPriceLoading}
							/>
						</section>

						<InputField
							type="number"
							labelText="Stop loss price"
							props={{ name: "stopLoss" }}
							placeholder="Input trade stop loss"
							value={String(stopLoss) ?? ""}
							onChange={(value: string) => handleStopLoss(Number(value))}
							className="no-spin-buttons disabled:cursor-not-allowed"
							onKeyDown={handleKeyDown}
							disable={!Number(entryPrice)}
							inputError={
								tradeSide && entryPrice && stopLoss
									? getSignalPriceInputValidationMessage({
											tradeSide,
											entryPrice,
											comparePrice: Number(stopLoss),
											boundary: "low",
										})
									: undefined
							}
						/>

						<InputField
							type="number"
							value={String(targetProfit) ?? ""}
							labelText="Take profit price"
							onChange={(value: string) => handleTargetProfit(Number(value))}
							props={{ name: "targetProfit", step: "0.01" }}
							placeholder="Enter target profit"
							className="no-spin-buttons my-2 disabled:cursor-not-allowed"
							onKeyDown={handleKeyDown}
							disable={!Number(entryPrice)}
							inputError={
								tradeSide && entryPrice && targetProfit
									? getSignalPriceInputValidationMessage({
											tradeSide,
											entryPrice,
											comparePrice: Number(targetProfit),
											boundary: "up",
										})
									: undefined
							}
						/>

						<Button
							onClick={() => handleModalChange(TradeSignalModalScreen.TRADE_CHART)}
							disabled={!tradePriceModalButton}
							type="submit"
							className="mt-2 flex justify-center"
							innerClassName="px-[20%] py-4 capitalize"
							fluid
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
					<section className="flex flex-col gap-y-4 pt-4 px-2">
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
							fluid
						>
							{isPending ? "Creating trade..." : "Create Trade"}
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
					title="Trade Error"
					message={error?.message ?? "Create Trade Error"}
					autoVanish
					autoVanishTimeout={10}
				/>
			)}
		</>
	);
}

CreateTrade.getLayout = (page: React.ReactElement) => (
	<AdminNestedTradeCenterLayout>{page}</AdminNestedTradeCenterLayout>
);
export default CreateTrade;
