import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "~/pages/auth/signup";
import mockRouter from "next-router-mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

// Mock the Next.js router
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const signupUserMock = jest.fn().mockResolvedValue({
	isSuccess: true,
	data: {
		id: "12345",
		email: "john.doe@example.com",
	},
});

// Mock the `getAllCountries` and `signupUser` method on `usersService`
jest.mock("~/apis/handlers/users", () => {
	return {
		UsersService: jest.fn().mockImplementation(() => ({
			getAllCountries: jest.fn().mockResolvedValue([
				{ _id: "89", name: "Nigeria", flag: "/nigeria-flag.png" },
				{ _id: "90", name: "Ghana", flag: "/ghana-flag.png" },
			]),
			signupUser: signupUserMock,
			verifyOtp: jest.fn().mockResolvedValue({
				isSuccess: true,
			}),
		})),
	};
});

xdescribe("SignUp Page", () => {
	let queryClient: QueryClient;

	beforeEach(async () => {
		queryClient = new QueryClient();

		// Set the initial url:
		mockRouter.push("/auth/signup");

		render(
			<QueryClientProvider client={queryClient}>
				<SignUp />
			</QueryClientProvider>,
		);
	});

	afterEach(() => {
		queryClient.clear(); // Ensure cleanup after each test
		signupUserMock.mockClear(); // Clear mock calls between tests
	});

	test("SignUp form is rendered and submit button is disabled", async () => {
		const header = screen.getByTestId("heading");
		const signupButton = screen.getByRole("button", { name: /sign up/i });
		const countrySelectButton = screen.getByLabelText(/country/i);

		expect(header).toHaveTextContent(/lets get started/i);
		expect(signupButton).toBeInTheDocument();
		expect(signupButton).toBeDisabled();
		expect(countrySelectButton).toBeInTheDocument();
	});

	test("SignUp form filled, button got enabled and SignUp function is called", async () => {
		// const user = userEvent.setup();
		const signupButton = screen.getByRole("button", { name: /sign up/i });
		const firstNameInput = screen.getByTestId("First");
		const lastNameInput = screen.getByTestId("Last");
		const emailInput = screen.getByTestId("Email");
		const passwordInput = screen.getByTestId("Password");

		// Wait for the inputs to be available before interacting
		await waitFor(() => {
			expect(firstNameInput).toBeInTheDocument();
			expect(lastNameInput).toBeInTheDocument();
			expect(emailInput).toBeInTheDocument();
			expect(passwordInput).toBeInTheDocument();
		});

		// Fill out the form correctly
		await userEvent.type(firstNameInput, "John");
		await userEvent.type(lastNameInput, "Doe");
		await userEvent.type(emailInput, "john.doe@example.com");
		await userEvent.type(passwordInput, "Test12345@");

		expect(firstNameInput).toHaveValue("John");
		expect(lastNameInput).toHaveValue("Doe");
		expect(emailInput).toHaveValue("john.doe@example.com");
		expect(passwordInput).toHaveValue("Test12345@");

		// Simulate selecting a country
		const countrySelectDropdown = screen.getByTestId("Select country");
		expect(countrySelectDropdown).toBeInTheDocument();

		// Click to open the dropdown
		await userEvent.click(countrySelectDropdown);

		// Wait for the options to appear
		const nigeria = await screen.findByTestId("Nigeria button");
		expect(nigeria).toBeInTheDocument();

		const ghana = await screen.findByTestId("Ghana button");
		expect(ghana).toBeInTheDocument();

		// Click to select Nigeria
		await userEvent.click(nigeria);

		// The country should now be selected, and the button should be enabled
		await waitFor(() => expect(signupButton).not.toBeDisabled());

		// Simulate clicking the sign-up button
		await userEvent.click(signupButton);

		// Ensure the `signupUser` method is called with the correct values
		expect(signupUserMock).toHaveBeenCalledWith({
			firstName: "John",
			lastName: "Doe",
			email: "john.doe@example.com",
			password: "Test12345@",
			countryName: "Nigeria",
			countryId: 89,
		});
	});
});
