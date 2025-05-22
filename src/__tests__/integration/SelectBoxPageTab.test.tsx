import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import PageTab from "~/components/AccountLayout/Tabs";

// Mock next/router
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

describe("PageTab with SelectBox Integration", () => {
	const mockPush = jest.fn();
	const mockRouter = {
		push: mockPush,
		query: {},
		asPath: "/account/wallets",
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
	});

	test("renders SelectBox with correct tabs in mobile view", () => {
		const tabs = [
			{ title: "Main", href: "/account/wallets" },
			{ title: "Spot", href: "/account/wallets/spot" },
			{ title: "Futures", href: "/account/wallets/futures" },
		];

		render(<PageTab tabs={tabs} />);

		// Find the SelectBox component (only visible in mobile view)
		const selectBoxElements = screen.getAllByTestId("Main");
		const selectBox = selectBoxElements.find((element) => element.classList.contains("flex"));
		expect(selectBox).toBeInTheDocument();
	});

	test("selecting an option in SelectBox navigates to the correct route", async () => {
		const tabs = [
			{ title: "Main", href: "/account/wallets" },
			{ title: "Spot", href: "/account/wallets/spot" },
			{ title: "Futures", href: "/account/wallets/futures" },
		];

		render(<PageTab tabs={tabs} />);

		const selectBoxElements = screen.getAllByTestId("Main");
		const selectBox = selectBoxElements.find((element) => element.classList.contains("flex"));

		if (!selectBox) {
			throw new Error("Could not find SelectBox element with flex class");
		}
		fireEvent.click(selectBox);

		const spotOption = await screen.findByTestId("Spot button");
		fireEvent.click(spotOption);

		expect(mockPush).toHaveBeenCalledWith("/account/wallets/spot");
	});

	test("SelectBox updates selection when route changes", async () => {
		const tabs = [
			{ title: "Main", href: "/account/wallets" },
			{ title: "Spot", href: "/account/wallets/spot" },
			{ title: "Futures", href: "/account/wallets/futures" },
		];

		const { rerender } = render(<PageTab tabs={tabs} />);

		// Initially shows "Main" as selected
		expect(screen.getAllByTestId("Main")[0]).toBeInTheDocument();

		// Update router path to simulate navigation
		(useRouter as jest.Mock).mockReturnValue({
			...mockRouter,
			asPath: "/account/wallets/spot",
		});

		rerender(<PageTab tabs={tabs} />);

		await waitFor(() => {
			expect(screen.getByTestId("Spot")).toBeInTheDocument();
		});
	});

	test("works with query-based tabs", async () => {
		const tabs = [
			{ title: "All Tasks", href: "/account/task-center", query: "all" },
			{ title: "Pending", href: "/account/task-center", query: "pending" },
			{ title: "Completed", href: "/account/task-center", query: "completed" },
		];

		(useRouter as jest.Mock).mockReturnValue({
			...mockRouter,
			query: { task: "all" },
			asPath: "/account/task-center",
		});

		render(<PageTab tabs={tabs} />);

		const selectBoxElements = screen.getAllByTestId("All Tasks");

		const selectBox = selectBoxElements.find(
			(element) =>
				element.classList.contains("flex") && element.textContent?.includes("All Tasks"),
		);

		if (!selectBox) {
			throw new Error(
				"Could not find SelectBox element with flex class and 'All Tasks' text",
			);
		}

		fireEvent.click(selectBox as Element);

		const pendingOption = await screen.findByTestId("Pending button");
		fireEvent.click(pendingOption);

		expect(mockPush).toHaveBeenCalledWith({ query: { task: "pending" } }, undefined, {
			shallow: true,
		});
	});
});
