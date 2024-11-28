import type { ReactNode } from "react";
import React, { createContext, useState, useContext } from "react";

interface NavContextType {
	showSideNav: boolean;
	toggleSideNav: (state: boolean) => void;
}

interface IProps {
	children: ReactNode;
}

export const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<IProps> = ({ children }) => {
	const [showSideNav, setShowSideNav] = useState(false);
	const toggleSideNav = (state: boolean) => setShowSideNav(state);

	return (
		<NavContext.Provider value={{ showSideNav, toggleSideNav }}>{children}</NavContext.Provider>
	);
};

export const useSideNav = () => {
	const context = useContext(NavContext);
	if (!context) {
		throw new Error("useSideNav must be used within an NavProvider");
	}
	return context;
};
