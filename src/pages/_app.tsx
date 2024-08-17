import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavProvider } from "~/contexts/NavContext";
import AuthLayout from "./auth/layout";
import AccountLayout from "../components/AccountLayout/Layout";

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const queryClient = new QueryClient();
	const getLayout = Component.getLayout ?? ((page) => page);

	const LayoutWrapper = ({ children }: { children: ReactNode }) => {
		if (Component.name.startsWith("Account")) {
			return <AccountLayout>{children}</AccountLayout>;
		}
		if (Component.name.startsWith("Auth")) {
			return <AuthLayout>{children}</AuthLayout>;
		}
		// if (Component.name.startsWith('Admin')) {
		// return <AdminRootLayout>{children}</AdminRootLayout>;
		// }
		return <>{children}</>;
	};
	return (
		<NavProvider>
			<QueryClientProvider client={queryClient}>
				<LayoutWrapper>{getLayout(<Component {...pageProps} />)}</LayoutWrapper>
			</QueryClientProvider>
		</NavProvider>
	);
}
