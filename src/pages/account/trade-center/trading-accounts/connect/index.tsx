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

	const categories = [
		{ name: Category.CRYPTO, id: Category.CRYPTO },
		{ name: Category.FOREX, id: Category.FOREX },
	];

	const {
		data: platforms,
		isSuccess: isPlaformSuccess,
		isError,
		error,
		isLoading,
	} = useExchanges({
		status: TradeStatus.active,
	});

	useEffect(() => {
		const categoryOptions = categories.map((category) => ({
			displayText: category.name,
			value: category.id,
		}));
		setCategoryOptions(categoryOptions);
	}, []);

	useEffect(() => {
		if (selectedCategory?.value === Category.CRYPTO) {
			if (isPlaformSuccess && platforms.length > 0) {
				const platformOptions = platforms.map((platform) => ({
					displayText: platform.name?.toString(),
					value: platform._id,
					imgUrl: platform.logo?.toString(),
				}));
				setPlatformOptions(platformOptions);
			}
		} else {
			setPlatformOptions([]);
		}
	}, [isPlaformSuccess, platforms, selectedCategory]);

	const handleModalClose = () => {
		router.back();
		setIsOpen(false);
	};

	const handleAccountConnection = () => {
		setIsOpen(false);
		router.push({
			pathname: "connect/new",
			query: {
				categoryName: selectedCategory?.displayText,
				platformName: selectedPlatform?.displayText.toUpperCase(),
				platformId: selectedPlatform?.value,
				imgUrl: selectedPlatform?.imgUrl,
			},
		});
	};

	const isSubmitDisabled = !selectedCategory || !selectedPlatform;
	return (
		<>
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
						placeholder={"Select Category"}
						setOption={setSelectedCategory}
					/>
					<SelectBox
						option={selectedPlatform}
						labelText="Platform"
						options={platformOptions}
						placeholder={
							(isError && error?.message) ||
							(isLoading && "loading...") ||
							"Select Platform"
						}
						setOption={setSelectedPlatform}
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
		</>
	);
};

ConnectTradingAccount.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);

export default ConnectTradingAccount;
