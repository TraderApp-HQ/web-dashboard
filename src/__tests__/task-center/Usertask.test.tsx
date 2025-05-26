import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { activeTasksTest } from "~/components/AdminLayout/taskCenter/testData";
import { useGetAllActiveTasks } from "~/hooks/useTask";
import UserTaskDashboard from "~/pages/account/reward-hub/task-center";

// Mocking hooks and dependencies
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));
jest.mock("~/hooks/useTask");

describe("User Task Center", () => {
	const mockPush = jest.fn();
	const mockRefetch = jest.fn();

	beforeEach(() => {
		// mock router
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
			query: {
				rows: "10",
				page: "1",
				task: "all",
			},
		});

		// setup mock implementation of useGetAllActiveTask
		(useGetAllActiveTasks as jest.Mock).mockReturnValue({
			data: activeTasksTest,
			isLoading: false,
			refetch: mockRefetch,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("Renders user task page and task table", async () => {
		// render user task center home page
		render(<UserTaskDashboard />);

		// check if useGetAllActiveTasks was called
		expect(useGetAllActiveTasks).toHaveBeenCalled();

		// Test for page header
		const header = screen.getByRole("heading", { level: 1 });
		expect(header).toHaveTextContent(/tasks center/i);

		// Test for tasks tab
		const allTaskstabLink = screen.getByLabelText(/all tasks/i);
		const pendingTaskstabLink = screen.getByLabelText(/pending tasks/i);
		const completedTaskstabLink = screen.getByLabelText(/completed tasks/i);
		expect(allTaskstabLink).toBeInTheDocument();
		expect(pendingTaskstabLink).toBeInTheDocument();
		expect(completedTaskstabLink).toBeInTheDocument();

		// Test that table is not displayed when no task is found
		const noTask = screen.getByRole("heading", { level: 3 });
		expect(noTask).toHaveTextContent(/no task recorded yet/i);
	});
});
