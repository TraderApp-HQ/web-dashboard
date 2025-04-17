import { useQueries } from "@tanstack/react-query";
import { useCallback } from "react";
import { WalletsService } from "~/apis/handlers/wallets";
import { WalletsQueryId } from "~/apis/handlers/wallets/constants";
import { PaymentCategory, PaymentOperation, WalletType } from "~/apis/handlers/wallets/enum";
import { useFetch } from "../useFetch";
import { useCreate } from "../useCreate";
import { IPaginationQuery } from "~/apis/handlers/wallets/interface";

export const useGetUserWalletsBalance = (walletType: WalletType) => {
	const walletsService = new WalletsService();
	const walletBalance = useCallback(
		() => walletsService.getWalletBalance(walletType),
		[walletsService],
	);
	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [WalletsQueryId.walletsBalance, walletType],
		queryFn: walletBalance,
	});

	return {
		data,
		error,
		isLoading,
		isSuccess,
		isError,
	};
};

export const useWalletDepositOptions = ({
	category,
	operation,
}: {
	category: PaymentCategory;
	operation: PaymentOperation;
}) => {
	const walletsService = new WalletsService();

	// Fetch the supported currencies and payment options for deposit
	const [supportedCurrenciesQuery, paymentOptionsQuery] = useQueries({
		queries: [
			{
				queryKey: [WalletsQueryId.supportedCurrencies],
				queryFn: () => walletsService.getSupportedCurrencies(),
			},
			{
				queryKey: [WalletsQueryId.paymentOptions, category, operation],
				queryFn: () =>
					walletsService.getSupportedPaymentOptions({
						category,
						operation,
					}),
			},
		],
	});

	return {
		supportedCurrencies: supportedCurrenciesQuery.data,
		paymentOptions: paymentOptionsQuery.data,
		isLoading: supportedCurrenciesQuery.isLoading || paymentOptionsQuery.isLoading,
		isError: supportedCurrenciesQuery.isError || paymentOptionsQuery.isError,
		error: supportedCurrenciesQuery.error || paymentOptionsQuery.error,
	};
};

export const useInitiateDeposit = () => {
	const walletsService = new WalletsService();
	const {
		mutate: initiateDeposit,
		data,
		isPending,
		isSuccess,
		isError,
		error,
	} = useCreate({
		mutationFn: walletsService.initiateDeposit.bind(walletsService),
	});

	return {
		initiateDeposit,
		isError,
		isPending,
		error,
		isSuccess,
		data,
	};
};

export const useGetUserWalletsRecentTransactions = ({
	currentPage,
	rowsPerPage,
}: IPaginationQuery) => {
	const walletsService = new WalletsService();
	const recentTransactions = useCallback(
		() => walletsService.getWalletRecentTransactions({ currentPage, rowsPerPage }),
		[walletsService, currentPage, rowsPerPage],
	);
	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [WalletsQueryId.walletTransactions, currentPage, rowsPerPage],
		queryFn: recentTransactions,
	});

	return {
		data,
		error,
		isLoading,
		isSuccess,
		isError,
	};
};

export const useGetUserWalletsTransaction = (id: string) => {
	const walletsService = new WalletsService();
	const recentTransactions = useCallback(
		() => walletsService.getWalletTransaction(id),
		[walletsService, id],
	);
	const { data, error, isLoading, isSuccess, isError } = useFetch({
		queryKey: [WalletsQueryId.walletTransaction, id],
		queryFn: recentTransactions,
		enabled: !!id, // Only Fetches when the Id is not undefined
	});

	return {
		data,
		error,
		isLoading,
		isSuccess,
		isError,
	};
};
