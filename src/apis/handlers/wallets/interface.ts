import { JSXElementConstructor } from "react";
import { WalletType } from "./enum";
import { IconProps } from "~/components/AccountLayout/IconButton";

export interface ITotalBalanceItems {
	label: string;
	url: string;
	Icon: JSXElementConstructor<IconProps>;
}

export interface IUserWalletResponse {
	wallets: IUserWallet[];
	exchangeRates: IExchangeRate[];
	exchangeRateTotalBalances: IGetWalletResponseRate[];
}

export interface IUserWallet {
	id: string;
	userId: string;
	walletType: string;
	walletTypeName: WalletType;
	currencyName: string;
	currencySymbol: string;
	currency: string;
	availableBalance: number;
	lockedBalance: number;
}

interface IExchangeRate {
	pair: string; // e.g., "BTC/USD", "BTC/EUR", "USDT/USD", USDT/EUR
	rate: number; // e.g., 45000.00
}

interface IGetWalletResponseRate {
	balance: number;
	currency: string;
}
