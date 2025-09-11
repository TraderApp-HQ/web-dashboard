import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Withdraw from "~/pages/account/wallets/withdraw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks
jest.mock("next/router", () => ({
	useRouter: () => ({
		push: jest.fn(),
		query: {},
		asPath: "/account/wallets/withdraw",
	}),
}));

jest.mock("~/hooks/useUserProfileData", () => () => ({ userId: "user-1" }));

jest.mock("~/hooks/useWallets", () => {
	const original = jest.requireActual("~/hooks/useWallets");
	return {
		...original,
		useGetUserWalletsBalance: jest.fn(() => ({
			data: {
				wallets: [
					{
						currencySymbol: "USDT",
						availableBalance: 20,
					},
				],
			},
		})),
		useWalletDepositOptions: jest.fn(() => ({
			supportedCurrencies: [{ id: "c1", symbol: "USDT", logoUrl: "", name: "Tether" }],
			paymentOptions: [
				{
					symbol: "USDT",
					paymentMethodId: "pm1",
					providerId: "prov1",
					logoUrl: "",
					supportNetworks: [{ name: "TRON", slug: "TRON", precision: 6 }],
				},
			],
		})),
		useInitiateWithdrawal: jest.fn(() => ({
			initiateWithdrawal: jest.fn(),
			data: null,
			isPending: false,
			isInitiateWithdrawalSuccess: false,
			isError: false,
			error: null,
		})),
		useCompleteWithdrawal: jest.fn(() => ({
			completeWithdrawal: jest.fn(),
			data: null,
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
		})),
	};
});

// Helper render
const renderPage = () => {
	const qc = new QueryClient();
	return render(
		<QueryClientProvider client={qc}>
			<Withdraw />
		</QueryClientProvider>,
	);
};

describe("Withdraw page end‑to‑end validations", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders core fields", () => {
		renderPage();
		expect(screen.getByText(/Withdraw crypto/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Enter Receiving Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText("Network")).toBeInTheDocument();
		expect(screen.getByLabelText("Currency")).toBeInTheDocument();
		expect(screen.getByLabelText("Amount")).toBeInTheDocument();
	});

	it("shows error when amount <= total fees (processing + network)", async () => {
		renderPage();

		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		const usdtOption = screen.getByTestId("USDT button");
		fireEvent.click(usdtOption);

		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "2" } }); // fees = 3
		await waitFor(() =>
			expect(screen.getByText(/Amount must be greater than total fees/i)).toBeInTheDocument(),
		);
	});

	it("shows error when amount is below minimum withdrawal", async () => {
		renderPage();

		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		const usdtOption = screen.getByTestId("USDT button");
		fireEvent.click(usdtOption);

		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "4" } });
		await waitFor(() =>
			expect(
				screen.getByText(/Amount is below the minimum withdrawal of 5 USDT/i),
			).toBeInTheDocument(),
		);
	});

	it("shows insufficient balance when amount exceeds available balance", async () => {
		renderPage();

		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		const usdtOption = screen.getByTestId("USDT button");
		fireEvent.click(usdtOption);

		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "25" } }); // balance = 20
		await waitFor(() =>
			expect(screen.getByText(/Your balance is insufficient/i)).toBeInTheDocument(),
		);
	});

	it("disables submit button when validation errors exist", async () => {
		renderPage();
		const btn = screen.getByRole("button", { name: /Withdraw/i });
		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "2" } });
		await waitFor(() => expect(btn).toBeDisabled());
	});

	it("enables submit button for valid amount", async () => {
		renderPage();

		// Select currency
		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		const usdtOption = screen.getByTestId("USDT button");
		fireEvent.click(usdtOption);

		// Select network
		const networkSelect = screen.getByTestId("Select Network");
		fireEvent.click(networkSelect);
		const tronOption = screen.getByTestId("TRON button");
		fireEvent.click(tronOption);

		const amountInput = screen.getByPlaceholderText("00.00");
		const btn = screen.getByRole("button", { name: /Withdraw/i });
		// Valid: amount 10, fees 3 => net 7, within balance 20
		fireEvent.change(amountInput, { target: { value: "10" } });
		fireEvent.change(screen.getByPlaceholderText(/Enter Receiving Address/i), {
			target: { value: "TDqExampleAddr" },
		});
		await waitFor(() => expect(btn).not.toBeDisabled());
	});

	it("opens OTP modal on successful initiation and handles completion", async () => {
		const mockComplete = jest.fn();
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useInitiateWithdrawal as jest.Mock
		).mockReturnValue({
			initiateWithdrawal: jest.fn(),
			data: { withdrawalRequestId: "req123" },
			isPending: false,
			isSuccess: true,
			isError: false,
			error: null,
		});
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useCompleteWithdrawal as jest.Mock
		).mockReturnValue({
			completeWithdrawal: mockComplete,
			data: null,
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
		});

		renderPage();

		// Simulate OTP input and confirmation
		const otpInputs = screen.getAllByTestId(/otp-input-/);
		otpInputs.forEach((input, index) => {
			fireEvent.change(input, { target: { value: (index + 1).toString() } });
		});
		const confirmBtn = screen.getByText(/Confirm/i);
		fireEvent.click(confirmBtn);

		expect(mockComplete).toHaveBeenCalledWith({
			userId: "user-1",
			otp: "123456",
			withdrawalRequestId: "req123",
		});
	});

	it("shows success modal on completion", async () => {
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useCompleteWithdrawal as jest.Mock
		).mockReturnValue({
			completeWithdrawal: jest.fn(),
			data: {},
			isPending: false,
			isSuccess: true,
			isError: false,
			error: null,
		});

		renderPage();

		await waitFor(() =>
			expect(screen.getByText(/You have successfully withdrawn/i)).toBeInTheDocument(),
		);
	});
});
