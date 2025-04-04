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
	walletHistory: "user-wallet-history",
	wallet: "user-wallet",
	wallets: "user-wallets",
	supportedCurrencies: "wallet-supported-currencies",
	paymentOptions: "wallet-payment-options",
};
