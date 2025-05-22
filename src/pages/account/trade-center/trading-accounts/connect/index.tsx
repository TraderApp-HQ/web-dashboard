import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "~/components/Modal";
import Button from "~/components/AccountLayout/Button";
import SelectBox from "~/components/common/SelectBox";
import { ISelectBoxOption } from "~/components/interfaces";
import { NestedTradeCenterLayout } from "../..";
import { Category } from "~/config/enum";
import { TradeStatus } from "~/apis/handlers/assets/enums";
import useGetTradingPlatforms from "~/hooks/useGetTradingPlatforms";
import AccountConnection from "~/components/AccountLayout/TradeCenter/AccountConnection";
import { TradingPlatform } from "~/apis/handlers/trading-engine/enums";
import { useGetUserTradingAccount } from "~/hooks/useGetUserTradingAccount";
import { ITradingAccountInfo } from "~/apis/handlers/trading-engine/interfaces";
import useUserProfileData from "~/hooks/useUserProfileData";
import { IFetchTradingPlatform } from "~/apis/handlers/assets/interfaces";
import { useUserTradingAccounts } from "~/contexts/UserTradingAccountsContext";

const ConnectTradingAccount = () => {
	const router = useRouter();
	const { userProfile } = useUserProfileData();
	const [isOpen, setIsOpen] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<ISelectBoxOption>();
	const [categoryOptions, setCategoryOptions] = useState<ISelectBoxOption[]>([]);
	const [selectedPlatform, setSelectedPlatform] =
		useState<ISelectBoxOption<IFetchTradingPlatform>>();
	const [platformOptions, setPlatformOptions] = useState<
		ISelectBoxOption<IFetchTradingPlatform>[]
	>([]);
	const [resetSelectedPlatform, setResetSelectedPlatform] = useState(false);
	const [isConnectTradingAccount, setIsConnectTradingAccount] = useState(true);
	const [userTradingAccount, setUserTradingAccount] = useState<ITradingAccountInfo | undefined>();
	const [validatedPlatformName, setValidatedPlatformName] = useState<TradingPlatform>();
	const { userTradingAccounts } = useUserTradingAccounts();

	const { platformName, refresh } = router.query;
	const categories = [
		{ name: Category.CRYPTO, id: Category.CRYPTO },
		{ name: Category.FOREX, id: Category.FOREX },
	];

	// Validate the platformName from query params
	useEffect(() => {
		if (!router.isReady || !platformName) return; // Wait until router and query are ready

		const isValidPlatform = Object.values(TradingPlatform).includes(
			platformName as TradingPlatform,
		);
		if (!isValidPlatform) {
			router.push("/account/trade-center/trading-accounts?platform_error=true");
		} else {
			setValidatedPlatformName(platformName as TradingPlatform);
		}
	}, [router.isReady, platformName]);

	// fetch user trading account info
	const { userTradingAccount: data, isUserTradingAccountSuccess } = useGetUserTradingAccount({
		userId: userProfile?.id ?? "",
		platformName: validatedPlatformName!,
		enabled: !!validatedPlatformName && !!userProfile?.id,
	});

	useEffect(() => {
		if (isUserTradingAccountSuccess) {
			setUserTradingAccount(data);
		}
	}, [data]);

	const {
		tradingPlatforms,
		isTradingPlatformsSuccess,
		isTradingPlatformsError,
		isTradingPlatformsLoading,
		tradingPlatformsError,
	} = useGetTradingPlatforms({
		status: TradeStatus.active,
		enabled: !!selectedCategory || !!validatedPlatformName,
	});

	// Set category options on mount
	useEffect(() => {
		setCategoryOptions(
			categories.map(({ name, id }) => ({
				displayText: name,
				value: id,
			})),
		);
	}, []);

	// Update platform options based on selected category
	useEffect(() => {
		if (isTradingPlatformsSuccess && tradingPlatforms && tradingPlatforms.length > 0) {
			const activeCategoryPlatforms = tradingPlatforms
				.map((platform) => ({
					displayText: platform.name,
					value: platform._id,
					imgUrl: platform.logo,
					data: platform,
				}))
				.filter((platform) => platform.data.category === selectedCategory?.value)
				.filter(
					// filter out user's already connected accounts
					(platform) =>
						!userTradingAccounts
							?.map((platform) => platform.platformName.toLowerCase())
							.includes(platform.displayText.toLowerCase()),
				);
			setPlatformOptions(activeCategoryPlatforms);

			// auto select first option in activeCategoryPlatforms array
			if (activeCategoryPlatforms[0]) {
				handleSetSelectedPlatform(
					activeCategoryPlatforms[0].displayText as TradingPlatform,
					tradingPlatforms,
				);
			}
		} else {
			setPlatformOptions([]);
			setResetSelectedPlatform(true);
		}
	}, [isTradingPlatformsSuccess, tradingPlatforms, selectedCategory, userTradingAccounts]);

	const handleModalClose = () => {
		router.push("/account/trade-center/trading-accounts");
		setIsOpen(false);
	};

	const handleAccountConnection = () => {
		setIsConnectTradingAccount((prev) => !prev);
		setIsOpen(true);
	};

	const handleCategoryChange = (option: ISelectBoxOption) => {
		setSelectedCategory(option);
		setSelectedPlatform(undefined); // Clear platform selection when category changes
		setResetSelectedPlatform(true);
	};

	const handlePlatformChange = (option: ISelectBoxOption) => {
		setSelectedPlatform(option);
		setResetSelectedPlatform(false);
	};

	// helper function to set platform
	const handleSetSelectedPlatform = (
		validatedPlatformName: TradingPlatform,
		tradingPlatforms: IFetchTradingPlatform[],
	) => {
		const activePlatform = tradingPlatforms.find(
			(platform) => platform.name.toLowerCase() === validatedPlatformName.toLowerCase(),
		);
		setSelectedPlatform({
			displayText: activePlatform?.name ?? "",
			value: activePlatform?._id ?? "",
			imgUrl: activePlatform?.logo,
			data: activePlatform,
		});
	};

	// set platform on update mode
	useEffect(() => {
		if (validatedPlatformName && tradingPlatforms) {
			handleSetSelectedPlatform(validatedPlatformName, tradingPlatforms);
		}
	}, [validatedPlatformName, tradingPlatforms]);

	const isSubmitDisabled = !selectedCategory || !selectedPlatform;
	const platformPlaceholder = isTradingPlatformsError
		? tradingPlatformsError?.message
		: isTradingPlatformsLoading
			? "Loading..."
			: "Select Platform";

	return (
		<>
			{isConnectTradingAccount && !platformName ? (
				<Modal
					openModal={isOpen}
					width="md:w-[507px]"
					title="Select Trading Platform"
					onClose={handleModalClose}
				>
					<div className="flex flex-col space-y-8 min-h-[340px] justify-center">
						<SelectBox
							option={selectedCategory}
							labelText="Category"
							options={categoryOptions}
							placeholder="Select Category"
							setOption={handleCategoryChange}
						/>
						<SelectBox
							option={selectedPlatform}
							labelText="Platform"
							options={platformOptions}
							placeholder={platformPlaceholder}
							setOption={handlePlatformChange}
							clear={resetSelectedPlatform}
						/>
						<Button
							disabled={isSubmitDisabled}
							type="submit"
							fluid
							className="mt-2 flex justify-center"
							innerClassName="px-[20%] py-4 capitalize"
							onClick={handleAccountConnection}
						>
							Continue
						</Button>
					</div>
				</Modal>
			) : (
				<AccountConnection
					userId={userProfile?.id ?? ""}
					categoryName={
						!platformName
							? (selectedCategory?.displayText as Category)
							: (userTradingAccount?.category as Category)
					}
					platformName={
						!platformName
							? (selectedPlatform?.displayText.toUpperCase() as TradingPlatform)
							: (userTradingAccount?.platformName as TradingPlatform)
					}
					platformLogo={
						!platformName
							? (selectedPlatform?.imgUrl ?? "")
							: (userTradingAccount?.platformLogo ?? "")
					}
					handleAccountConnection={handleAccountConnection}
					isUpdateMode={platformName ? true : false}
					isRefreshMode={refresh === "true"}
					userTradingAccount={userTradingAccount}
					connectionTypes={selectedPlatform?.data?.connectionTypes ?? []}
					isIpAddressWhitelistRequired={
						selectedPlatform?.data?.isIpAddressWhitelistRequired ?? false
					}
					isPassphraseRequired={selectedPlatform?.data?.isPassphraseRequired ?? false}
				/>
			)}
		</>
	);
};

ConnectTradingAccount.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default ConnectTradingAccount;
