import TiltedCircledDownRightArrowIcon from "~/components/icons/TiltedCircledDownRightArrowIcon";
import TiltedCircledTopRightArrowIcon from "~/components/icons/TiltedCircledTopRightArrowIcon";
import { ROUTES } from "~/config/constants";
import { ITotalBalanceItems } from "./interface";

export const supportedOperations: ITotalBalanceItems[] = [
	{
		label: "Deposit",
		url: ROUTES.wallet.deposit,
		Icon: TiltedCircledDownRightArrowIcon,
	},
	{
		label: "Withdraw",
		url: ROUTES.wallet.withdraw,
		Icon: TiltedCircledTopRightArrowIcon,
	},
];

export const WalletsQueryId = {
	walletsBalance: "user-wallets-balance",
	walletTransactions: "user-wallet-transactions",
	walletTransaction: "user-wallet-transaction",
	wallet: "user-wallet",
	wallets: "user-wallets",
	supportedCurrencies: "wallet-supported-currencies",
	paymentOptions: "wallet-payment-options",
};

export const WITHDRAWAL_LIMIT = {
	MINIMUM_AMOUNTS: { USDT: 6 },
};

export const WITHDRAWAL_FEES = {
	PROCESSING_RATE: 0.03, // 3%
	MIN_PROCESSING_FEE: 5,
};
