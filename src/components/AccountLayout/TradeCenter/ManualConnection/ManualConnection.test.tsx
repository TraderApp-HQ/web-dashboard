import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ManualConnection from ".";

// Mock the custom hook
jest.mock("~/hooks/useCopyToClipboard", () => ({
	useCopyToClipboard: () => ({
		copyToClipboard: jest.fn(),
		copyMessage: "Copied!",
	}),
}));

describe("Given trading account manual connection", () => {
	const mockHandleManualConnection = jest.fn();
	const mockSetApiKey = jest.fn();
	const mockSetApiSecret = jest.fn();

	const defaultProps = {
		handleManualConnection: mockHandleManualConnection,
		setApiKey: mockSetApiKey,
		setApiSecret: mockSetApiSecret,
		ipString: "192.168.1.1, 172.168.1.1",
		// isIpAddressWhitelistRequired: false,
	};

	it("renders the component and displays the correct elements with ip address whitelist supported", () => {
		render(
			<ManualConnection
				isError={false}
				error={null}
				isSubmitDisabled={false}
				isIpAddressWhitelistRequired={true}
				{...defaultProps}
			/>,
		);

		// Check if InputFields are rendered
		expect(screen.getByLabelText("API Key")).toBeInTheDocument();
		expect(screen.getByLabelText("API Secret")).toBeInTheDocument();

		// Check if IP Address InputField is rendered with the correct placeholder
		expect(screen.getByPlaceholderText("192.168.1.1, 172.168.1.1")).toBeInTheDocument();

		// Check if Button is rendered and not disabled
		expect(screen.getByText("Connect")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /connect/i })).toBeEnabled();

		// Check if Link is rendered
		expect(screen.getByText("How to Connect")).toBeInTheDocument();
	});

	it("renders the component and displays the correct elements with ip address whitelist not supported", () => {
		render(
			<ManualConnection
				isError={false}
				error={null}
				isSubmitDisabled={false}
				isIpAddressWhitelistRequired={false}
				{...defaultProps}
			/>,
		);

		// Check if InputFields are rendered
		expect(screen.getByLabelText("API Key")).toBeInTheDocument();
		expect(screen.getByLabelText("API Secret")).toBeInTheDocument();

		// Check if Button is rendered and not disabled
		expect(screen.getByText("Connect")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /connect/i })).toBeEnabled();

		// Check if Link is rendered
		expect(screen.getByText("How to Connect")).toBeInTheDocument();
	});

	it("handles the copy functionality correctly", async () => {
		render(
			<ManualConnection
				isError={false}
				error={null}
				isSubmitDisabled={false}
				isIpAddressWhitelistRequired={true}
				{...defaultProps}
			/>,
		);

		// Simulate the copy icon click
		fireEvent.click(screen.getByTestId("copy-icon"));

		// Wait for the toast message to appear
		await waitFor(() => {
			expect(screen.getByText("Copied!")).toBeInTheDocument();
		});
	});

	it("handles form inputs changes", () => {
		render(
			<ManualConnection
				isError={false}
				error={null}
				isSubmitDisabled={false}
				isIpAddressWhitelistRequired={true}
				{...defaultProps}
			/>,
		);

		// Simulate entering text in API Key input field
		fireEvent.change(screen.getByPlaceholderText("Enter API Key"), {
			target: { value: "new-api-key" },
		});
		expect(mockSetApiKey).toHaveBeenCalledWith("new-api-key");

		// Simulate entering text in Secret Key input field
		fireEvent.change(screen.getByPlaceholderText("Enter API Secret"), {
			target: { value: "new-secret-key" },
		});
		expect(mockSetApiSecret).toHaveBeenCalledWith("new-secret-key");
	});

	it("handles disabled state of the submit button", () => {
		render(
			<ManualConnection
				isError={false}
				error={null}
				isSubmitDisabled={true}
				isIpAddressWhitelistRequired={true}
				{...defaultProps}
			/>,
		);

		// Check if Button is disabled
		expect(screen.getByRole("button", { name: /connect/i })).toBeDisabled();
	});
});
