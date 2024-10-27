import { UsersService } from "~/apis/handlers/users";
import { useCreate } from "../useCreate";
import { useQueryClient } from "@tanstack/react-query";
import { UsersQueryId } from "~/apis/handlers/users/constants";
import { useFetch } from "../useFetch";
import { useCallback } from "react";
import { ICreateTaskFormData } from "~/components/AdminLayout/taskCenter/taskFormData";
import { IGetTasksInput, IGetUserTasksInput, IUserTask } from "~/apis/handlers/users/interfaces";

export const useGetTaskPlatforms = () => {
	const usersService = new UsersService();

	const { data: platforms, isLoading } = useFetch({
		queryKey: [UsersQueryId.taskPlatform],
		queryFn: usersService.getAllActiveTaskPlatforms.bind(usersService),
	});

	return { platforms, isLoading };
};

export const useGetTask = (taskId: string) => {
	const usersService = new UsersService();

	const getTask = useCallback(() => usersService.getTask({ taskId }), [taskId, usersService]);
	const {
		data: task,
		isLoading,
		isError,
		error,
	} = useFetch({
		queryKey: [taskId],
		queryFn: getTask,
	});

	return { task, isLoading, isError, error };
};

export const useGetAllTasks = ({ search, rows, page }: IGetTasksInput) => {
	const usersService = new UsersService();

	// Memoized function to fetch users
	const fetchTasks = useCallback(
		() => usersService.getAllTasks({ rows, page, search }),
		[page, rows, search, usersService],
	);

	const {
		data: tasksDetails,
		isLoading,
		isError,
		error,
		isSuccess,
		refetch,
	} = useFetch({
		queryKey: [UsersQueryId.task, page],
		queryFn: fetchTasks,
	});

	return { tasksDetails, isLoading, isError, error, isSuccess, refetch };
};

export const useGetAllActiveTasks = ({ rows, page, task }: IGetUserTasksInput) => {
	const usersService = new UsersService();

	// Memoized function to fetch users
	const fetchActiveTasks = useCallback(
		() => usersService.getAllActiveTasks({ rows, page, task }),
		[page, rows, task, usersService],
	);

	const {
		data: activeTasks,
		isLoading,
		isSuccess,
	} = useFetch({
		queryKey: [UsersQueryId.activeTasks],
		queryFn: fetchActiveTasks,
	});

	return { activeTasks, isLoading, isSuccess };
};

export const useCreateTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();
	const {
		mutateAsync: createTask,
		data: successMessage,
		isError,
		error,
		isSuccess,
		isPending,
	} = useCreate({
		mutationFn: (data: ICreateTaskFormData) => usersService.createTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { createTask, isPending, isSuccess, successMessage, isError, error };
};

export const useUpdateTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();

	const {
		mutateAsync: updateTask,
		data: updateMessage,
		isError,
		isPending,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: (variables: { taskId: string; data: ICreateTaskFormData }) =>
			usersService.updateTask(variables),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { updateTask, isPending, isSuccess, updateMessage, isError, error };
};

export const useDeleteTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();

	const {
		mutateAsync: deleteTask,
		data: deleteMessage,
		isError,
		error,
		isSuccess,
	} = useCreate({
		mutationFn: (taskId: string) => usersService.deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.task] });
		},
	});

	return { deleteTask, isSuccess, deleteMessage, isError, error };
};

export const useGetUserID = () => {
	const usersService = new UsersService();

	const fetchUser = useCallback(() => usersService.getUser(), [usersService]);
	const { data: userProfile } = useFetch({
		queryKey: ["user"],
		queryFn: fetchUser,
	});

	return userProfile?.id;
};

export const useCreateUserTask = () => {
	const usersService = new UsersService();
	const queryClient = useQueryClient();
	const {
		mutateAsync: createUserTask,
		isError,
		error,
		isSuccess,
		isPending,
	} = useCreate({
		mutationFn: (data: IUserTask) => usersService.createUserTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [UsersQueryId.activeTasks] });
		},
	});

	return { createUserTask, isPending, isSuccess, isError, error };
};

export const useGetUserTask = (taskId: string) => {
	const usersService = new UsersService();

	const getTask = useCallback(() => usersService.getUserTask({ taskId }), [taskId, usersService]);
	const {
		data: task,
		isLoading,
		isError,
		error,
	} = useFetch({
		queryKey: [taskId],
		queryFn: getTask,
	});

	return { task, isLoading, isError, error };
};
