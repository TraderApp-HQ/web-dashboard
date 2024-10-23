import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { ITask } from "~/apis/handlers/users/interfaces";
import { LAYOUT_ROUTES, ROUTES } from "~/config/constants";
import { useDeleteTask, useGetAllTasks } from "~/hooks/useTask";
import TaskCenter from "~/pages/admin/task-center";

// Mocking hooks and dependencies
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));
jest.mock("~/hooks/useTask");

describe("Task Center - Admin Home Page", () => {
	const mockPush = jest.fn();
	const mockMutate = jest.fn();

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("Renders home page if there is no task, create task button clicked and Routes to create task", async () => {
		//mock data
		const tasksMockData: ITask[] = [];

		// setup mock implementation of useGetAllTask
		(useGetAllTasks as jest.Mock).mockReturnValue({
			data: tasksMockData,
			isLoading: false,
			isError: false,
			error: null,
		});

		// setup mock implemetation for useDeleteTask
		(useDeleteTask as jest.Mock).mockReturnValue({
			mutate: mockMutate,
			data: { message: "Task deleted successfully." },
			isError: false,
			error: null,
			isSuccess: true,
		});

		// render task center home page
		render(<TaskCenter />);

		// check if useGetAllTasks was called
		expect(useGetAllTasks).toHaveBeenCalled();

		// check if page heading is render
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/task center/i);

		// check for the search input component
		expect(screen.getByRole("searchbox")).toBeInTheDocument();

		// check for the filter button
		expect(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();

		// check for the no task found message
		expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
			/no task recorded yet/i,
		);

		// check for the create new task button
		const createTaskButton = screen.getByRole("button", { name: /create new task/i });
		expect(createTaskButton).toBeInTheDocument();

		// check that button is clickable
		expect(createTaskButton).toBeEnabled();

		// simulate button click
		await userEvent.click(createTaskButton);

		// expect router to have been called with create task route
		expect(mockPush).toHaveBeenCalledWith(
			`${LAYOUT_ROUTES.admin}${ROUTES.taskcenter.home}${ROUTES.taskcenter.create}`,
		);
	});
});
