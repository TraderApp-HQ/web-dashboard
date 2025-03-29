import { JSXElementConstructor } from "react";
import { WalletType } from "./enum";
import { IconProps } from "~/components/AccountLayout/IconButton";

export interface ITotalBalanceItems {
	label: string;
	url: string;
	Icon: JSXElementConstructor<IconProps>;
}

export interface IUserWallet {
	id: string;
	userId: string;
	walletType: string;
	walletTypeName: WalletType;
	currencyName: string;
	currency: string;
	availableBalance: number;
	lockedBalance: number;
}
