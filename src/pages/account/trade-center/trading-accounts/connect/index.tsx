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

const ConnectTradingAccount = () => {
	const router = useRouter();
	const { userProfile } = useUserProfileData();
	const [isOpen, setIsOpen] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<ISelectBoxOption>();
	const [categoryOptions, setCategoryOptions] = useState<ISelectBoxOption[]>([]);
	const [selectedPlatform, setSelectedPlatform] = useState<ISelectBoxOption>();
	const [platformOptions, setPlatformOptions] = useState<ISelectBoxOption[]>([]);
	const [resetSelectedPlatform, setResetSelectedPlatform] = useState(false);
	const [isConnectTradingAccount, setIsConnectTradingAccount] = useState(true);
	const [userTradingAccount, setUserTradingAccount] = useState<ITradingAccountInfo | undefined>();
	const [validatedPlatformName, setValidatedPlatformName] = useState<TradingPlatform>();

	const { platformName } = router.query;
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

	// fetch user trading account infor
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

	// Trigger fetching platforms only when the category is Crypto
	const isCryptoSelected = selectedCategory?.value === Category.CRYPTO;
	const {
		tradingPlatforms,
		isTradingPlatformsSuccess,
		isTradingPlatformsError,
		isTradingPlatformsLoading,
		tradingPlatformsError,
	} = useGetTradingPlatforms({ status: TradeStatus.active, enabled: isCryptoSelected });

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
		if (
			isTradingPlatformsSuccess &&
			tradingPlatforms &&
			tradingPlatforms.length > 0 &&
			isCryptoSelected
		) {
			setPlatformOptions(
				tradingPlatforms.map(
					({ name, _id, logo, isIpAddressWhitelistRequired, connectionTypes }) => ({
						displayText: name?.toString(),
						value: _id,
						imgUrl: logo?.toString(),
						data: { isIpAddressWhitelistRequired, connectionTypes },
					}),
				),
			);
		} else {
			setPlatformOptions([]);
			setResetSelectedPlatform(true);
		}
	}, [isTradingPlatformsSuccess, tradingPlatforms, isCryptoSelected]);

	const handleModalClose = () => {
		router.back();
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
					title="Connect Trading Account"
					onClose={handleModalClose}
				>
					<div className="flex flex-col gap-y-3">
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
					tradingAccount={userTradingAccount}
					connectionTypes={selectedPlatform?.data.connectionTypes}
					isIpAddressWhitelistRequired={
						selectedPlatform?.data.isIpAddressWhitelistRequired
					}
				/>
			)}
		</>
	);
};

ConnectTradingAccount.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default ConnectTradingAccount;
