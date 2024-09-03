import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import ExchangeConnection from ".";
import { server } from "~/mocks/server";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock the next/router module
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

describe("Connect Component", () => {
	let mockPush: jest.Mock;
	const queryClient = new QueryClient();

	beforeEach(() => {
		mockPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
	});

	beforeAll(() => {
		server.listen();
		jest.resetModules(); // Clears the cache to ensure that the new environment variables are used
		process.env = {
			...process.env, // Keep other environment variables intact
			NEXT_PUBLIC_USERS_SERVICE_API_URL: "http://localhost:8080",
			NEXT_PUBLIC_ASSETS_SERVICE_API_URL: "baseurl",
		};
	});

	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	test.only("get all mocked exchanges", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<ExchangeConnection />
			</QueryClientProvider>,
		);

		// Wait for the exchange elements to be displayed
		const binanceElement = screen.getByText("Binance");
		const kucoinElement = await waitFor(() => screen.getByText("kucoin"));

		// // Ensure exchange names are displayed
		expect(binanceElement).toBeInTheDocument();
		expect(kucoinElement).toBeInTheDocument();

		// // Check that the logos are displayed with correct alt text
		const binanceLogo = screen.getByAltText("binance logo");
		const kucoinLogo = screen.getByAltText("kucoin logo");

		expect(binanceLogo).toBeInTheDocument();
		expect(kucoinLogo).toBeInTheDocument();
	});

	test("displays changed mocked Exchanges", async () => {
		server.use(
			rest.get("/exchanges", (req, res, ctx) => {
				return res(
					ctx.status(200),
					ctx.json({
						data: [
							{
								id: "1",
								name: "bybit",
								logo: "bybit logo",
								isConnected: true,
							},
							{
								id: "2",
								name: "gate",
								logo: "gate logo",
								isConnected: true,
							},
						],
					}),
				);
			}),
		);
		render(
			<QueryClientProvider client={queryClient}>
				<ExchangeConnection />
			</QueryClientProvider>,
		);

		// Wait for the elements to appear on the screen
		const bybitElement = await waitFor(() => screen.getByText("bybit"));
		const gateElement = await waitFor(() => screen.getByTestId("gate-gate"));

		// Assert that the exchanges are rendered
		expect(bybitElement).toBeInTheDocument();
		expect(gateElement).toBeInTheDocument();

		// Verify that the logos are displayed with the correct alt text
		const bybitLogo = screen.getByAltText("bybit");
		const gateLogo = screen.getByAltText("gate");

		expect(bybitLogo).toBeInTheDocument();
		expect(gateLogo).toBeInTheDocument();
	});

	test("handles server error", async () => {
		server.use(
			rest.get("/exchanges", (req, res, ctx) => {
				return res(ctx.status(500), ctx.json({ message: "Internal Server Error" }));
			}),
		);

		render(
			<QueryClientProvider client={queryClient}>
				<ExchangeConnection />
			</QueryClientProvider>,
		);
		const errorElement = await waitFor(() => screen.getByText(/Error:/));
		expect(errorElement).toBeInTheDocument();
	});
});
