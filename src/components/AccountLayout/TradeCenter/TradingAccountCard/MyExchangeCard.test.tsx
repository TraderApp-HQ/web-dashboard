import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClientProvider and QueryClient
import MyExchangeCard from ".";
import { AccountType, Category, Currency } from "~/config/enum";
import {
	AccountConnectionStatus,
	ConnectionType,
	TradingPlatform,
} from "~/apis/handlers/trading-engine/enums";
import { useRouter } from "next/router";
import { ITradingAccountInfo } from "~/apis/handlers/trading-engine/interfaces";
import { AccountTypeValues, TradingPlatformValues } from "~/config/constants";

// Mock the next/router module
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

describe("MyExchangeCard", () => {
	let mockPush: jest.Mock;

	beforeEach(() => {
		mockPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
	});
	const queryClient = new QueryClient();

	beforeAll(() => {
		process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL = "http://localhost:8081";
		process.env.NEXT_PUBLIC_TRADING_ENGINE_SERVICE_API_URL = "http://localhost:8080";
	});

	const tradingAccount: ITradingAccountInfo = {
		accountId: "1",
		userId: "user-1",
		platformName: TradingPlatform.BINANCE,
		platformId: 270,
		platformLogo: "/path/to/logo.png",
		apiKey: "onsfovnosbsb",
		apiSecret: "bkdlbsnbs",
		externalAccountUserId: "binance-user-1",
		isWithdrawalEnabled: false,
		isFuturesTradingEnabled: true,
		isSpotTradingEnabled: true,
		isIpAddressWhitelisted: true,
		connectionStatus: AccountConnectionStatus.CONNECTED,
		errorMessages: [],
		category: Category.CRYPTO,
		connectionType: ConnectionType.MANUAL,
		balances: [
			{
				currency: Currency.USDT,
				availableBalance: 0,
				lockedBalance: 0,
				accountType: AccountType.FUTURES,
			},
		],
	};

	const tradingAccount2: ITradingAccountInfo = {
		...tradingAccount,
		connectionStatus: AccountConnectionStatus.FAILED,
	};

	const defaultProps = {
		tradingAccount,
		refetchTradingAccounts: () => {},
	};

	const renderWithQueryClient = (ui: React.ReactNode) =>
		render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

	it("renders the component with correct elements", () => {
		renderWithQueryClient(<MyExchangeCard {...defaultProps} />);

		// Check if logo and name(alt value) are rendered
		expect(screen.getByAltText(tradingAccount.platformName)).toBeInTheDocument();
		expect(
			screen.getByText(TradingPlatformValues[tradingAccount.platformName]),
		).toBeInTheDocument();

		// Check if the dropdown menu is rendered
		expect(screen.getByRole("button")).toBeInTheDocument(); // Assuming DropdownMenu trigger is a button

		// Check if the connection status is rendered correctly
		expect(screen.getByText("Connected")).toBeInTheDocument();
	});

	it("displays the correct connection status", () => {
		renderWithQueryClient(
			<MyExchangeCard tradingAccount={tradingAccount2} refetchTradingAccounts={() => {}} />,
		);
		expect(screen.getByText("Failed")).toBeInTheDocument();
	});

	it("handles account selection", () => {
		renderWithQueryClient(<MyExchangeCard {...defaultProps} />);

		// Check if SelectBox is rendered and options are available
		const selectBox = screen.getByText(/Futures/i);
		fireEvent.click(selectBox);

		const spotOptions = screen.queryAllByText(AccountTypeValues[AccountType.FUTURES]);
		expect(spotOptions.length).toBeGreaterThan(0);
	});

	it("interacts with the dropdown menu", () => {
		renderWithQueryClient(<MyExchangeCard {...defaultProps} />);

		// Open dropdown menu
		fireEvent.click(screen.getByRole("button")); // Assuming dropdown trigger is a button

		// Check if menu items are rendered
		expect(screen.getByText("Refresh Connection")).toBeInTheDocument();
		expect(screen.getByText("Replace API Keys")).toBeInTheDocument();
		expect(screen.getByText("Delete Account")).toBeInTheDocument();
		expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
		expect(screen.getByTestId("replace-icon")).toBeInTheDocument();
		expect(screen.getByTestId("refresh-icon")).toBeInTheDocument();
	});
});
