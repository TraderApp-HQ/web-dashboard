import { useCallback } from "react";
import { WalletsService } from "~/apis/handlers/wallets";
import { WalletType } from "~/apis/handlers/wallets/enum";
import { useFetch } from "../useFetch";
import { WalletsQueryId } from "~/apis/handlers/wallets/constants";

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
