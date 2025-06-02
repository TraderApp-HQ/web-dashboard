import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PageTab from ".";
import { useRouter } from "next/router";
import { ISelectBoxOption } from "~/components/interfaces";

jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

// Mock SelectBox for dropdown testing
jest.mock("~/components/common/SelectBox", () => {
	const MockSelectBox = ({
		options,
		option,
		setOption,
	}: {
		options: ISelectBoxOption[];
		option?: ISelectBoxOption;
		setOption?: (option: ISelectBoxOption) => void;
	}) => (
		<select
			data-testid="select-box"
			value={option?.value}
			onChange={(e) =>
				setOption &&
				setOption(options.find((o) => o.value === e.target.value) as ISelectBoxOption)
			}
		>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.displayText}
				</option>
			))}
		</select>
	);

	MockSelectBox.displayName = "MockSelectBox";
	return MockSelectBox;
});

describe("PageTab component", () => {
	const tabs = [
		{ title: "Trading Accounts", href: "/trade-center/trading-accounts" },
		{ title: "Open Trades", href: "/trade-center/open-trades" },
		{ title: "Trades History", href: "/trade-center/trades-history" },
	];

	test("renders all tabs with correct titles (desktop view)", () => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/trade-center/trading-accounts",
			query: {},
			push: jest.fn(),
		});

		render(<PageTab tabs={tabs} />);

		expect(screen.getByRole("link", { name: "Trading Accounts" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Open Trades" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Trades History" })).toBeInTheDocument();
	});

	test("marks correct tab as active based on path", () => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/trade-center/open-trades",
			query: {},
			push: jest.fn(),
		});

		render(<PageTab tabs={tabs} />);

		const openTradesTab = screen.getByRole("link", { name: "Open Trades" });
		const tradingAccountsTab = screen.getByRole("link", { name: "Trading Accounts" });
		const tradeHistoryTab = screen.getByRole("link", { name: "Trades History" });

		// Check that the Open Trades tab has active classes
		expect(openTradesTab).toHaveClass("border-blue-800", "text-blue-800");

		// Check that other tabs don't have active classes
		expect(tradingAccountsTab).not.toHaveClass("border-blue-800");
		expect(tradeHistoryTab).not.toHaveClass("border-blue-800");
	});

	test("marks correct tab as active based on query", () => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/account/reward-hub/task-center",
			query: { task: "pending" },
			push: jest.fn(),
		});

		const taskTabs = [
			{ title: "All Tasks", href: "/account/reward-hub/task-center", query: "all" },
			{ title: "Pending Tasks", href: "/account/reward-hub/task-center", query: "pending" },
			{
				title: "Completed Tasks",
				href: "/account/reward-hub/task-center",
				query: "completed",
			},
		];

		render(<PageTab tabs={taskTabs} />);

		const allTasksTab = screen.getByRole("link", { name: "All Tasks" });
		const pendingTasksTab = screen.getByRole("link", { name: "Pending Tasks" });
		const completedTasksTab = screen.getByRole("link", { name: "Completed Tasks" });

		// Check that the Pending Tasks tab has active classes
		expect(pendingTasksTab).toHaveClass("border-blue-800", "text-blue-800");

		// Check that other tabs don't have active classes
		expect(allTasksTab).not.toHaveClass("border-blue-800");
		expect(completedTasksTab).not.toHaveClass("border-blue-800");
	});

	test("dropdown shows the correct selected option based on current path", () => {
		// Set up router with specific path
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/trade-center/open-trades",
			query: {},
			push: jest.fn(),
		});

		render(<PageTab tabs={tabs} />);

		const selectBox = screen.getByTestId("select-box");
		expect(selectBox).toHaveValue("/trade-center/open-trades");

		const options = screen.getAllByRole("option") as HTMLOptionElement[];
		const selectedOption = options.find((option) => option.selected);
		expect(selectedOption).toHaveTextContent("Open Trades");

		// Check that other options are not selected
		const tradingAccountsOption = screen
			.getAllByRole("option")
			.find((option) => option.textContent === "Trading Accounts") as HTMLOptionElement;
		const tradesHistoryOption = screen
			.getAllByRole("option")
			.find((option) => option.textContent === "Trades History") as HTMLOptionElement;

		expect(tradingAccountsOption.selected).toBe(false);
		expect(tradesHistoryOption.selected).toBe(false);
	});

	test("dropdown select triggers router.push with correct params", () => {
		const pushMock = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/trade-center/open-trades",
			query: {},
			push: pushMock,
		});

		render(<PageTab tabs={tabs} />);

		fireEvent.change(screen.getByTestId("select-box"), {
			target: { value: "/trade-center/trades-history" },
		});

		expect(pushMock).toHaveBeenCalledWith("/trade-center/trades-history");
	});

	test("dropdown select with query param triggers router.push with correct query", () => {
		const pushMock = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/tasks",
			query: {},
			push: pushMock,
		});

		const testTabs = [
			{ title: "All Tasks", href: "/tasks" },
			{ title: "Pending", href: "/tasks/pending", query: "pending" },
		];

		render(<PageTab tabs={testTabs} />);

		fireEvent.change(screen.getByTestId("select-box"), {
			target: { value: "/tasks/pending" },
		});

		expect(pushMock).toHaveBeenCalledWith({ query: { task: "pending" } }, undefined, {
			shallow: true,
		});
	});

	test("clicking a tab with query triggers shallow push", () => {
		const pushMock = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/account/reward-hub/task-center",
			query: {},
			push: pushMock,
		});

		const taskTabs = [
			{ title: "All Tasks", href: "/account/reward-hub/task-center", query: "all" },
			{ title: "Pending Tasks", href: "/account/reward-hub/task-center", query: "pending" },
		];

		render(<PageTab tabs={taskTabs} />);
		fireEvent.click(screen.getByRole("link", { name: "Pending Tasks" }));

		expect(pushMock).toHaveBeenCalledWith({ query: { task: "pending" } }, undefined, {
			shallow: true,
		});
	});

	test("clicking a tab without query will navigate directly to href", async () => {
		render(<PageTab tabs={tabs} />);

		const openTradesTab = screen.getByRole("link", { name: "Open Trades" });
		expect(openTradesTab).toHaveAttribute("href", "/trade-center/open-trades");
	});

	test("clicking an already active tab does not trigger navigation", () => {
		const pushMock = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/trade-center/open-trades",
			query: {},
			push: pushMock,
		});

		render(<PageTab tabs={tabs} />);

		const activeTab = screen.getByRole("link", { name: "Open Trades" });
		fireEvent.click(activeTab);

		expect(pushMock).not.toHaveBeenCalled();
	});
});
