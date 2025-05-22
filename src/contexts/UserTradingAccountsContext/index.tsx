import type { ReactNode } from "react";
import React, { createContext, useState, useContext } from "react";
import { ITradingAccountInfo } from "~/apis/handlers/trading-engine/interfaces";

interface UserTradingAccountsContextType {
	userTradingAccounts: ITradingAccountInfo[] | undefined;
	setUserTradingAccounts: (usertradingAccounts: ITradingAccountInfo[]) => void;
}

interface IProps {
	children: ReactNode;
}

export const UserTradingAccountsContext = createContext<UserTradingAccountsContextType | undefined>(
	undefined,
);

export const UserTradingAccountsProvider: React.FC<IProps> = ({ children }) => {
	const [userTradingAccounts, setUserAccounts] = useState<ITradingAccountInfo[] | undefined>([]);
	const setUserTradingAccounts = (userTradingAccounts: ITradingAccountInfo[]) =>
		setUserAccounts(userTradingAccounts);

	return (
		<UserTradingAccountsContext.Provider
			value={{ userTradingAccounts, setUserTradingAccounts }}
		>
			{children}
		</UserTradingAccountsContext.Provider>
	);
};

export const useUserTradingAccounts = () => {
	const context = useContext(UserTradingAccountsContext);
	if (!context) {
		throw new Error("useUserTradingAccounts must be used within an NavProvider");
	}
	return context;
};
