import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClientProvider and QueryClient
import MyExchangeCard from ".";
import { AccountType, Category, Currency } from "~/config/enum";
import { AccountConnectionStatus } from "~/apis/handlers/trading-engine/enums";

describe("MyExchangeCard", () => {
	const queryClient = new QueryClient();

	beforeAll(() => {
		process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL = "http://localhost:8081";
		process.env.NEXT_PUBLIC_TRADING_ENGINE_SERVICE_API_URL = "http://localhost:8080";
	});

	const defaultProps = {
		id: "1",
		plaformLogo: "/path/to/logo.png",
		platformName: "Exchange Name",
		connectionStatus: AccountConnectionStatus.CONNECTED,
		category: Category.CRYPTO,
		balances: [
			{
				currency: Currency.USDT,
				availableBalance: 5000,
				lockedBalance: 0.444,
				accountType: AccountType.SPOT,
			},
		],
		errorMessages: [],
		platformId: 122,
		refetchAccounts: () => {},
	};

	const renderWithQueryClient = (ui: React.ReactNode) =>
		render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

	it("renders the component with correct elements", () => {
		renderWithQueryClient(<MyExchangeCard {...defaultProps} />);

		// Check if logo and name(alt value) are rendered
		expect(screen.getByAltText("Exchange Name")).toBeInTheDocument();
		expect(screen.getByText("Exchange Name")).toBeInTheDocument();

		// Check if the dropdown menu is rendered
		expect(screen.getByRole("button")).toBeInTheDocument(); // Assuming DropdownMenu trigger is a button

		// Check if the connection status is rendered correctly
		expect(screen.getByText("Connected")).toBeInTheDocument();
	});

	it("displays the correct connection status", () => {
		renderWithQueryClient(
			<MyExchangeCard {...defaultProps} connectionStatus={AccountConnectionStatus.FAILED} />,
		);
		expect(screen.getByText("Failed")).toBeInTheDocument();
	});

	it("handles account selection", () => {
		renderWithQueryClient(<MyExchangeCard {...defaultProps} />);

		// Check if SelectBox is rendered and options are available
		const selectBox = screen.getByText(/spot/i);
		fireEvent.click(selectBox);

		const spotOptions = screen.queryAllByText(AccountType.SPOT);
		expect(spotOptions.length).toBeGreaterThan(0);
	});

	it("interacts with the dropdown menu", () => {
		renderWithQueryClient(<MyExchangeCard {...defaultProps} />);

		// Open dropdown menu
		fireEvent.click(screen.getByRole("button")); // Assuming dropdown trigger is a button

		// Check if menu items are rendered
		expect(screen.getByText("Replace API Key")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
		expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
		expect(screen.getByTestId("replace-icon")).toBeInTheDocument();
	});
});
