import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TradingEngineService } from "~/apis/handlers/trading-engine";
import { TradingPlatform } from "~/apis/handlers/trading-engine/enums";
import { ITradingAccountInfo } from "~/apis/handlers/trading-engine/interfaces";
import AdminLayout from "~/components/AdminLayout/Layout";
import Button from "~/components/common/Button";
import InputField from "~/components/common/InputField";
import SelectBox from "~/components/common/SelectBox";
import Toast from "~/components/common/Toast";
import type { ISelectBoxOption } from "~/components/interfaces";
import AddFundLoader from "~/components/Loaders/AddFundLoader";
import Modal from "~/components/Modal";
import { AccountType, Currency } from "~/config/enum";
import { useCreate } from "~/hooks/useCreate";
import { useGetUserTradingAccounts } from "~/hooks/useGetUserTradingAccounts";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params!;
	return {
		props: {
			id,
		},
	};
};

function AddFund({ id }: { id: string }) {
	const router = useRouter();
	const tradingService = new TradingEngineService();
	const [isOpen, setIsOpen] = useState(true);
	const [tradingAccounts, setTradingAccounts] = useState<ITradingAccountInfo[]>([]);
	const [exchange, setExchange] = useState<ISelectBoxOption | undefined>(undefined);
	const [accountType, setAccountType] = useState<ISelectBoxOption | undefined>(undefined);
	const [currency, setCurrency] = useState<ISelectBoxOption | undefined>(undefined);
	const [amount, setAmount] = useState<number | undefined>(undefined);
	const [submitButtonDisabled, setSubmitButtonDisabled] = useState<boolean>(true);

	// Fetch user trading accounts
	const {
		isUserTradingAccountsError,
		isUserTradingAccountsLoading,
		isUserTradingAccountsSuccess,
		userTradingAccounts,
		userTradingAccountsError,
	} = useGetUserTradingAccounts({ userId: id, enabled: true });

	// Setup query to backend
	const {
		mutate: addFund,
		isPending: isAddFundPending,
		isError: isAddFundError,
		isSuccess: isAddFundSuccess,
		error: addFundError,
		data: addFundDataMessage,
	} = useCreate({
		mutationFn: tradingService.addFund.bind(tradingService),
	});

	// Set trading accounts to state
	useEffect(() => {
		if (userTradingAccounts) {
			setTradingAccounts(userTradingAccounts);
		}
	}, [userTradingAccounts]);

	// Sets current account balance upon selection
	useEffect(() => {
		if (!exchange || !accountType || !currency) return;

		const balance = tradingAccounts
			.find((acct) => acct.platformName === exchange.value)
			?.balances?.find(
				(bal) => bal.currency === currency.value && bal.accountType === accountType.value,
			)?.availableBalance;

		setAmount(balance);
	}, [exchange, accountType, currency, tradingAccounts]);

	// Validation to check if form is fit to submit
	useEffect(() => {
		if (exchange && accountType && currency && amount !== undefined && amount >= 0) {
			// Check if amount is a number and not negative
			setSubmitButtonDisabled(false);
		} else {
			setSubmitButtonDisabled(true);
		}
	}, [exchange, accountType, currency, amount]);

	// Handlers
	const handleSelectExchange = (exchange: ISelectBoxOption) => setExchange(exchange);
	const handleSelectAccountType = (accountType: ISelectBoxOption) => setAccountType(accountType);
	const handleSelectCurrency = (currency: ISelectBoxOption) => setCurrency(currency);
	const handleChangeAmount = (amount: string) => setAmount(Number(amount));
	const handleModalClose = () => {
		setIsOpen(false);
		router.back();
	};
	const handleClearFields = () => {
		setExchange(undefined);
		setAccountType(undefined);
		setCurrency(undefined);
		setAmount(undefined);
	};

	// Clears form fields on successful submission
	useEffect(() => {
		isAddFundSuccess && handleClearFields();
	}, [isAddFundSuccess]);

	const onSubmit = () => {
		if (exchange && accountType && currency && amount !== undefined && amount >= 0) {
			const data = {
				userId: id,
				platformName: exchange.value as TradingPlatform,
				accountType: accountType.value as AccountType,
				currency: currency.value as Currency,
				amount,
			};
			addFund(data);
		}
	};

	return (
		<>
			<Modal
				openModal={isOpen}
				width="md:w-[480px]"
				title="Add fund to account"
				onClose={handleModalClose}
			>
				{isUserTradingAccountsLoading && <AddFundLoader />}
				{isUserTradingAccountsError && (
					<section className="p-2 text-center bg-white text-red-400 text-base">
						{userTradingAccountsError?.message}
					</section>
				)}
				{isUserTradingAccountsSuccess &&
					!isUserTradingAccountsError &&
					userTradingAccounts?.length === 0 && (
						<section className="p-2 text-center bg-white text-red-700 text-xl">
							No account connected.
						</section>
					)}
				{isUserTradingAccountsSuccess && tradingAccounts.length > 0 && (
					<section className="flex flex-col gap-y-4 px-1">
						<SelectBox
							labelText="Select Exchange"
							options={tradingAccounts?.map((acct) => ({
								displayText: acct.platformName,
								value: acct.platformName,
								imgUrl: acct.platformLogo,
							}))}
							option={exchange}
							placeholder="Select exchange"
							setOption={handleSelectExchange}
						/>
						<SelectBox
							labelText="Account Type"
							options={Array.from(
								new Set(
									tradingAccounts.flatMap((acct) =>
										acct.balances.map((bal) => bal.accountType),
									),
								),
							).map((type) => ({
								displayText: type,
								value: type,
							}))}
							option={accountType}
							placeholder="Select account type"
							setOption={handleSelectAccountType}
						/>
						<SelectBox
							labelText="Currency"
							options={Array.from(
								new Set(
									tradingAccounts.flatMap((acct) =>
										acct.balances.map((bal) => bal.currency),
									),
								),
							).map((type) => ({
								displayText: type,
								value: type,
							}))}
							option={currency}
							placeholder="Select currency"
							setOption={handleSelectCurrency}
						/>
						<InputField
							type="number"
							labelText="Amount"
							props={{ name: "amount" }}
							placeholder="Enter amount"
							onChange={handleChangeAmount}
							className="no-spin-buttons"
							value={amount !== undefined ? amount.toString() : ""}
						/>
						<Button
							className="mt-2 flex justify-center"
							isProcessing={isAddFundPending}
							labelText="Add Fund"
							onClick={onSubmit}
							disabled={submitButtonDisabled || isAddFundPending}
						/>
					</section>
				)}

				{isAddFundError && (
					<Toast
						type="error"
						variant="filled"
						title="Fund Error"
						message={addFundError?.message ?? "Something went wrong!"}
						autoVanish
						autoVanishTimeout={10}
					/>
				)}
				{isAddFundSuccess && (
					<Toast
						type="success"
						variant="filled"
						title="Fund"
						message={addFundDataMessage ?? "Fund added Successfully!"}
						autoVanish
						autoVanishTimeout={10}
						onToastClose={handleModalClose}
					/>
				)}
			</Modal>
		</>
	);
}

AddFund.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;
export default AddFund;
