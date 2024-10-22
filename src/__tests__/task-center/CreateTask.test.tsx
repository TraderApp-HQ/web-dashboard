import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { platformsMockData } from "~/components/AdminLayout/taskCenter/testData";
import { useCreateTask, useGetTaskPlatforms, useUpdateTask } from "~/hooks/useTask";
import CreateTask from "~/pages/admin/task-center/create-task";

// Mocking hooks and dependencies
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));
jest.mock("~/hooks/useTask");

describe("Task Center - Create Task form", () => {
	const mockPush = jest.fn();
	const mockMutate = jest.fn();

	beforeEach(() => {
		// mock router
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

		// setup mock implementation of useGetTaskPlatforms
		(useGetTaskPlatforms as jest.Mock).mockReturnValue({
			data: platformsMockData,
			isLoading: false,
		});

		//setup mock implementation for useCreateTask
		(useCreateTask as jest.Mock).mockReturnValue({
			mutate: mockMutate,
			error: null,
			isError: false,
			isPending: false,
			data: { message: "Task successfully added." },
		});

		//setup mock implementation for useUpdateTask
		(useUpdateTask as jest.Mock).mockReturnValue({
			mutate: mockMutate,
			error: null,
			isError: false,
			isPending: false,
			data: { message: "Task updated successfully." },
		});

		// render task center home page
		render(<CreateTask />);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("Renders Create task form", () => {
		// check if useGetTaskPlatforms was called
		expect(useGetTaskPlatforms).toHaveBeenCalled();

		// check for the form title
		expect(screen.getByTestId("create-new-task-form")).toBeInTheDocument();
		expect(screen.getByTestId("create-new-task-form")).toHaveTextContent(/create new task/i);

		// check that create task form is rendered
		expect(screen.getByTestId("create-task-form")).toBeInTheDocument();
	});

	test("Fill the create task form and call the create task function", async () => {
		// check that create task form is rendered
		expect(screen.getByTestId("create-task-form")).toBeInTheDocument();

		// check for the create new task button
		const createTaskButton = screen.getByRole("button", { name: /create new task/i });
		expect(createTaskButton).toBeInTheDocument();

		// check that button is not clickable
		expect(createTaskButton).not.toBeEnabled();

		// check for the title input field and the event
		const titleInput = screen.getByTestId("Title");
		expect(titleInput).toBeInTheDocument();
		// simulate title input
		await userEvent.type(titleInput, "Task Title");
		expect(titleInput).toHaveValue("Task Title");

		// check for the description field and the event

		const descriptionInput = screen.getByPlaceholderText(/Provide task description/i);

		expect(descriptionInput).toBeInTheDocument();
		// simulate description input
		await userEvent.type(descriptionInput, "Task desciption for users");
		expect(descriptionInput).toHaveValue("Task desciption for users");

		// check for the objective field and the event
		const objectiveInput = screen.getByTestId("Objective(Optional)");
		expect(objectiveInput).toBeInTheDocument();
		// simulate objective input
		await userEvent.type(objectiveInput, "Task Objective");
		expect(objectiveInput).toHaveValue("Task Objective");

		// check for the task type selection and the event
		const taskTypeSelectButton = screen.getByTestId(/select task type/i);
		const taskTypePlaceholderElement = screen.getByRole("button", {
			name: /select task type/i,
		});

		expect(taskTypeSelectButton).toBeInTheDocument();
		expect(taskTypeSelectButton).toContainElement(taskTypePlaceholderElement);

		// simulate dropdown selection for task type
		await userEvent.click(taskTypeSelectButton);
		const permanentTaskButton = screen.getByTestId(/permanent button/i);
		const timeBasedTaskButton = screen.getByTestId(/time based button/i);
		expect(permanentTaskButton).toBeInTheDocument();
		expect(timeBasedTaskButton).toBeInTheDocument();
		await userEvent.click(permanentTaskButton);
		expect(screen.getByText(/permanent/i)).toBeInTheDocument();

		// check for the category selection and the event
		const categorySelectButton = screen.getByTestId(/select task category/i);
		const categoryPlaceholderElement = screen.getByRole("button", {
			name: /select task category/i,
		});

		expect(categorySelectButton).toBeInTheDocument();
		expect(categorySelectButton).toContainElement(categoryPlaceholderElement);

		// simulate dropdown selection for task category
		await userEvent.click(categorySelectButton);
		const contentButton = screen.getByTestId(/content creation button/i);
		expect(contentButton).toBeInTheDocument();
		await userEvent.click(contentButton);
		expect(screen.getByText(/content creation/i)).toBeInTheDocument();

		// check for the objective field and the event
		const pointInput = screen.getByTestId(/points/i);
		expect(pointInput).toBeInTheDocument();
		// simulate objective input
		await userEvent.type(pointInput, "50");
		expect(pointInput).toHaveValue(50);

		// simulate button click
		await userEvent.click(createTaskButton);

		// expect useCreateTask to have been called
		expect(useCreateTask).toHaveBeenCalled();
	});
});
