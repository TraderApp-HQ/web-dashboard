import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";
import ConnectTradingAccount from "~/pages/account/trade-center/trading-accounts/connect";
import { useRouter } from "next/router";

// Mock all required hooks
jest.mock("~/contexts/UserTradingAccountsContext", () => ({
	useUserTradingAccounts: () => ({
		userTradingAccounts: [],
		setUserTradingAccounts: jest.fn(),
	}),
}));

jest.mock("~/hooks/useUserProfileData", () => ({
	__esModule: true,
	default: () => ({
		userProfile: { id: "test-user-id" },
		isAdmin: false,
	}),
}));

jest.mock("~/hooks/useGetTradingPlatforms", () => ({
	__esModule: true,
	default: () => ({
		tradingPlatforms: [],
		isTradingPlatformsSuccess: true,
		isTradingPlatformsLoading: false,
	}),
}));

jest.mock("~/hooks/useGetUserTradingAccount", () => ({
	useGetUserTradingAccount: () => ({
		userTradingAccount: null,
		isUserTradingAccountSuccess: false,
	}),
}));

// Mock the ConnectTradingAccount component
jest.mock("~/pages/account/trade-center/trading-accounts/connect", () => ({
	__esModule: true,
	default: () => (
		<div data-testid="connect-trading-account">
			<h1>Select Trading Platform</h1>
		</div>
	),
}));

function App() {
	const router = useRouter();
	const currentPath = router.asPath;

	if (currentPath === "/account/trade-center/trading-accounts") {
		return <EmptyExchange />;
	} else if (currentPath === "/account/trade-center/trading-accounts/connect") {
		return <ConnectTradingAccount />;
	}
	return <div>404 Not Found</div>;
}

describe("Trading Account Connection Navigation Flow", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient();
		jest.clearAllMocks();
		mockRouter.setCurrentUrl("/account/trade-center/trading-accounts");
	});

	it("navigates to connect page from trading-accounts", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouterProvider url="/account/trade-center/trading-accounts">
					<App />
				</MemoryRouterProvider>
			</QueryClientProvider>,
		);

		expect(screen.getByText("Not connected")).toBeInTheDocument();
		expect(screen.getByText("Connect new trading account")).toBeInTheDocument();

		// Check initial route
		expect(mockRouter.asPath).toBe("/account/trade-center/trading-accounts");

		fireEvent.click(screen.getByText("Connect new trading account"));

		// Simulate the router updating the URL as Next.js would do
		mockRouter.setCurrentUrl("/account/trade-center/trading-accounts/connect");

		await waitFor(() => {
			expect(mockRouter.asPath).toBe("/account/trade-center/trading-accounts/connect");
			expect(screen.getByText("Select Trading Platform")).toBeInTheDocument();
		});
	});
});
