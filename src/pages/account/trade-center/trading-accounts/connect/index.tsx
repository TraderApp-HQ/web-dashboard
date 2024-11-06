import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "~/components/Modal";
import Button from "~/components/AccountLayout/Button";
import SelectBox from "~/components/common/SelectBox";
import { ISelectBoxOption } from "~/components/interfaces";
import { NestedTradeCenterLayout } from "../..";
import { Category } from "~/config/enum";
import { TradeStatus } from "~/apis/handlers/assets/enums";
import useExchanges from "~/hooks/useExchanges";

const ConnectTradingAccount = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<ISelectBoxOption>();
	const [categoryOptions, setCategoryOptions] = useState<ISelectBoxOption[]>([]);
	const [selectedPlatform, setSelectedPlatform] = useState<ISelectBoxOption>();
	const [platformOptions, setPlatformOptions] = useState<ISelectBoxOption[]>([]);
	const [resetSelectedPlatform, setResetSelectedPlatform] = useState(false);

	const categories = [
		{ name: Category.CRYPTO, id: Category.CRYPTO },
		{ name: Category.FOREX, id: Category.FOREX },
	];

	// Trigger fetching platforms only when the category is Crypto
	const isCryptoSelected = selectedCategory?.value === Category.CRYPTO;
	const {
		data: platforms,
		isSuccess: isPlatformSuccess,
		isError,
		error,
		isLoading,
	} = useExchanges(
		{ status: TradeStatus.active },
		isCryptoSelected, // Only enable fetching when Crypto is selected
	);

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
		if (isPlatformSuccess && platforms.length > 0 && isCryptoSelected) {
			setPlatformOptions(
				platforms.map(({ name, _id, logo }) => ({
					displayText: name?.toString(),
					value: _id,
					imgUrl: logo?.toString(),
				})),
			);
		} else {
			setPlatformOptions([]);
			setResetSelectedPlatform(true);
		}
	}, [isPlatformSuccess, platforms, isCryptoSelected]);

	const handleModalClose = () => {
		router.back();
		setIsOpen(false);
	};

	const handleAccountConnection = () => {
		if (selectedCategory && selectedPlatform) {
			router.push({
				pathname: "connect/new",
				query: {
					categoryName: selectedCategory.displayText,
					platformName: selectedPlatform.displayText.toUpperCase(),
					platformId: selectedPlatform.value,
					imgUrl: selectedPlatform.imgUrl,
				},
			});
		}
		setIsOpen(false);
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
	const platformPlaceholder = isError
		? error?.message
		: isLoading
			? "Loading..."
			: "Select Platform";

	return (
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
	);
};

ConnectTradingAccount.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default ConnectTradingAccount;
