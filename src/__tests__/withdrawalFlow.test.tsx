import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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
					supportNetworks: [
						{
							name: "TRON",
							slug: "TRON",
							precision: 6,
							fees: { average: "8.456253" },
						},
					],
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
		useSendWithdrawalOtp: jest.fn(() => ({
			sendWithdrawalOtp: jest.fn(),
			data: null,
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
		})),
		// NEW: make withdrawal fees available synchronously to bypass debounce timing in component
		useGetWithdrawalFees: jest.fn(() => ({
			getWithdrawalFees: jest.fn(),
			data: { processingFee: 5, networkFee: 8.456253, netAmount: 12 }, // simple, valid fees
			isPending: false,
			isSuccess: true,
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

describe("Withdraw page end-to-end validations", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();

		// Re-seed default mocked hook implementations to avoid cross‑test leakage
		const hooks = require("~/hooks/useWallets") as typeof import("~/hooks/useWallets");

		(hooks.useInitiateWithdrawal as jest.Mock).mockReturnValue({
			initiateWithdrawal: jest.fn(),
			data: null,
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
		});

		(hooks.useCompleteWithdrawal as jest.Mock).mockReturnValue({
			completeWithdrawal: jest.fn(),
			data: null,
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
		});

		(hooks.useSendWithdrawalOtp as jest.Mock).mockReturnValue({
			sendWithdrawalOtp: jest.fn(),
			data: null,
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
		});
	});

	afterEach(() => {
		// Ensure timers are restored even if a test fails early
		jest.useRealTimers();
	});

	it("renders core fields", () => {
		renderPage();
		expect(screen.getByText(/Withdraw crypto/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Enter Receiving Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText("Network")).toBeInTheDocument();
		expect(screen.getByLabelText("Currency")).toBeInTheDocument();
		expect(screen.getByLabelText("Amount")).toBeInTheDocument();
	});

	it("shows error when amount is below minimum withdrawal", async () => {
		jest.useFakeTimers(); // Enable fake timers for debounce
		renderPage();

		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		const usdtOption = screen.getByTestId("USDT button");
		fireEvent.click(usdtOption);

		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "4" } }); // Below minimum of 5 USDT

		// Advance timers to trigger debounce
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() =>
			expect(
				screen.getByText(/Amount is below the minimum withdrawal of 6 USDT/i),
			).toBeInTheDocument(),
		);
		jest.useRealTimers();
	});

	it("shows insufficient balance when amount exceeds available balance", async () => {
		jest.useFakeTimers(); // Enable fake timers for debounce
		renderPage();

		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		const usdtOption = screen.getByTestId("USDT button");
		fireEvent.click(usdtOption);

		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "25" } }); // balance = 20

		// Advance timers to trigger debounce
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() =>
			expect(screen.getByText(/Your balance is insufficient/i)).toBeInTheDocument(),
		);
		jest.useRealTimers();
	});

	it("disables submit button when validation errors exist", async () => {
		jest.useFakeTimers(); // Enable fake timers for debounce
		renderPage();
		const btn = screen.getByRole("button", { name: /Withdraw/i });
		const amountInput = screen.getByPlaceholderText("00.00");
		fireEvent.change(amountInput, { target: { value: "2" } }); // Below minimum

		// Advance timers to trigger debounce
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() => expect(btn).toBeDisabled());
		jest.useRealTimers();
	});

	it("enables submit button for valid amount", async () => {
		jest.useFakeTimers(); // Enable fake timers for debounce
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
		// Valid: amount 15 > fees 13.456253, within balance 20
		fireEvent.change(amountInput, { target: { value: "15" } });
		fireEvent.change(screen.getByPlaceholderText(/Enter Receiving Address/i), {
			target: { value: "TDqExampleAddr" },
		});

		// Advance timers to trigger debounce
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() => expect(btn).not.toBeDisabled());
		jest.useRealTimers();
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

	// NEW: disables resend while pending and does not trigger resend handler
	it("disables 'Resend code' while resend is pending", async () => {
		jest.useFakeTimers();

		// Open OTP modal
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

		const mockSend = jest.fn();
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useSendWithdrawalOtp as jest.Mock
		).mockReturnValue({
			sendWithdrawalOtp: mockSend,
			data: null,
			isPending: true, // pending state
			isSuccess: false,
			isError: false,
			error: null,
		});

		renderPage();

		// Fast-forward countdown to 0 to reveal "Resend code"
		act(() => {
			jest.advanceTimersByTime(90_000);
		});

		// Should show disabled state; clicking shouldn't call resend
		const resend = screen.getByText(/Resending.../i);
		fireEvent.click(resend);
		expect(mockSend).not.toHaveBeenCalled();

		jest.useRealTimers();
	});

	// NEW: countdown resets only on resend success (not on error)
	it("resets countdown only on successful resend", async () => {
		jest.useFakeTimers();

		// Open OTP modal
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

		// Mock hook with internal state to flip success on send
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useSendWithdrawalOtp as jest.Mock
		).mockImplementation(() => {
			const ReactLib = require("react");
			const [pending, setPending] = ReactLib.useState(false);
			const [success, setSuccess] = ReactLib.useState(false);
			const sendWithdrawalOtp = jest.fn(() => {
				setPending(false);
				setSuccess(true);
			});
			return {
				sendWithdrawalOtp,
				data: { withdrawalRequestId: "req456" },
				isPending: pending,
				isSuccess: success,
				isError: false,
				error: null,
			};
		});

		renderPage();

		// Reach 0 to show "Resend code"
		act(() => {
			jest.advanceTimersByTime(90_000);
		});

		// Click resend -> success -> countdown should reset to "Retry in 1:30"
		fireEvent.click(screen.getByText(/Resend code/i));
		await waitFor(() => expect(screen.getByText(/Retry in/i)).toBeInTheDocument());
		expect(screen.getByText(/Retry in 1:30/i)).toBeInTheDocument();

		// Now mock error case (no reset)
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useSendWithdrawalOtp as jest.Mock
		).mockImplementation(() => {
			const ReactLib = require("react");
			const [error, setError] = ReactLib.useState(false);
			const sendWithdrawalOtp = jest.fn(() => setError(true));
			return {
				sendWithdrawalOtp,
				data: null,
				isPending: false,
				isSuccess: false, // no success
				isError: error,
				error: error ? new Error("resend failed") : null,
			};
		});

		// Fast-forward again to 0 to show "Resend code"
		act(() => {
			jest.advanceTimersByTime(90_000);
		});
		expect(screen.getByText(/Resend code/i)).toBeInTheDocument();

		// Click resend -> error -> still shows "Resend code" (no reset)
		fireEvent.click(screen.getByText(/Resend code/i));
		await waitFor(() => expect(screen.getByText(/Resend code/i)).toBeInTheDocument());

		jest.useRealTimers();
	});

	// NEW: uses updated withdrawalRequestId from resend when completing
	it("uses updated withdrawalRequestId from resend data to complete withdrawal", async () => {
		jest.useFakeTimers();

		// Open OTP modal with initial id
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

		// Mock resend to succeed with a new id
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useSendWithdrawalOtp as jest.Mock
		).mockImplementation(() => {
			const ReactLib = require("react");
			const [success, setSuccess] = ReactLib.useState(false);
			const [data, setData] = ReactLib.useState(null);
			const sendWithdrawalOtp = jest.fn(() => {
				setData({ withdrawalRequestId: "req456" });
				setSuccess(true);
			});
			return {
				sendWithdrawalOtp,
				data,
				isPending: false,
				isSuccess: success,
				isError: false,
				error: null,
			};
		});

		const mockComplete = jest.fn();
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

		// Reach 0 and click resend -> updates currentWithdrawalRequestId to req456
		act(() => {
			jest.advanceTimersByTime(90_000);
		});
		fireEvent.click(screen.getByText(/Resend code/i));

		// Enter OTP and confirm
		const otpInputs = screen.getAllByTestId(/otp-input-/);
		otpInputs.forEach((input, index) => {
			fireEvent.change(input, { target: { value: (index + 1).toString() } });
		});
		fireEvent.click(screen.getByText(/Confirm/i));

		expect(mockComplete).toHaveBeenCalledWith({
			userId: "user-1",
			otp: "123456",
			withdrawalRequestId: "req456", // updated id from resend
		});

		jest.useRealTimers();
	});

	// NEW: continues using the same withdrawalRequestId after resend
	it("continues using the same withdrawalRequestId after resend", async () => {
		jest.useFakeTimers();

		// Open OTP modal with initial id
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

		// Resend succeeds but returns the SAME id (app behavior)
		(
			(require("~/hooks/useWallets") as typeof import("~/hooks/useWallets"))
				.useSendWithdrawalOtp as jest.Mock
		).mockImplementation(() => {
			const ReactLib = require("react");
			const [success, setSuccess] = ReactLib.useState(false);
			const [data, setData] = ReactLib.useState(null);
			const sendWithdrawalOtp = jest.fn(() => {
				setData({ withdrawalRequestId: "req123" }); // same id
				setSuccess(true);
			});
			return {
				sendWithdrawalOtp,
				data,
				isPending: false,
				isSuccess: success,
				isError: false,
				error: null,
			};
		});

		const mockComplete = jest.fn();
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

		// Reach 0 and click resend -> keeps currentWithdrawalRequestId as req123
		act(() => {
			jest.advanceTimersByTime(90_000);
		});
		fireEvent.click(screen.getByText(/Resend code/i));

		// Enter OTP and confirm
		const otpInputs = screen.getAllByTestId(/otp-input-/);
		otpInputs.forEach((input, index) => {
			fireEvent.change(input, { target: { value: (index + 1).toString() } });
		});
		fireEvent.click(screen.getByText(/Confirm/i));

		expect(mockComplete).toHaveBeenCalledWith({
			userId: "user-1",
			otp: "123456",
			withdrawalRequestId: "req123", // unchanged id
		});

		jest.useRealTimers();
	});

	it("shows API-provided error when fee calculation fails", async () => {
		jest.useFakeTimers();
		const hooks = require("~/hooks/useWallets") as typeof import("~/hooks/useWallets");
		(hooks.useGetWithdrawalFees as jest.Mock).mockReturnValue({
			getWithdrawalFees: jest.fn(),
			data: undefined,
			isPending: false,
			isSuccess: false,
			isError: true,
			error: new Error("Some withdrawal fee error"),
		});

		renderPage();

		// Must select currency so amountError is evaluated
		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		fireEvent.click(screen.getByTestId("USDT button"));

		const networkSelect = screen.getByTestId("Select Network");
		fireEvent.click(networkSelect);
		fireEvent.click(screen.getByTestId("TRON button"));

		// Enter amount above minimum and within balance
		fireEvent.change(screen.getByPlaceholderText("00.00"), { target: { value: "12" } });

		// Advance timers to trigger debounce
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() =>
			expect(screen.getByText(/Some withdrawal fee error/i)).toBeInTheDocument(),
		);
		jest.useRealTimers();
	});

	it("shows default error message when fee calculation error has no message", async () => {
		jest.useFakeTimers();
		const hooks = require("~/hooks/useWallets") as typeof import("~/hooks/useWallets");
		(hooks.useGetWithdrawalFees as jest.Mock).mockReturnValue({
			getWithdrawalFees: jest.fn(),
			data: undefined,
			isPending: false,
			isSuccess: false,
			isError: true,
			error: null, // no message -> falls back to default
		});

		renderPage();

		const currencySelect = screen.getByTestId("Select Currency");
		fireEvent.click(currencySelect);
		fireEvent.click(screen.getByTestId("USDT button"));

		const networkSelect = screen.getByTestId("Select Network");
		fireEvent.click(networkSelect);
		fireEvent.click(screen.getByTestId("TRON button"));

		fireEvent.change(screen.getByPlaceholderText("00.00"), { target: { value: "12" } });

		// Advance timers to trigger debounce
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() =>
			expect(screen.getByText(/Failed to calculate withdrawal fees/i)).toBeInTheDocument(),
		);
		jest.useRealTimers();
	});
});
